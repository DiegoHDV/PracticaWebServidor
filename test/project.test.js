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

var clientDeleted = {
    "name": "clienteBorrado",
    "cif": "12345678C",
    "address": "Madrid"
}

var projectPrueba = {
    "clientId": "",
    "projectCode": "1234",
    "name": "prueba",
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

    clientDeleted.userId = userPruebaA._id.toString()
    clientDeletedA = await ClientModel.create(clientDeleted)
    await ClientModel.delete({_id: clientDeletedA._id})

    projectCreated.clientId = clienteCreadoA._id.toString()
    projectCreated.userId = userPruebaA._id.toString()
    projectCreatedA = await ProjectModel.create(projectCreated)

    projectPrueba.clientId = clienteCreadoA._id.toString()
})

describe('post Project', () => {
    test('should get an error "NOT_SESSION"', async () => {
        const response = await request(app)
            .post('/practica/project')
            .send(projectPrueba)
            .set('Accept', 'application/json')
            .expect(401)
    })
    test('should get an error due to lack of data', async () => {
        const response = await request(app)
            .post('/practica/project')
            .auth(tokenUserPrueba, { type: 'bearer' })
            .send({
                "name": "Proyecto"
            })
            .set('Accept', 'application/json')
            .expect(403)
    })
    test('should get an error PROJECT ALREADY EXISTS', async () => {
        const response = await request(app)
            .post('/practica/project')
            .auth(tokenUserPrueba, { type: 'bearer' })
            .send(projectCreated)
            .set('Accept', 'application/json')
            .expect(401)
    })
    test('should get an error CLIENT NOT FOUND', async () => {
        projectPrueba.clientId = "123456789009876543211234"
        const response = await request(app)
            .post('/practica/project')
            .auth(tokenUserPrueba, { type: 'bearer' })
            .send(projectPrueba)
            .set('Accept', 'application/json')
            .expect(404)
    })
    test('should create a project', async () => {
        const response = await request(app)
            .post('/practica/project')
            .auth(tokenUserPrueba, { type: 'bearer' })
            .send(projectPrueba)
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