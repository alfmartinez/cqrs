import {EventPublisher, EventStore} from "@cqrs-alf/common";
import {createUser, SessionId, UpdateUserStatus, User, UserId} from "@fubattle/user";
import {UserRepository, UserStatusRepository} from "@fubattle/user";
import {NextFunction, Request, Response, Router} from "express";
import {UserRouteConfigurator} from "./UserRouteConfigurator";
import {Router} from "express";

interface IConfigurator {

}

type ActionFunction = (req: Request, res: Response, next: NextFunction) => void;
type ActionDecorator = (action: ActionFunction) => ActionFunction;

export class RouteConfigurator {

    public static create(router: Router) {
        // log
        console.info("[RouteConfigurator::create] Creating route configurator.");

        const configurator = new RouteConfigurator();
        configurator.bootstrapInfrastructure();
        configurator.configure(router);
    }

    private configurator : IConfigurator = new UserRouteConfigurator();

    private store: EventStore = new EventStore();
    private eventPublisher: EventPublisher = new EventPublisher();
    private userStatusRepository: UserStatusRepository = new UserStatusRepository();
    private userRepository?: UserRepository;
    private updateUserStatus?: UpdateUserStatus;

    public bootstrapInfrastructure() {
        this.eventPublisher.onAny(this.store.store);
        this.userRepository = new UserRepository(this.store);
        this.updateUserStatus = new UpdateUserStatus(this.userStatusRepository);
        this.updateUserStatus.register(this.eventPublisher);
    }

    public configure(router: Router) {
        this.configureRoutes(router, this.secure);
    }

    private configureRoutes(router: Router, secure: ActionDecorator) {
        // Public routes
        router.post("/api/users", this.createUser);
        router.post("/api/users/:id/login", this.login);

        // Secured routes
        router.get("/api/users", secure(this.listUsers));
        router.get("/api/users/:id", secure(this.getUser));
        router.post("/api/users/:id/logout", secure(this.logout));
    }

    public createUser = (req: Request, res: Response, next: NextFunction) => {
        const {username, password} = req.body;
        if (!username || !password) {
            return res.sendStatus(400);
        }
        const userId = createUser(this.eventPublisher.publish, username, password);
        res
            .status(201)
            .json(userId);
    }

    public getUser = (req: Request, res: Response, next: NextFunction) => {
        const userId = new UserId(req.params.id);
        // @ts-ignore
        const user: User = this.userRepository.getUser(userId);
        const view = user.getView();
        delete view.password;
        res.json(view);
    }

    public login = (req: Request, res: Response, next: NextFunction) => {
        const userId = new UserId(req.params.id);
        const password = req.body.password;
        try {
            // @ts-ignore
            const user: User = this.userRepository.getUser(userId);
            const sessionId = user.login(this.eventPublisher.publish, password);
            res.status(201).json(sessionId);
        } catch (e) {
            res.status(403).json(e);
        }

    }

    public logout = (req: Request, res: Response, next: NextFunction) => {
        const userId = new UserId(req.params.id);
        // @ts-ignore
        const user: User = this.userRepository.getUser(userId);
        user.logout(this.eventPublisher.publish);
        res.sendStatus(205);
    }

    public listUsers = (req: Request, res: Response, next: NextFunction) => {
        const userStatuses = this.userStatusRepository.getStatuses();
        return res.json(userStatuses);
    }

    private secure = (func: ActionFunction): ActionFunction => {
        return (req: Request, res: Response, next: NextFunction) => {
            if (!req.headers.authorization) {
                return res.sendStatus(401);
            }
            const sessionId = new SessionId(req.headers.authorization as string);
            if (!this.userStatusRepository.hasSession(sessionId)) {
                return res.sendStatus(403);
            }
            return func(req, res, next);
        };
    }
}
