import { NextFunction, Request, Response, Router } from "express";
import {EventStore, EventPublisher} from "@cqrs-alf/common";

/**
 * / route
 *
 * @class RouteConfigurator
 */
export class RouteConfigurator {
    private store: EventStore = new EventStore();
    private eventPublisher: EventPublisher = new EventPublisher();

    /**
     * Create the routes.
     *
     * @class RouteConfigurator
     * @method create
     * @static
     */
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
        router.get("/api/users", this.listUsers);
    }

    /**
     * List users
     *
     * @class RouteConfigurator
     * @method index
     * @param req {Request} The express Request object.
     * @param res {Response} The express Response object.
     * @next {NextFunction} Execute the next method.
     */
    public listUsers(req: Request, res: Response, next: NextFunction) {
        res.json({users:"OK"});
    }
}