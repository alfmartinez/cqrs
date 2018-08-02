import {EventPublisher, EventStore} from "@cqrs-alf/common";
import {Character, CharacterId, CharacterRepository, createCharacter} from "@fubattle/character";
import {UserId} from "@fubattle/user";
import {NextFunction, Request, Response, Router} from "express";
import {ActionDecorator, IConfigurator} from "./index";

export class CharacterRouteConfigurator implements IConfigurator {
    private publishEvent: (event: any) => void;
    private characterRepository: CharacterRepository;

    constructor(store: EventStore, eventPublisher: EventPublisher) {
        this.publishEvent = eventPublisher.publish;
        this.characterRepository = new CharacterRepository(store);
    }

    public configureRoutes(router: Router, secure: ActionDecorator): void {
        router.post("/api/characters", secure(this.create));
        router.get("/api/characters/:id", secure(this.getCharacter));
    }

    private create = (req: Request, res: Response, next: NextFunction) => {
        const userId = new UserId(req.headers["X-USERID"] as string);
        const {name, className} = req.body;
        if (!name || !className) {
            return res.sendStatus(400);
        }

        const characterId = createCharacter(this.publishEvent, userId, name, className);

        res.status(201).send(characterId);
    }

    private getCharacter = (req: Request, res: Response, next: NextFunction) => {
        const userId = new UserId(req.headers["X-USERID"] as string);
        const characterId = new CharacterId(req.params.id);
        let character: Character;
        try {
            character = this.characterRepository.getCharacter(characterId);
        } catch(e) {
            return res.sendStatus(404);
        }
        const view = character.getView();
        if (!view.userId.equals(userId)) {
            return res.sendStatus(403);
        }
        res.send(view);

    }

}
