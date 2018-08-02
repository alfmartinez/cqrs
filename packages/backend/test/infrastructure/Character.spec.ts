import {Server} from "../../src/infrastructure/Server";
import * as request from "supertest";
import {CharacterClass, CharacterId} from "@fubattle/character";
import {login, createCharacterAndReturnId, createCharacter} from "./utils";

describe("Character Routes", () => {
    const app = Server.bootstrap().app;
    const password = "foo";
    const username = "Red";
    const characterData = {
        name: "Pickle Rick",
        className: CharacterClass.WIZARD
    };

    let context: { userId?: string, sessionId?: string, characterId?: CharacterId };



    beforeEach(() => {
        context = {};
    })

    describe("CreateCharacter", () => {
        it("should return 401 if not authorized", () => {
            return request(app).post('/api/characters')
                .set("Content-Type", "application/json")
                .set('Accept', 'application/json')
                .expect(401);
        });

        it("should return 400 if missing data in body", () => {
            return login(app, username, password, context)
                .then(() => request(app).post('/api/characters')
                    .set("Content-Type", "application/json")
                    .set('Accept', 'application/json')
                    .set("Authorization", context.sessionId)
                    .expect(400));

        });

        it("should return 201 if created", () => {
            return createCharacter(app, username, password, context, characterData)
                .then((response) => {
                    const {body} = response;
                    expect(body).toHaveProperty("id");
                });

        });
    });

    describe("Get Character", () => {
        it("should return 401 if not authorized", () => {
            return createCharacterAndReturnId(app, username, password,context,characterData)
                .then(characterId => request(app)
                    .get("/api/characters/" + characterId)
                    .set("Content-Type", "application/json")
                    .set('Accept', 'application/json')
                    .expect(401));
        });

        it("should return 404 if unknown character", () => {
            return createCharacterAndReturnId(app, username, password,context,characterData)
                .then(characterId => request(app)
                    .get("/api/characters/foo")
                    .set("Content-Type", "application/json")
                    .set('Accept', 'application/json')
                    .set("Authorization", context.sessionId)
                    .expect(404));
        });


        it("should return 403 if character is not owned by user", () => {
            return createCharacterAndReturnId(app, username, password,context,characterData)
                .then(characterId => {
                    return login(app, "foo", "other", context)
                        .then(() => characterId);
                })
                .then(characterId => request(app)
                    .get("/api/characters/" + characterId)
                    .set("Content-Type", "application/json")
                    .set('Accept', 'application/json')
                    .set("Authorization", context.sessionId)
                    .expect(403));
        });

        it("should return 403 if character is not owned by user", () => {
            return createCharacterAndReturnId(app, username, password,context,characterData)
                .then(characterId => request(app)
                    .get("/api/characters/" + characterId)
                    .set("Content-Type", "application/json")
                    .set('Accept', 'application/json')
                    .set("Authorization", context.sessionId)
                    .expect(200))
                .then(response => {
                    const view = response.body;
                    expect(view).toHaveProperty("name", characterData.name);
                    expect(view).toHaveProperty("exp", 0);
                    expect(view).toHaveProperty("className", characterData.className);
                });
        });
    });

    describe("Gain Experience", () => {

        it("should return 404 if character not found", () => {
            return createCharacterAndReturnId(app, username, password,context,characterData)
                .then(characterId => request(app)
                    .post('/api/characters/foo/experience')
                    .set("Content-Type", "application/json")
                    .set('Accept', 'application/json')
                    .set("Authorization", context.sessionId)
                    .send({amount: 1})
                    .expect(404));
        });

        it("should return 400 if no amount given", () => {
            return createCharacterAndReturnId(app, username, password,context,characterData)
                .then(characterId => request(app)
                    .post('/api/characters/' + characterId + '/experience')
                    .set("Content-Type", "application/json")
                    .set('Accept', 'application/json')
                    .set("Authorization", context.sessionId)
                    .expect(400));
        });

        it("should return 201 if amount given", () => {
            return createCharacterAndReturnId(app, username, password,context,characterData)
                .then(characterId => request(app)
                    .post('/api/characters/' + characterId + '/experience')
                    .set("Content-Type", "application/json")
                    .set('Accept', 'application/json')
                    .set("Authorization", context.sessionId)
                    .send({amount: 1})
                    .expect(201))
                .then(() => request(app)
                    .get('/api/characters/' + context.characterId)
                    .set("Content-Type", "application/json")
                    .set('Accept', 'application/json')
                    .set("Authorization", context.sessionId)
                    .expect(200)
                    .then(response => {
                        const view = response.body
                        expect(view).toHaveProperty("exp", 1);
                        expect(view).toHaveProperty("level", 1);
                    }))

        });

        it("should return 201 if amount given : near level", () => {
            return createCharacterAndReturnId(app, username, password,context,characterData)
                .then(characterId => request(app)
                    .post('/api/characters/' + characterId + '/experience')
                    .set("Content-Type", "application/json")
                    .set('Accept', 'application/json')
                    .set("Authorization", context.sessionId)
                    .send({amount: 999})
                    .expect(201))
                .then(() => request(app)
                    .get('/api/characters/' + context.characterId)
                    .set("Content-Type", "application/json")
                    .set('Accept', 'application/json')
                    .set("Authorization", context.sessionId)
                    .expect(200)
                    .then(response => {
                        const view = response.body
                        expect(view).toHaveProperty("exp", 999);
                        expect(view).toHaveProperty("level", 1);
                    }));
        });


        it("should return 201 if amount given : level exact", () => {
            return createCharacterAndReturnId(app, username, password,context,characterData)
                .then(characterId => request(app)
                    .post('/api/characters/' + characterId + '/experience')
                    .set("Content-Type", "application/json")
                    .set('Accept', 'application/json')
                    .set("Authorization", context.sessionId)
                    .send({amount: 1000})
                    .expect(201))
                .then(() => request(app)
                    .get('/api/characters/' + context.characterId)
                    .set("Content-Type", "application/json")
                    .set('Accept', 'application/json')
                    .set("Authorization", context.sessionId)
                    .expect(200)
                    .then(response => {
                        const view = response.body
                        expect(view).toHaveProperty("exp", 1000);
                        expect(view).toHaveProperty("level", 2);
                    }));
        });

        it("should return 201 if amount given : multilevel", () => {
            return createCharacterAndReturnId(app, username, password,context,characterData)
                .then(characterId => request(app)
                    .post('/api/characters/' + characterId + '/experience')
                    .set("Content-Type", "application/json")
                    .set('Accept', 'application/json')
                    .set("Authorization", context.sessionId)
                    .send({amount: 3000})
                    .expect(201))
                .then(() => request(app)
                    .get('/api/characters/' + context.characterId)
                    .set("Content-Type", "application/json")
                    .set('Accept', 'application/json')
                    .set("Authorization", context.sessionId)
                    .expect(200)
                    .then(response => {
                        const view = response.body
                        expect(view).toHaveProperty("exp", 3000);
                        expect(view).toHaveProperty("level", 3);
                    }));
        });
    });
})