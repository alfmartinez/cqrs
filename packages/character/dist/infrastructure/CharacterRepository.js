"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Character_1 = require("../domain/Character");
class UnknownCharacter {
    constructor(message = "Unknown Character") {
        this.name = "UnknownCharacter";
        this.message = message;
    }
}
exports.UnknownCharacter = UnknownCharacter;
class CharacterRepository {
    constructor(eventStore) {
        this.eventStore = eventStore;
    }
    getCharacter(characterId) {
        const events = this.getAllEvents(characterId);
        return new Character_1.Character(events);
    }
    getAllEvents(characterId) {
        const events = this.eventStore.getEventsOfAggregate(characterId);
        if (!events.length) {
            throw new UnknownCharacter();
        }
        return events;
    }
}
exports.CharacterRepository = CharacterRepository;
