"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const character_1 = require("@fubattle/character");
exports.itemMap = {
    [character_1.CharacterClass.FIGHTER]: [
        [
            ["cap", "normal", "defense", 1],
            ["knife", "normal", "damage", 1],
            ["buckler", "normal", "defense", 1],
            ["cloak", "normal", "defense", 1],
            ["cloth", "normal", "defense", 1],
            ["boots", "normal", "attack", 1],
        ], [
            ["light skullcap", "normal", "defense", 1],
            ["short sword", "normal", "damage", 2],
            ["buckler+", "normal", "defense", 1],
            ["cloak+", "special", "attack", 1],
            ["cloth+", "special", "defense", 1],
            ["boots+", "special", "damage", 1],
        ],
    ],
};
