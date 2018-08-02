import {Server} from "../../src/infrastructure/Server";
import * as request from "supertest";
import {CharacterClass} from "@fubattle/character";

describe("Character Routes", () => {
    const app = Server.bootstrap().app;
    const password = "foo";
    const username = "Red";
    const name = "Pickle Rick";
    const className = CharacterClass.WIZARD;

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

    function login(app, username, password): Promise<{ userId: string, sessionId: string }> {
        let result: { userId: string, sessionId: string } = {};

        return createUser(app, username, password)
            .then(userId => {
                result.userId = userId;
                return userId;
            })
            .then(userId => loginUser(app, userId, password))
            .then(sessionId => {
                result.sessionId = sessionId;
                return result;
            })

    }

    function createCharacter(app, username, password) {
        return login(app, username, password)
            .then(({sessionId}) => request(app).post('/api/characters')
                .set("Content-Type", "application/json")
                .set('Accept', 'application/json')
                .send({name, className})
                .set("Authorization", sessionId)
                .expect(201));
    }

    describe("CreateCharacter", () => {
        it("should return 401 if not authorized", () => {
            return request(app).post('/api/characters')
                .set("Content-Type", "application/json")
                .set('Accept', 'application/json')
                .expect(401);
        });

        it("should return 400 if missing data in body", () => {
            return login(app, username, password)
                .then(({sessionId}) => request(app).post('/api/characters')
                    .set("Content-Type", "application/json")
                    .set('Accept', 'application/json')
                    .set("Authorization", sessionId)
                    .expect(400));

        });

        it("should return 201 if created", () => {
            return createCharacter(app, username, password)
                .then((response) => {
                    const {body} = response;
                    expect(body).toHaveProperty("id");
                });

        });
    })
})