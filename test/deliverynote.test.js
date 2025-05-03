const request = require("supertest")
const { app, server } = require("../index.js")
const mongoose = require("mongoose")
const { encrypt } = require('../utils/handlePassword.js')
const { tokenSign } = require('../utils/handleJwt')
const ClientModel = require('../models/client.js')
const UserModel = require('../models/user.js')
const ProjectModel = require('../models/project.js')

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

var clientPrueba = {
    "name": "cliente1",
    "cif": "12345678A",
    "address": "Madrid" 
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

beforeAll(async () => {
    await new Promise((resolve) => mongoose.connection.once('connected', resolve));

});

beforeEach(async () => {
    await UserModel.deleteMany({})
    await ClientModel.deleteMany({})
    await ProjectModel.deleteMany({})

    userPrueba.password = await encrypt(password)
    userPruebaA = await UserModel.create(userPrueba)
    tokenUserPrueba = await tokenSign(userPruebaA)

    clienteCreado.userId = userPruebaA._id.toString()
    clienteCreadoA = await ClientModel.create(clienteCreado)

    projectCreated.clientId = clienteCreadoA._id.toString()
    projectCreated.userId = userPruebaA._id.toString()
    projectCreatedA = await ProjectModel.create(projectCreated)

    projectPrueba.clientId = clienteCreadoA._id.toString()
})

describe('post deliverynote', () => {
    test('should get an error "NOT_SESSION"', async () => {
        const response = await request(app)
            .post('/practica/deliverynote')
            .send(projectPrueba)
            .set('Accept', 'application/json')
            .expect(401)
    })
    test('should get an error due to lack of data', async () => {
        const response1 = await request(app)
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
        const response2 = await request(app)
            .post('/practica/deliverynote')
            .auth(tokenUserPrueba, { type: 'bearer' })
            .send({
                "clientId": clienteCreadoA._id.toString(),
                "projectId": projectCreatedA._id.toString(),
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
    })
    test('should get an error INVALID DATA', async () => {
        const response = await request(app)
            .post('/practica/deliverynote')
            .auth(tokenUserPrueba, { type: 'bearer' })
            .send({
                
            })
            .set('Accept', 'application/json')
            .expect(401)
    })
    test('should create a deliverynote', async () => {
        const response = await request(app)
            .post('/practica/deliverynote')
            .auth(tokenUserPrueba, { type: 'bearer' })
            .send({

            })
            .set('Accept', 'application/json')
            .expect(201)
        expect(response.body.name).toEqual(projectPrueba.name)
        expect(response.body.userId).toEqual(userPruebaA._id.toString())
    })
})

afterAll(async () => {
    server.close()
    await mongoose.connection.close()
})