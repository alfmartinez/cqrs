import * as request from "supertest";
import {Server} from "../../src/infrastructure/Server";



describe("Backend Server", () => {
    const app = Server.bootstrap().app;
    const password = "foo";
    const wrongPassword = "bar";
    const username = "Red";

    function createUser(username, password) {
        return request(app).post('/api/users')
            .set("Content-Type", "application/json")
            .set('Accept', 'application/json')
            .send({username, password})
            .expect(201)
            .then((response) => {
                return response.body.id;
            });
    }

    function doLogin(userId, password) {
        return request(app).post('/api/users/' + userId + '/login')
            .set("Content-Type", "application/json")
            .set('Accept', 'application/json')
            .send({password});
    }

    function loginUser(userId, password) {
        return doLogin(userId, password)
            .expect(201)
            .then((response) => {
                return response.body.id;
            });
    }

    describe("ErrorHandler", () => {
        it("should return proper 404", () => {
            return request(app).get('/foo')
                .expect(404);
        })
    });

    describe("CreateUser", () => {
        it("should return bad request if no username and/or password", () => {
            return request(app).post('/api/users')
                .set("Content-Type", "application/json")
                .set('Accept', 'application/json')
                .expect(400);
        });

        it("should return created if username and password provided", () => {
            return request(app).post('/api/users')
                .set("Content-Type", "application/json")
                .set('Accept', 'application/json')
                .send({username, password})
                .expect(201)
                .then((response) => {
                    const {body} = response;
                    expect(body).toHaveProperty("id");
                });
        })
    });



    describe("LoginUser", () => {
        it("should perform login for user", () => {
            return createUser(username,password)
                .then(userId => {
                    const sessionId = loginUser(userId, password);
                    expect(sessionId).toBeDefined();
                });
        });

        it("should fail if password is wrong", () => {
            return createUser(username,wrongPassword)
                .then(userId => {
                    return doLogin(userId, password)
                        .expect(403);
                });
        });

        it("should fail if userId is unknown", () => {
            return doLogin("foo", password)
                .expect(403);
        });

    });

})