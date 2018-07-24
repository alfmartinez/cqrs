import {Aggregable, IdGenerator, ValueType, DecisionProjection} from "@cqrs-alf/common";
import {CharacterId} from "@fubattle/character";


export class TeamId extends ValueType {
    teamId: string;

    constructor(id: string) {
        super();
        this.teamId = id;
    }

    toString() {
        return "Team: " + this.teamId;
    }
}

export class TeamCreated implements Aggregable {
    teamId: TeamId;

    constructor(teamId: TeamId) {
        this.teamId = teamId;
    }

    getAggregateId(): any {
        return this.teamId;
    }
}

export class MemberAdded implements Aggregable {
    teamId: TeamId;
    member: CharacterId;

    constructor(teamId: TeamId, member: CharacterId) {
        this.teamId = teamId;
        this.member = member;
    }

    getAggregateId(): TeamId {
        return this.teamId;
    }
}

interface TeamView {
    teamId: TeamId;
    members: CharacterId[];
}

export class Team {
    projection: DecisionProjection<TeamView> = new DecisionProjection<TeamView>();

    constructor(events: Aggregable[] | Aggregable) {
        this.projection
            .register(TeamCreated, function (this: TeamView, evt: TeamCreated) {
                this.teamId = evt.teamId;
                this.members = [];
            })
            .register(MemberAdded, function (this: TeamView, evt: MemberAdded) {
                this.members.push(evt.member);
            })
            .apply(events);
    }

    getView(): TeamView {
        return this.projection.state;
    }

    addMember(publishEvent: (evt: any) => void, characterId: CharacterId) {
        if (this.projection.state.members.length>5) {
            throw new Error("Team is full");
        }
        const addedMember = new MemberAdded(this.projection.state.teamId, characterId);
        this.projection.apply(addedMember);
        publishEvent(addedMember);
    }
}

export function createTeam(publishEvent: (evt: Aggregable) => void) {
    const teamId = new TeamId(IdGenerator.generate());
    const battleCreated = new TeamCreated(teamId);
    publishEvent(battleCreated);
    return teamId;
}