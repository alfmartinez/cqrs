import {EventPublisher, EventStore} from "@cqrs-alf/common";
import {createUser, User, UserId, UserRepository} from "@fubattle/user";
import {NextFunction, Request, Response, Router} from "express";

export class RouteConfigurator {

    public static create(router: Router) {
        // log
        console.info("[RouteConfigurator::create] Creating route configurator.");

        const configurator = new RouteConfigurator();
        configurator.bootstrapInfrastructure();
        configurator.configure(router);
    }
    private store: EventStore = new EventStore();
    private eventPublisher: EventPublisher = new EventPublisher();
    private userRepository?: UserRepository;

    public bootstrapInfrastructure() {
        this.eventPublisher.onAny(this.store.store);
        this.userRepository = new UserRepository(this.store);
    }

    public configure(router: Router) {
        router.post("/api/users", this.createUser);
        router.get("/api/users/:id", this.getUser);
        router.post("/api/users/:id/login", this.login);
    }

    public createUser = (req: Request, res: Response, next: NextFunction) => {
        const {username} = req.body;
        const userId = createUser(this.eventPublisher.publish, username);
        res.json(userId);
    }

    public getUser = (req: Request, res: Response, next: NextFunction) => {
        const userId = new UserId(req.params.id);
        try {
            // @ts-ignore
            const user: User = this.userRepository.getUser(userId);
            res.json(user.getView());
        } catch (e) {
            res.json(e);
        }

    }

    public login = (req: Request, res: Response, next: NextFunction) => {
        const userId = new UserId(req.params.id);
        try {
            // @ts-ignore
            const user: User = this.userRepository.getUser(userId);
            const sessionId = user.login(this.eventPublisher.publish);
            res.json(sessionId);
        } catch (e) {
            res.json(e);
        }

    }
}
