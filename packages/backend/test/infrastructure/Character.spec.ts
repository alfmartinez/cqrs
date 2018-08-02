import {Server} from "../../src/infrastructure/Server";
import * as request from "supertest";
import {CharacterClass, CharacterId} from "@fubattle/character";

describe("Character Routes", () => {
    const app = Server.bootstrap().app;
    const password = "foo";
    const username = "Red";
    const name = "Pickle Rick";
    const className = CharacterClass.WIZARD;

    let context: { userId?: string, sessionId?: string, characterId?: CharacterId };

    function createUser(app, username, password) {
        return request(app).post('/api/users')
            .set("Content-Type", "application/json")
            .set('Accept', 'application/json')
            .send({username, password})
            .expect(201)
            .then((response) => {
                return response.body.id;
            });
    }

    function doLogin(app, userId, password) {
        return request(app).post('/api/users/' + userId + '/login')
            .set("Content-Type", "application/json")
            .set('Accept', 'application/json')
            .send({password});
    }

    function loginUser(app, userId, password) {
        return doLogin(app, userId, password)
            .expect(201)
            .then((response) => {
                return response.body.id;
            });
    }

    function login(app, username, password) {
        return createUser(app, username, password)
            .then(userId => {
                context.userId = userId;
                return userId;
            })
            .then(userId => loginUser(app, userId, password))
            .then(sessionId => {
                context.sessionId = sessionId;
            });

    }

    function createCharacter(app, username, password) {
        return login(app, username, password)
            .then(() => request(app).post('/api/characters')
                .set("Content-Type", "application/json")
                .set('Accept', 'application/json')
                .send({name, className})
                .set("Authorization", context.sessionId)
                .expect(201));
    }

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
            return login(app, username, password)
                .then(() => request(app).post('/api/characters')
                    .set("Content-Type", "application/json")
                    .set('Accept', 'application/json')
                    .set("Authorization", context.sessionId)
                    .expect(400));

        });

        it("should return 201 if created", () => {
            return createCharacter(app, username, password)
                .then((response) => {
                    const {body} = response;
                    expect(body).toHaveProperty("id");
                });

        });
    });

    function createCharacterAndReturnId() {
        return createCharacter(app, username, password)
            .then(response => {
                const {id} = response.body;
                context.characterId = id;
                return id;
            });
    }

    describe("Get Character", () => {
        it("should return 401 if not authorized", () => {
            return createCharacterAndReturnId()
                .then(characterId => request(app)
                    .get("/api/characters/" + characterId)
                    .set("Content-Type", "application/json")
                    .set('Accept', 'application/json')
                    .expect(401));
        });

        it("should return 404 if unknown character", () => {
            return createCharacterAndReturnId()
                .then(characterId => request(app)
                    .get("/api/characters/foo")
                    .set("Content-Type", "application/json")
                    .set('Accept', 'application/json')
                    .set("Authorization", context.sessionId)
                    .expect(404));
        });


        it("should return 403 if character is not owned by user", () => {
            return createCharacterAndReturnId()
                .then(characterId => {
                    return login(app, "foo", "other")
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
            return createCharacterAndReturnId()
                .then(characterId => request(app)
                    .get("/api/characters/" + characterId)
                    .set("Content-Type", "application/json")
                    .set('Accept', 'application/json')
                    .set("Authorization", context.sessionId)
                    .expect(200))
                .then(response => {
                    const view = response.body;
                    expect(view).toHaveProperty("name", name);
                    expect(view).toHaveProperty("exp", 0);
                    expect(view).toHaveProperty("className", className);
                });
        });
    });

    describe("Gain Experience", () => {

        it("should return 404 if character not found", () => {
            return createCharacterAndReturnId()
                .then(characterId => request(app)
                    .post('/api/characters/foo/experience')
                    .set("Content-Type", "application/json")
                    .set('Accept', 'application/json')
                    .set("Authorization", context.sessionId)
                    .send({amount: 1})
                    .expect(404));
        });

        it("should return 400 if no amount given", () => {
            return createCharacterAndReturnId()
                .then(characterId => request(app)
                    .post('/api/characters/' + characterId + '/experience')
                    .set("Content-Type", "application/json")
                    .set('Accept', 'application/json')
                    .set("Authorization", context.sessionId)
                    .expect(400));
        });

        it("should return 201 if amount given", () => {
            return createCharacterAndReturnId()
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
            return createCharacterAndReturnId()
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
            return createCharacterAndReturnId()
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
            return createCharacterAndReturnId()
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