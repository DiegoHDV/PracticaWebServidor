const request = require("supertest")
const { app, server } = require("../index.js")
const mongoose = require("mongoose")
const { encrypt } = require('../utils/handlePassword.js')
const { tokenSign } = require('../utils/handleJwt')
const ClientModel = require('../models/client.js')
const UserModel = require('../models/user.js')
const ProjectModel = require('../models/project.js')
const DeliverynoteModel = require('../models/deliverynote.js')
const api = request(app)

var password = "Prueba123"

var userPrueba = {
    "name":"Pruebas",
    "age":20,
    "email":"prueba@gmail.com",
    "password": password,
    "role":["user"],
    "code_validation":"123456",
    "validado":true,
    "intentos":3,
    "bloqueado":false,
    "autonomo":true,
    "deleted":false,
    "verificate":false
}

var clienteCreado = {
    "name": "clienteCreado",
    "cif": "87654321B",
    "address": "Madrid"
}

var projectCreated = {
    "clientId": "",
    "projectCode": "123",
    "name": "prueba",
    "address": "Madrid"
}

var deliverynoteCreated = {
    "clientId": "",
    "projectId": "",
    "name": "prueba",
    "format": "hours",
    "hours": [
        {
            "description": "prueba",
            "quantity": 4
        }
    ]
}

beforeAll(async () => {
    await new Promise((resolve) => mongoose.connection.once('connected', resolve));

});

beforeEach(async () => {
    await UserModel.deleteMany({})
    await ClientModel.deleteMany({})
    await ProjectModel.deleteMany({})
    await DeliverynoteModel.deleteMany({})

    userPrueba.password = await encrypt(password)
    userPruebaA = await UserModel.create(userPrueba)
    tokenUserPrueba = await tokenSign(userPruebaA)

    clienteCreado.userId = userPruebaA._id.toString()
    clienteCreadoA = await ClientModel.create(clienteCreado)

    projectCreated.clientId = clienteCreadoA._id.toString()
    projectCreated.userId = userPruebaA._id.toString()
    projectCreatedA = await ProjectModel.create(projectCreated)

    deliverynoteCreated.projectId = projectCreatedA._id.toString()
    deliverynoteCreated.clientId = clienteCreadoA._id.toString()
    deliverynoteCreated.userId = userPruebaA._id.toString()
    deliverynoteCreatedA = await DeliverynoteModel.create(deliverynoteCreated)
})

