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

describe('update Client', () => {
    test('should get an error "NOT_SESSION"', async () => {
        const response = await request(app)
            .patch(`/practica/project/${projectCreatedA._id.toString()}`)
            .send(projectPrueba)
            .set('Accept', 'application/json')
            .expect(401)
    })
    test('should get an error PROJECT NOT FOUND', async () =>{
        const response = await request(app)
            .patch('/practica/project/12')
            .auth(tokenUserPrueba, { type: 'bearer' })
            .send({
                "name": "no Existe"
            })
            .set('Accept', 'application/json')
            .expect(404)
    })
    test('should update a project', async () => {
        const modificacion = 'modificado'
        const response = await request(app)
            .patch(`/practica/project/${projectCreatedA._id.toString()}`)
            .auth(tokenUserPrueba, { type: 'bearer' })
            .send({
                "name": modificacion
            })
            .set('Accept', 'application/json')
            .expect(200)
    })
})

describe('get user projects', () => {
    test('should get an error "NOT_SESSION"', async () => {
        const response = await request(app)
            .get('/practica/project')
            .expect(401)
    })
    test('should get the projects of a user', async () => {
        const response = await request(app)
            .get('/practica/project')
            .auth(tokenUserPrueba, { type: 'bearer' })
            .expect(200)
        expect(response.body.length).toEqual(1)
        expect(response.body[0].userId).toEqual(userPruebaA._id.toString())
    })
})

describe('get project by id', () => {
    test('should get an error "NOT_SESSION"', async () => {
        const response = await request(app)
            .get(`/practica/project/${projectCreatedA._id.toString()}`)
            .expect(401)
    })
    test('should get an error PROJECT NOT FOUND', async () => {
        const response = await request(app)
            .get('/practica/project/12')
            .auth(tokenUserPrueba, { type: 'bearer' })
            .expect(404)
    })
    test('should get a project', async () => {
        const response = await request(app)
            .get(`/practica/project/${projectCreatedA._id.toString()}`)
            .auth(tokenUserPrueba, { type: 'bearer' })
            .expect(200)
        expect(response.body._id).toEqual(projectCreatedA._id.toString())
    })
})

afterAll(async () => {
    server.close()
    await mongoose.connection.close()
})