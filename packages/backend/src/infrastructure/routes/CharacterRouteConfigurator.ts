import {EventPublisher, EventStore} from "@cqrs-alf/common";
import {Character, CharacterId, CharacterRepository, createCharacter, UnknownCharacter} from "@fubattle/character";
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
        router.post("/api/characters/:id/experience", secure(this.gainExperience));
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
        let character: Character;
        try {
            character = this.getCharacterFromRepository(req);
        } catch(e) {
            return this.handleCharacterExceptions(e, res);
        }

        res.send(character.getView());
    }

    private handleCharacterExceptions(e: Error, res: Response) {
        switch(e.name) {
            case "UnknownCharacter":
                res.sendStatus(404);
            case "CharacterNotOwnedByUser":
                res.sendStatus(403);
            default:
                res.status(500).send(e);
        }
    }

    private gainExperience = (req: Request, res: Response, next: NextFunction) => {
        const {amount} = req.body;
        if (!amount) {
            return res.sendStatus(400);
        }
        try {
            const character: Character = this.getCharacterFromRepository(req);
            character.gainExperience(this.publishEvent, amount);
            res.sendStatus(201);
        } catch(e) {
            this.handleCharacterExceptions(e, res);
        }
    }

    private getCharacterFromRepository(req: Request) {
        const userId = new UserId(req.headers["X-USERID"] as string);
        const characterId = new CharacterId(req.params.id);
        const character: Character = this.characterRepository.getCharacter(characterId);
        const view = character.getView();
        if (!view.userId.equals(userId)) {
            throw new CharacterNotOwnedByUser();
        }
        return character;
    }
}

class CharacterNotOwnedByUser implements Error {
    message: string = "Character is not owned by user";
    name: string = "CharacterNotOwnedByUser";

}