describe('post deliverynote', () => {
    test('should get an error "NOT_SESSION"', async () => {
        const response = await api
            .post('/practica/deliverynote')
            .send(projectCreated)
            .set('Accept', 'application/json')
            .expect(401)
    })
    test('should get an error due to lack of data', async () => {
        const response1 = await api
            .post('/practica/deliverynote')
            .auth(tokenUserPrueba, { type: 'bearer' })
            .send({
                "clientId": clienteCreadoA._id.toString(),
                "name": "prueba",
                "format": "hours",
                "hours": [
                    {
                        "description": "hola",
                        "quantity": 4
                    }
                ]
            })
            .set('Accept', 'application/json')
            .expect(403)
        const response2 = await api
            .post('/practica/deliverynote')
            .auth(tokenUserPrueba, { type: 'bearer' })
            .send({
                "clientId": clienteCreadoA._id.toString(),
                "projectId": projectCreatedA._id.toString(),
                "name": "prueba",
                "format": "hours",
                "hours": [
                    
                ]
            })
            .set('Accept', 'application/json')
            .expect(403)
        const response3 = await api
            .post('/practica/deliverynote')
            .auth(tokenUserPrueba, { type: 'bearer' })
            .send({
                "clientId": clienteCreadoA._id.toString(),
                "projectId": projectCreatedA._id.toString(),
                "name": "prueba",
                "format": "hours",
                "hours": [
                    {
                        "description": "hola"
                    }
                ]
            })
            .set('Accept', 'application/json')
            .expect(403)
        const response4 = await api
            .post('/practica/deliverynote')
            .auth(tokenUserPrueba, { type: 'bearer' })
            .send({
                "clientId": clienteCreadoA._id.toString(),
                "projectId": projectCreatedA._id.toString(),
                "name": "prueba",
                "format": "material",
                "material": [
                    
                ]
            })
            .set('Accept', 'application/json')
            .expect(403)
        const response5 = await api
            .post('/practica/deliverynote')
            .auth(tokenUserPrueba, { type: 'bearer' })
            .send({
                "clientId": clienteCreadoA._id.toString(),
                "projectId": projectCreatedA._id.toString(),
                "name": "prueba",
                "format": "hours",
                "hours": [
                    {
                        "quantity": 4
                    }
                ]
            })
            .set('Accept', 'application/json')
            .expect(403)
        const response6 = await api
            .post('/practica/deliverynote')
            .auth(tokenUserPrueba, { type: 'bearer' })
            .send({
                "clientId": clienteCreadoA._id.toString(),
                "projectId": projectCreatedA._id.toString(),
                "name": "prueba",
                "format": "any",
                "hours": [
                    {
                        "description": "hola",
                        "quantity": 4
                    }
                ],
                "material":[
                    {
                        "description": "hola"
                    }
                ]
            })
            .set('Accept', 'application/json')
            .expect(403)
        const response7 = await api
            .post('/practica/deliverynote')
            .auth(tokenUserPrueba, { type: 'bearer' })
            .send({
                "clientId": clienteCreadoA._id.toString(),
                "projectId": projectCreatedA._id.toString(),
                "name": "prueba",
                "format": "any",
                "hours": [
                    {
                        "quantity": 4
                    }
                ]
            })
            .set('Accept', 'application/json')
            .expect(403)
        const response8 = await api
            .post('/practica/deliverynote')
            .auth(tokenUserPrueba, { type: 'bearer' })
            .send({
                "clientId": clienteCreadoA._id.toString(),
                "projectId": projectCreatedA._id.toString(),
                "name": "prueba",
                "format": "any",
                "material": [
                    {
                        "quantity": 4
                    }
                ]
            })
            .set('Accept', 'application/json')
            .expect(403)
    })
    test('should get an error INVALID DATA', async () => {
        const response1 = await api
            .post('/practica/deliverynote')
            .auth(tokenUserPrueba, { type: 'bearer' })
            .send({
                "clientId": clienteCreadoA._id.toString(),
                "projectId": projectCreatedA._id.toString(),
                "name": "prueba",
                "format": "hours",
                "hours": [
                    {
                        "description": "prueba",
                        "quantity": 4,
                        "invalid": "data"
                    }
                ]
            })
            .set('Accept', 'application/json')
            .expect(401)
        const response2 = await api
            .post('/practica/deliverynote')
            .auth(tokenUserPrueba, { type: 'bearer' })
            .send({
                "clientId": clienteCreadoA._id.toString(),
                "projectId": projectCreatedA._id.toString(),
                "name": "prueba",
                "format": "material",
                "material": [
                    {
                        "description": "prueba",
                        "quantity": 4,
                        "invalid": "data"
                    }
                ]
            })
            .set('Accept', 'application/json')
            .expect(401)
        const response3 = await api
            .post('/practica/deliverynote')
            .auth(tokenUserPrueba, { type: 'bearer' })
            .send({
                "clientId": clienteCreadoA._id.toString(),
                "projectId": projectCreatedA._id.toString(),
                "name": "prueba",
                "format": "any",
                "hours": [
                    {
                        "description": "prueba",
                        "quantity": 4,
                        "invalid": "data"
                    }
                ],
                "material": [
                    {
                        "description": "prueba",
                        "quantity": 4,
                    }
                ]
            })
            .set('Accept', 'application/json')
            .expect(401)
        const response4 = await api
            .post('/practica/deliverynote')
            .auth(tokenUserPrueba, { type: 'bearer' })
            .send({
                "clientId": clienteCreadoA._id.toString(),
                "projectId": projectCreatedA._id.toString(),
                "name": "prueba",
                "format": "any",
                "hours": [
                    {
                        "description": "prueba",
                        "quantity": 4,
                        "invalid": "data"
                    }
                ]
            })
            .set('Accept', 'application/json')
            .expect(401)
        const response5 = await api
            .post('/practica/deliverynote')
            .auth(tokenUserPrueba, { type: 'bearer' })
            .send({
                "clientId": clienteCreadoA._id.toString(),
                "projectId": projectCreatedA._id.toString(),
                "name": "prueba",
                "format": "any",
                "material": [
                    {
                        "description": "prueba",
                        "quantity": 4,
                        "invalid": "data"
                    }
                ]
            })
            .set('Accept', 'application/json')
            .expect(401)
    })
    test('should get an error CLIENT NOT FOUND', async () => {
        const response = await api
            .post('/practica/deliverynote')
            .auth(tokenUserPrueba, { type: 'bearer' })
            .send({
                "clientId": "123456789012345678901234",
                "projectId": projectCreatedA._id.toString(),
                "name": "prueba",
                "format": "hours",
                "hours": [
                    {
                        "description": "prueba",
                        "quantity": 4
                    }
                ]
            })
            .set('Accept', 'application/json')
            .expect(404)
    })
    test('should get an error PROJECT NOT FOUND', async () => {
        const response = await api
            .post('/practica/deliverynote')
            .auth(tokenUserPrueba, { type: 'bearer' })
            .send({
                "clientId": clienteCreadoA._id.toString(),
                "projectId": "123456789012345678901234",
                "name": "prueba",
                "format": "material",
                "material": [
                    {
                        "description": "prueba",
                        "quantity": 4
                    }
                ]
            })
            .set('Accept', 'application/json')
            .expect(404)
    })
    test('should create a deliverynote', async () => {
        const response1 = await api
            .post('/practica/deliverynote')
            .auth(tokenUserPrueba, { type: 'bearer' })
            .send({
                "clientId": clienteCreadoA._id.toString(),
                "projectId": projectCreatedA._id.toString(),
                "name": "prueba",
                "format": "hours",
                "hours": [
                    {
                        "description": "prueba",
                        "quantity": 4
                    }
                ]
            })
            .set('Accept', 'application/json')
            .expect(201)
        const response2 = await api
            .post('/practica/deliverynote')
            .auth(tokenUserPrueba, { type: 'bearer' })
            .send({
                "clientId": clienteCreadoA._id.toString(),
                "projectId": projectCreatedA._id.toString(),
                "name": "prueba",
                "format": "material",
                "material": [
                    {
                        "description": "prueba",
                        "quantity": 4
                    }
                ]
            })
            .set('Accept', 'application/json')
            .expect(201)
        const response3 = await api
            .post('/practica/deliverynote')
            .auth(tokenUserPrueba, { type: 'bearer' })
            .send({
                "clientId": clienteCreadoA._id.toString(),
                "projectId": projectCreatedA._id.toString(),
                "name": "prueba",
                "format": "any",
                "hours": [
                    {
                        "description": "prueba",
                        "quantity": 4
                    }
                ],
                "material": [
                    {
                        "description": "prueba",
                        "quantity": 4
                    }
                ]
            })
            .set('Accept', 'application/json')
            .expect(201)
        const response4 = await api
            .post('/practica/deliverynote')
            .auth(tokenUserPrueba, { type: 'bearer' })
            .send({
                "clientId": clienteCreadoA._id.toString(),
                "projectId": projectCreatedA._id.toString(),
                "name": "prueba",
                "format": "any",
                "hours": [
                    {
                        "description": "prueba",
                        "quantity": 4
                    }
                ]
            })
            .set('Accept', 'application/json')
            .expect(201)
        const response5 = await api
            .post('/practica/deliverynote')
            .auth(tokenUserPrueba, { type: 'bearer' })
            .send({
                "clientId": clienteCreadoA._id.toString(),
                "projectId": projectCreatedA._id.toString(),
                "name": "prueba",
                "format": "any",
                "material": [
                    {
                        "description": "prueba",
                        "quantity": 4
                    }
                ]
            })
            .set('Accept', 'application/json')
            .expect(201)
        const response6 = await api
            .post('/practica/deliverynote')
            .auth(tokenUserPrueba, { type: 'bearer' })
            .send({
                "clientId": clienteCreadoA._id.toString(),
                "projectId": projectCreatedA._id.toString(),
                "name": "prueba",
                "format": "any"
            })
            .set('Accept', 'application/json')
            .expect(201)
    })
})

