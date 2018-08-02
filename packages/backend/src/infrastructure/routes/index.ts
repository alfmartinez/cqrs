import {EventPublisher, EventStore} from "@cqrs-alf/common";
import {NextFunction, Request, Response, Router} from "express";
import {UserRouteConfigurator} from "./UserRouteConfigurator";

export interface IConfigurator {
    configureRoutes(router: Router, secure: ActionDecorator): void;
}

export interface ISecureDecoratorProvider {
    secure: ActionDecorator;
}

export type ActionFunction = (req: Request, res: Response, next: NextFunction) => void;
export type ActionDecorator = (action: ActionFunction) => ActionFunction;

export class RouteConfigurator {

    public static create(router: Router) {
        const configurator = new RouteConfigurator();
        configurator.configure(router);
    }

    private readonly store: EventStore;
    private readonly eventPublisher: EventPublisher;
    private readonly userRouteConfigurator: UserRouteConfigurator;

    constructor() {
        this.store = new EventStore();
        this.eventPublisher = new EventPublisher();
        this.eventPublisher.onAny(this.store.store);
        this.userRouteConfigurator = new UserRouteConfigurator(this.store, this.eventPublisher);
    }

    public configure(router: Router) {
        const secure = this.userRouteConfigurator.secure;
        this.userRouteConfigurator.configureRoutes(router, secure);
    }
}
