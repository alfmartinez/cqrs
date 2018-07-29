import {NextFunction, Request, Response, Router} from "express";
import {EventStore, EventPublisher} from "@cqrs-alf/common";
import {createUser, UserRepository, UserId, User} from "@fubattle/user";

export class RouteConfigurator {
    private store: EventStore = new EventStore();
    private eventPublisher: EventPublisher = new EventPublisher();
    private userRepository?: UserRepository;
    
    public static create(router: Router) {
        //log
        console.log("[RouteConfigurator::create] Creating route configurator.");

        const configurator = new RouteConfigurator();
        configurator.bootstrapInfrastructure();
        configurator.configure(router);
    }

    public bootstrapInfrastructure() {
        this.eventPublisher.onAny(this.store.store);
        this.userRepository = new UserRepository(this.store);
    }

    public configure(router: Router) {
        router.post("/api/users", this.createUser);
        router.get("/api/users/:id", this.getUser);
    }

    createUser = (req: Request, res: Response, next: NextFunction) => {
        const {username} = req.body;
        const userId = createUser(this.eventPublisher.publish, username);
        res.json(userId);
    };

    getUser = (req: Request, res: Response, next: NextFunction) => {
        const userId = new UserId(req.params.id);
        try{
            // @ts-ignore
            const user: User = this.userRepository.getUser(userId);
            res.json(user.getView());
        } catch (e) {
            res.json(e);
        }

    }
}