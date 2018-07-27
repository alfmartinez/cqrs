import {EventStore} from "@cqrs-alf/common";
import {TeamRepository, UnknownTeam} from "../../src/infrastructure/TeamRepository";
import {MemberAdded, Team, TeamCreated, TeamId} from "../../src/domain/Team";
import {CharacterId} from "@fubattle/character";

describe("TeamRepository", () => {

    let store: EventStore;
    let repository: TeamRepository;

    beforeEach(() => {
        store = new EventStore();
        repository = new TeamRepository(store);
    })

    it("should throw if no battle exists for given id", () => {
        const teamId = new TeamId("foo");
        expect(() => repository.getTeam(teamId)).toThrow(new UnknownTeam())
    });

    it("should return team with given id", () => {
        const teamId = new TeamId("foo");
        const characterId = new CharacterId("baz");
        store.store(new TeamCreated(teamId));
        store.store(new MemberAdded(teamId, characterId));
        const team = repository.getTeam(teamId);
        expect(team).toBeInstanceOf(Team);
        const teamView = team.getView();
        expect(teamView.teamId.equals(teamId)).toBeTruthy();
        expect(teamView.members).toContain(characterId);
    });
})