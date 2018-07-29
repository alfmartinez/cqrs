import {NextFunction, Request, Response, Router} from "express";
import {EventStore, EventPublisher} from "@cqrs-alf/common";
import {createUser} from "@fubattle/user";

export class RouteConfigurator {
    private store: EventStore = new EventStore();
    private eventPublisher: EventPublisher = new EventPublisher();

    public static create(router: Router) {
        //log
        console.log("[RouteConfigurator::create] Creating route configurator.");

        const configurator = new RouteConfigurator();
        configurator.bootstrapInfrastructure();
        configurator.configure(router);
    }

    public bootstrapInfrastructure() {
        this.eventPublisher.onAny(this.store.store);
    }

    public configure(router: Router) {
        router.post("/api/users", this.createUser);
    }

    createUser = (req: Request, res: Response, next: NextFunction) => {
        const {username} = req.body;
        const userId = createUser(this.eventPublisher.publish, username);
        res.json(userId);
    }
}