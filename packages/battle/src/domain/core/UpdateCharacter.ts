import {CharacterRepository} from "../../infrastructure/CharacterRepository";
import {EventPublisher} from "../../infrastructure/EventPublisher";
import {CharacterCreated} from "./Character";

export class UpdateCharacter {
    public characterRepository: CharacterRepository;

    constructor(characterRepository) {
        this.characterRepository = characterRepository;
    }

    public register(eventPublisher: EventPublisher) {
        eventPublisher.on(CharacterCreated, () => {
            console.info("year");
        });
    }
}
