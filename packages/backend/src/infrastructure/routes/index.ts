import {EventPublisher, EventStore} from "@cqrs-alf/common";
import {createUser, SessionId, UpdateUserStatus, User, UserId} from "@fubattle/user";
import {UserRepository, UserStatusRepository} from "@fubattle/user";
import {NextFunction, Request, Response, Router} from "express";
import {UserRouteConfigurator} from "./UserRouteConfigurator";

export interface IConfigurator {
    new(store: EventStore, eventPublisher: EventPublisher): IConfigurator;
    configureRoutes(router: Router, secure: ActionDecorator): void;
}

export type ActionFunction = (req: Request, res: Response, next: NextFunction) => void;
export type ActionDecorator = (action: ActionFunction) => ActionFunction;

export class RouteConfigurator {

    public static create(router: Router) {
        // log
        console.info("[RouteConfigurator::create] Creating route configurator.");

        const configurator = new RouteConfigurator();
        configurator.bootstrapInfrastructure();
        configurator.configure(router);
    }

    private configurator? : IConfigurator;

    private store: EventStore = new EventStore();
    private eventPublisher: EventPublisher = new EventPublisher();
    private userStatusRepository: UserStatusRepository = new UserStatusRepository();
    private userRepository?: UserRepository;
    private updateUserStatus?: UpdateUserStatus;

    public bootstrapInfrastructure() {
        this.eventPublisher.onAny(this.store.store);
        this.configurator = new UserRouteConfigurator(this.store, this.eventPublisher);
        this.userRepository = new UserRepository(this.store);
        this.updateUserStatus = new UpdateUserStatus(this.userStatusRepository);
        this.updateUserStatus.register(this.eventPublisher);
    }

    public configure(router: Router) {
        const secure = this.configurator.secure;
        if (this.configurator) this.configurator.configureRoutes(router, secure);
    }
}
