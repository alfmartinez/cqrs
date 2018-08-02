import {ActionDecorator, IConfigurator} from "./index";
import {NextFunction, Request, Response, Router} from "express";
import {EventPublisher, EventStore} from "@cqrs-alf/common";
import {createCharacter} from "@fubattle/character";
import {UserId} from "@fubattle/user";

export class CharacterRouteConfigurator implements IConfigurator{
    private publishEvent: (event: any) => void;

    constructor(store: EventStore, eventPublisher: EventPublisher) {
        this.publishEvent = eventPublisher.publish;
    }

    configureRoutes(router: Router, secure: ActionDecorator): void {
        router.post("/api/characters", secure(this.create));
    }

    private create = (req: Request, res: Response, next: NextFunction) => {
        const userId = new UserId(req.headers["X-USERID"] as string);
        const {name, className} = req.body;
        if (!name || !className) {
            return res.sendStatus(400);
        }

        const characterId = createCharacter(this.publishEvent, userId, name, className);

        res.status(201).send(characterId);

    };

}