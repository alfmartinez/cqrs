import {EventStore} from "@cqrs-alf/common";
import {Battle, BattleId} from "../domain/Battle";

export class UnknownBattle implements Error {
    public name: string = "UnknownBattle";
    public message: string;

    constructor(message: string = "Unknown Battle") {
        this.message = message;
    }
}

export class BattleRepository {
    public eventStore: EventStore;

    constructor(eventStore: EventStore) {
        this.eventStore = eventStore;
    }

    public getBattle(battleId: BattleId) {
        const events = this.getAllEvents(battleId);
        return new Battle(events);
    }

    private getAllEvents(battleId: BattleId) {
        const events = this.eventStore.getEventsOfAggregate(battleId);
        if (!events.length) {
            throw new UnknownBattle();
        }
        return events;
    }
}
