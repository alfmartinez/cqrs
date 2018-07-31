import * as request from "supertest";
import {Server} from "../../src/infrastructure/Server";

describe("Backend Server", () => {
    const app = Server.bootstrap().app;

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
                .send({username: "Red", password: "foo"})
                .expect(201)
                .then((response) => {
                    const {body} = response;
                    expect(body).toHaveProperty("id");
                });

        })
    })

})