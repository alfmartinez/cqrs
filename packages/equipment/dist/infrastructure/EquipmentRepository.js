"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Equipment_1 = require("../domain/Equipment");
class UnknownCharacter {
    constructor(message = "Unknown Character") {
        this.name = "UnknownCharacter";
        this.message = message;
    }
}
exports.UnknownCharacter = UnknownCharacter;
class EquipmentRepository {
    constructor(eventStore) {
        this.eventStore = eventStore;
    }
    getEquipment(characterId) {
        const events = this.getAllEvents(characterId);
        return new Equipment_1.Equipment(events);
    }
    getAllEvents(characterId) {
        const events = this.eventStore.getEventsOfAggregate(characterId);
        if (!events.length) {
            throw new UnknownCharacter();
        }
        return events;
    }
}
exports.EquipmentRepository = EquipmentRepository;
