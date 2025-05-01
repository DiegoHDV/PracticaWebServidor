const request = require("supertest")
const { app, server } = require("../index.js")
const mongoose = require("mongoose")
const { encrypt } = require('../utils/handlePassword.js')
const { tokenSign } = require('../utils/handleJwt')
const ClientModel = require('../models/client.js')
const UserModel = require('../models/user.js')

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

beforeAll(async () => {
    await new Promise((resolve) => mongoose.connection.once('connected', resolve));

});

beforeEach(async () => {
    await UserModel.deleteMany({})
    userPrueba.password = await encrypt(password)
    userPruebaA = await UserModel.create(userPrueba)
    tokenUserPrueba = await tokenSign(userPruebaA)
    clienteCreado.userId = userPruebaA._id.toString()
    clienteCreadoA = await ClientModel.create(clienteCreado)
})

describe('post Client', () => {
    test('should get an error due to lack of data', async () => {
        const response = await request(app)
            .post('/practica/client')
            .auth(tokenUserPrueba, { type: 'bearer' })
            .send({
                "name": "Patatita"
            })
            .set('Accept', 'application/json')
            .expect(403)
    })
    test('should create a client and get an error because the client has already been created for that user', async () => {
        const response = await request(app)
            .post('/practica/client')
            .auth(tokenUserPrueba, { type: 'bearer' })
            .send(clientPrueba)
            .set('Accept', 'application/json')
            .expect(201)
        expect(response.body.name).toEqual(clientPrueba.name)
        expect(response.body.userId).toEqual(userPruebaA._id.toString())
        const responseFail = await request(app)
            .post('/practica/client')
            .auth(tokenUserPrueba, { type: 'bearer' })
            .send(clientPrueba)
            .set('Accept', 'application/json')
            .expect(401)
    })
})

describe('update Client', () => {
    test()
})

afterAll(async () => {
    server.close()
    await mongoose.connection.close()
})