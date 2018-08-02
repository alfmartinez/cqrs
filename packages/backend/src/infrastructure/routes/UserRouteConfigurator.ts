import {ActionDecorator, ActionFunction, IConfigurator} from "./index";
import {
    createUser,
    SessionId,
    UpdateUserStatus,
    User,
    UserId,
    UserRepository,
    UserStatusRepository
} from "../../../../user/dist";
import {EventStore, EventPublisher} from "@cqrs-alf/common";
import {NextFunction, Request, Response, Router} from "express";

export class UserRouteConfigurator implements IConfigurator {
    private publishEvent: (evt: any) => void;
    private userRepository: UserRepository;
    private updateUserStatus: UpdateUserStatus;
    private userStatusRepository: UserStatusRepository = new UserStatusRepository();

    constructor(store: EventStore, eventPublisher: EventPublisher) {
        this.userRepository = new UserRepository(store);
        this.updateUserStatus = new UpdateUserStatus(this.userStatusRepository);
        this.updateUserStatus.register(eventPublisher);
        this.publishEvent = eventPublisher.publish;
    }

    public configureRoutes(router: Router, secure: ActionDecorator) {
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
        const userId = createUser(this.publishEvent, username, password);
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
            const sessionId = user.login(this.publishEvent, password);
            res.status(201).json(sessionId);
        } catch (e) {
            res.status(403).json(e);
        }

    }

    public logout = (req: Request, res: Response, next: NextFunction) => {
        const userId = new UserId(req.params.id);
        // @ts-ignore
        const user: User = this.userRepository.getUser(userId);
        user.logout(this.publishEvent);
        res.sendStatus(205);
    }

    public listUsers = (req: Request, res: Response, next: NextFunction) => {
        const userStatuses = this.userStatusRepository.getStatuses();
        return res.json(userStatuses);
    }

    public secure = (func: ActionFunction): ActionFunction => {
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