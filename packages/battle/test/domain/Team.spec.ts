import {createTeam, MemberAdded, Team, TeamCreated, TeamId} from "../../src/domain/Team";
import {CharacterId} from "@fubattle/character";

describe("Team Factory", () => {
    let eventsRaised: any[];
    const publishEvent = (evt) => {
        eventsRaised.push(evt);
    };

    beforeEach(() => {
        eventsRaised = [];
    });

    it("should create an empty team", () => {
        const id = createTeam(publishEvent);
        expect(id).toBeInstanceOf(TeamId);

        const expectedEvent = new TeamCreated(id);
        expect(eventsRaised).toContainEqual(expectedEvent);
    });
});

describe("Team", () => {
    const teamId = new TeamId("foo");
    const teamCreated = new TeamCreated(teamId);
    const characterId = new CharacterId("bar");
    const memberAdded = new MemberAdded(teamId, characterId);

    it("should initialize empty team", () => {
        const team = new Team([teamCreated]);
        const members = [];
        const state = team.getView();

        expect(state).toEqual({teamId, members});
    });

    it("should add team members", () => {
        const team = new Team([teamCreated, memberAdded]);
        const members = [characterId];
        const state = team.getView();

        expect(state).toEqual({teamId, members});
    });

    describe("addMember", () => {
        let team: Team;
        let eventsRaised: any[];
        const publishEvent = (evt) => {
            eventsRaised.push(evt);
        };

        beforeEach(()=>{
            eventsRaised = [];
            team = new Team([teamCreated]);
        });

        it("should add if fewer than 6", () => {
            team.addMember(publishEvent, characterId);
            expect(eventsRaised).toContainEqual(new MemberAdded(teamId, characterId));
        });

        it("should throw if team is already full", () => {
            for(let i=0; i<6; i++) {
                team.addMember(publishEvent, new CharacterId("foo"+i));
            }
            expect(()=>team.addMember(publishEvent, characterId))
                .toThrow(new Error("Team is full"));
            expect(eventsRaised.length).toBe(6);
        })
    })
})