import * as request from "supertest";

export function createUser(app, username: string, password: string) {
    return request(app).post('/api/users')
        .set("Content-Type", "application/json")
        .set('Accept', 'application/json')
        .send({username, password})
        .expect(201)
        .then((response) => {
            return response.body.id;
        });
}

function doLogin(app, userId: string, password: string) {
    return request(app).post('/api/users/' + userId + '/login')
        .set("Content-Type", "application/json")
        .set('Accept', 'application/json')
        .send({password});
}

export function loginUser(app, userId: string, password: string) {
    return doLogin(app, userId, password)
        .expect(201)
        .then((response) => {
            return response.body.id;
        });
}

export function login(app, username: string, password: string, context: any) {
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

export function createCharacterAndReturnId(app, username, password, context, characterData) {
    return createCharacter(app, username, password, context, characterData)
        .then(response => {
            const {id} = response.body;
            context.characterId = id;
            return id;
        });
}

export function createCharacter(app, username, password, context, characterData) {
    return login(app, username, password, context)
        .then(() => request(app).post('/api/characters')
            .set("Content-Type", "application/json")
            .set('Accept', 'application/json')
            .send(characterData)
            .set("Authorization", context.sessionId)
            .expect(201));
}