describe('get deliverynotes', () => {
    test('should get an error "NOT_SESSION"', async () => {
        const response = await api
            .post('/practica/deliverynote')
            .send(projectCreated)
            .set('Accept', 'application/json')
            .expect(401)
    })
    test('should get the deliverynotes of a user', async () => {
        const response = await request(app)
            .get('/practica/deliverynote')
            .auth(tokenUserPrueba, { type: 'bearer' })
            .expect(200)
    })
})

describe('get deliverynote by id', () => {
    test('should get an error "NOT_SESSION"', async () => {
        const response = await request(app)
            .get(`/practica/deliverynote/${deliverynoteCreatedA._id.toString()}`)
            .expect(401)
    })
    test('should get an error DELIVERYNOTE NOT FOUND', async () => {
        const response = await request(app)
            .get('/practica/project/12')
            .auth(tokenUserPrueba, { type: 'bearer' })
            .expect(404)
    })
    test('should get a deliverynote', async () => {
        const response = await request(app)
            .get(`/practica/deliverynote/${deliverynoteCreatedA._id.toString()}`)
            .auth(tokenUserPrueba, { type: 'bearer' })
            .expect(200)
        expect(response.body._id).toEqual(deliverynoteCreatedA._id.toString())
        expect(response.body.userId._id).toEqual(deliverynoteCreatedA.userId.toString())
    })
})

