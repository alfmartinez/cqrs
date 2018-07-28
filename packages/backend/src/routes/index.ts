import { NextFunction, Request, Response, Router } from "express";


/**
 * / route
 *
 * @class RouteConfigurator
 */
export class RouteConfigurator {

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
        configurator.configure(router);
    }

    public configure(router: Router) {
        router.get("/", this.index);
    }

    /**
     * The home page route.
     *
     * @class RouteConfigurator
     * @method index
     * @param req {Request} The express Request object.
     * @param res {Response} The express Response object.
     * @next {NextFunction} Execute the next method.
     */
    public index(req: Request, res: Response, next: NextFunction) {
        res.json({status:"OK"});
    }
}