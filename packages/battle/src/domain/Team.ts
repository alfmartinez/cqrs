import {Aggregable, DecisionProjection, IdGenerator, ValueType} from "@cqrs-alf/common";
import {CharacterId} from "@fubattle/character";

export class TeamId extends ValueType {
    public teamId: string;

    constructor(id: string) {
        super();
        this.teamId = id;
    }

    public toString() {
        return "Team: " + this.teamId;
    }
}

export class TeamCreated implements Aggregable {
    public teamId: TeamId;

    constructor(teamId: TeamId) {
        this.teamId = teamId;
    }

    public getAggregateId(): any {
        return this.teamId;
    }
}

export class MemberAdded implements Aggregable {
    public teamId: TeamId;
    public member: CharacterId;

    constructor(teamId: TeamId, member: CharacterId) {
        this.teamId = teamId;
        this.member = member;
    }

    public getAggregateId(): TeamId {
        return this.teamId;
    }
}

interface ITeamView {
    teamId: TeamId;
    members: CharacterId[];
}

export class Team {
    public projection: DecisionProjection<ITeamView> = new DecisionProjection<ITeamView>();

    constructor(events: Aggregable[] | Aggregable) {
        this.projection
            .register(TeamCreated, function(this: ITeamView, evt: TeamCreated) {
                this.teamId = evt.teamId;
                this.members = [];
            })
            .register(MemberAdded, function(this: ITeamView, evt: MemberAdded) {
                this.members.push(evt.member);
            })
            .apply(events);
    }

    public getView(): ITeamView {
        return this.projection.state;
    }

    public addMember(publishEvent: (evt: any) => void, characterId: CharacterId) {
        if (this.projection.state.members.length > 5) {
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
