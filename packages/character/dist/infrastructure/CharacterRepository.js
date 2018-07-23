"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Character_1 = require("../domain/Character");
var UnknownCharacter = /** @class */ (function () {
    function UnknownCharacter(message) {
        if (message === void 0) { message = "Unknown Character"; }
        this.name = "UnknownCharacter";
        this.message = message;
    }
    return UnknownCharacter;
}());
exports.UnknownCharacter = UnknownCharacter;
var CharacterRepository = /** @class */ (function () {
    function CharacterRepository(eventStore) {
        this.eventStore = eventStore;
    }
    CharacterRepository.prototype.getCharacter = function (characterId) {
        var events = this.getAllEvents(characterId);
        return new Character_1.Character(events);
    };
    CharacterRepository.prototype.getAllEvents = function (characterId) {
        var events = this.eventStore.getEventsOfAggregate(characterId);
        if (!events.length) {
            throw new UnknownCharacter();
        }
        return events;
    };
    return CharacterRepository;
}());
exports.CharacterRepository = CharacterRepository;
