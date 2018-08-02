import * as request from "supertest";
import {Server} from "../../src/infrastructure/Server";


describe("UserRoutes", () => {
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

    function getSessionId(username, password) {
        return createUser(username, password)
            .then(userId => {
                return loginUser(userId, password);
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
        });
    });


    describe("LoginUser", () => {
        it("should perform login for user", () => {
            return createUser(username, password)
                .then(userId => {
                    const sessionId = loginUser(userId, password);
                    expect(sessionId).toBeDefined();
                });
        });

        it("should fail if password is wrong", () => {
            return createUser(username, wrongPassword)
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

    describe("GetUsers", () => {
        it("should return unauthorized if not authenticated", () => {
            return getSessionId(username, password)
                .then(sessionId => {
                    return request(app).get('/api/users')
                        .set("Content-Type", "application/json")
                        .set('Accept', 'application/json')
                        .expect(401);
                })
        });

        it("should return Forbidden if authorization is wrong", () => {
            return getSessionId(username, password)
                .then(sessionId => {
                    return request(app).get('/api/users')
                        .set("Content-Type", "application/json")
                        .set('Authorization', "foo")
                        .set('Accept', 'application/json')
                        .expect(403);
                })
        });

        it("should return user data if authenticated", () => {
            return getSessionId(username, password)
                .then(sessionId => {
                    return request(app).get('/api/users')
                        .set("Content-Type", "application/json")
                        .set('Accept', 'application/json')
                        .set('Authorization', sessionId)
                        .expect(200)
                        .then((response) => {
                            const {body} = response;
                            expect(body).toBeInstanceOf(Array);
                            body.forEach((status)=> {
                                expect(status).toHaveProperty("userId");
                                expect(status).toHaveProperty("username");
                                expect(status).toHaveProperty("loggedSince");
                                expect(status).not.toHaveProperty("sessionId");
                            })
                        });
                })
        });
    });

    describe("GetUser", () => {
        it("should return unauthorized if not authenticated", () => {
            let userId;
            return createUser(username, password)
                .then(userId => {
                    userId = userId;
                    return loginUser(userId, password);
                })
                .then(sessionId => {
                    return request(app).get('/api/users/' + userId)
                        .set("Content-Type", "application/json")
                        .set('Accept', 'application/json')
                        .expect(401);
                })
        });

        it("should return Forbidden if authorization is wrong", () => {
            let userId;
            return createUser(username, password)
                .then(userId => {
                    userId = userId;
                    return loginUser(userId, password);
                })
                .then(sessionId => {
                    return request(app).get('/api/users/' + userId)
                        .set("Content-Type", "application/json")
                        .set('Accept', 'application/json')
                        .set('Authorization', "foo")
                        .expect(403);
                })
        });

        it("should return Forbidden if user is wrong", () => {
            let userId;
            return createUser(username, password)
                .then(userId => {
                    userId = userId;
                    return loginUser(userId, password);
                })
                .then(sessionId => {
                    return request(app).get('/api/users/' + "baz")
                        .set("Content-Type", "application/json")
                        .set('Accept', 'application/json')
                        .set('Authorization', "foo")
                        .expect(403);
                })
        });

        it("should return user data if authorization is ok", () => {
            let actualUserId;
            return createUser(username, password)
                .then(userId => {
                    actualUserId = userId;
                    return loginUser(userId, password);
                })
                .then(sessionId => {
                    return request(app).get('/api/users/' + actualUserId)
                        .set("Content-Type", "application/json")
                        .set('Accept', 'application/json')
                        .set('Authorization', sessionId)
                        .expect(200)
                        .then(({body}) => {
                            expect(body).toHaveProperty("connected", true);
                            expect(body).not.toHaveProperty("password");
                            expect(body).toHaveProperty("userId", {id: actualUserId});
                            expect(body).toHaveProperty("sessionId", {id: sessionId});
                            expect(body).toHaveProperty("username", username);
                        });
                })
        });
    });

    describe("Logout", () => {
        it("should return 205 Refresh if successful logout", () => {
            let actualUserId;
            return createUser(username, password)
                .then(userId => {
                    actualUserId = userId;
                    return loginUser(userId, password);
                })
                .then(sessionId => {
                    return request(app).post("/api/users/"+ actualUserId + "/logout")
                        .set('Authorization', sessionId)
                        .expect(205);
                })
        })
    })

})