describe('get deliverynote pdf by id', () => {
    test('should get an error "NOT_SESSION"', async () => {
        const response = await request(app)
            .get(`/practica/deliverynote/pdf/${deliverynoteCreatedA._id.toString()}`)
            .expect(401)
    })
    test('should get an error DELIVERYNOTE NOT FOUND', async () => {
        const response = await request(app)
            .get('/practica/deliverynote/pdf/012345678901234567891234')
            .auth(tokenUserPrueba, { type: 'bearer' })
            .expect(404)
    })
    test('should get a deliverynote pdf', async () => {
        const response = await request(app)
            .get(`/practica/deliverynote/pdf/${deliverynoteCreatedA._id.toString()}`)
            .auth(tokenUserPrueba, { type: 'bearer' })
            .expect(200)
    })
})

describe('patch deliverynote signature by id', () => {
    test('should get an error "NOT_SESSION"', async () => {
        const response = await request(app)
            .patch(`/practica/deliverynote/firmar/${deliverynoteCreatedA._id.toString()}`)
            .expect(401)
    })
    test('should get an error DELIVERYNOTE NOT FOUND', async () => {
        const response = await request(app)
            .patch('/practica/deliverynote/firmar/012345678901234567891234')
            .auth(tokenUserPrueba, { type: 'bearer' })
            .expect(404)
    })
    test('should patch a deliverynote signature', async () => {
        const response = await request(app)
            .patch(`/practica/deliverynote/firmar/${deliverynoteCreatedA._id.toString()}`)
            .auth(tokenUserPrueba, { type: 'bearer' })
            .attach('image', './firma.jpg')
            .expect(200)
    })
})

afterAll(async () => {
    server.close()
    await mongoose.connection.close()
})