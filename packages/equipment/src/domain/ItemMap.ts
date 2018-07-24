import {CharacterClass} from "@fubattle/character";

type ItemDescriptor = [string, string, string, number];
type ItemSetDescriptor = ItemDescriptor[];
type ClassItemSetDescriptor = ItemSetDescriptor[];
interface ItemMap {
    [key: string]: ClassItemSetDescriptor;
}

export const itemMap: ItemMap = {
    [CharacterClass.FIGHTER] : [
        [                                       // Level WHITE
            ["cap", "normal", "defense", 1],
            ["knife", "normal", "damage", 1],
            ["buckler", "normal", "defense", 1],
            ["cloak", "normal", "defense", 1],
            ["cloth", "normal", "defense", 1],
            ["boots", "normal", "attack", 1],
        ], [                                     // Level GREEN0
            ["light skullcap", "normal", "defense", 1],
            ["short sword", "normal", "damage", 2],
            ["buckler+", "normal", "defense", 1],
            ["cloak+", "special", "attack", 1],
            ["cloth+", "special", "defense", 1],
            ["boots+", "special", "damage", 1],
        ],
    ],
};
