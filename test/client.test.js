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

var clientDeleted = {
    "name": "clienteCreado",
    "cif": "12345678C",
    "address": "Madrid"
}

beforeAll(async () => {
    await new Promise((resolve) => mongoose.connection.once('connected', resolve));

});

beforeEach(async () => {
    await UserModel.deleteMany({})
    await ClientModel.deleteMany({})
    userPrueba.password = await encrypt(password)
    userPruebaA = await UserModel.create(userPrueba)
    tokenUserPrueba = await tokenSign(userPruebaA)
    clienteCreado.userId = userPruebaA._id.toString()
    clienteCreadoA = await ClientModel.create(clienteCreado)
    clientDeleted.userId = userPruebaA._id.toString()
    clientDeletedA = await ClientModel.create(clientDeleted)
    await ClientModel.delete({_id: clientDeletedA._id})
})

describe('post Client', () => {
    test('should get an error "NOT_SESSION"', async () => {
        const response = await request(app)
            .post('/practica/client')
            .send(clientPrueba)
            .set('Accept', 'application/json')
            .expect(401)
    })
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
    test('should get an error "NOT_SESSION"', async () => {
        const response = await request(app)
            .patch(`/practica/client/${clienteCreadoA._id.toString()}`)
            .send(clientPrueba)
            .set('Accept', 'application/json')
            .expect(401)
    })
    test('should get an error CLIENT NOT FOUND', async () =>{
        const response = await request(app)
            .patch('/practica/client/12')
            .auth(tokenUserPrueba, { type: 'bearer' })
            .send({
                "name": "no Existe"
            })
            .set('Accept', 'application/json')
            .expect(404)
    })
    test('should update a client', async () => {
        const modificacion = 'modificado'
        const response = await request(app)
            .patch(`/practica/client/${clienteCreadoA._id.toString()}`)
            .auth(tokenUserPrueba, { type: 'bearer' })
            .send({
                "name": modificacion
            })
            .set('Accept', 'application/json')
            .expect(200)
    })
})

describe('get user clients', () => {
    test('should get an error "NOT_SESSION"', async () => {
        const response = await request(app)
            .get('/practica/client')
            .expect(401)
    })
    test('should get the clients of a user', async () => {
        const response = await request(app)
            .get('/practica/client')
            .auth(tokenUserPrueba, { type: 'bearer' })
            .expect(200)
        expect(response.body.length).toEqual(1)
        expect(response.body[0].userId).toEqual(userPruebaA._id.toString())
    })
})

describe('get client by id', () => {
    test('should get an error "NOT_SESSION"', async () => {
        const response = await request(app)
            .get('/practica/client')
            .expect(401)
    })
    test('should get an error CLIENT NOT FOUND', async () => {
        const response = await request(app)
            .get('/practica/client/12')
            .auth(tokenUserPrueba, { type: 'bearer' })
            .expect(404)
    })
    test('should get a user', async () => {
        const response = await request(app)
            .get(`/practica/client/${clienteCreadoA._id.toString()}`)
            .auth(tokenUserPrueba, { type: 'bearer' })
            .expect(200)
        expect(response.body._id).toEqual(clienteCreadoA._id.toString())
    })
})

describe('delete soft and hard a client', () => {
    test('should get an error "NOT_SESSION"', async () => {
        const response = await request(app)
            .delete('/practica/client/deleteClient?soft=true')
            .expect(401)
    })
    test('should get an error due to lack of data', async () => {
        const response1 = await request(app)
            .delete('/practica/client/deleteClient')
            .auth(tokenUserPrueba, { type: 'bearer' })
            .send({
                "cif": clienteCreado.cif
            })
            .set('Accept', 'application/json')
            .expect(403)
        const response2 = await request(app)
            .delete('/practica/client/deleteClient?soft=true')
            .auth(tokenUserPrueba, { type: 'bearer' })
            .set('Accept', 'application/json')
            .expect(403)
    })
    test('should get error CLIENT NOT FOUND', async () => {
        const response = await request(app)
            .delete('/practica/client/deleteClient?soft=true')
            .auth(tokenUserPrueba, { type: 'bearer' })
            .send({
                "cif": "AAAAAAAAA"
            })
            .set('Accept', 'application/json')
            .expect(404)
        const response2 = await request(app)
            .delete('/practica/client/deleteClient?soft=true')
            .auth(tokenUserPrueba, { type: 'bearer' })
            .send({
                "cif": clientDeleted.cif
            })
            .set('Accept', 'application/json')
            .expect(404)
    })
    test('should delete soft a client', async () => {
        const response = await request(app)
            .delete('/practica/client/deleteClient?soft=true')
            .auth(tokenUserPrueba, { type: 'bearer' })
            .send({
                "cif": clienteCreado.cif
            })
            .set('Accept', 'application/json')
            .expect(200)
    })
    test('should delete hard a client', async () => {
        const response = await request(app)
            .delete('/practica/client/deleteClient?soft=false')
            .auth(tokenUserPrueba, { type: 'bearer' })
            .send({
                "cif": clienteCreado.cif
            })
            .set('Accept', 'application/json')
            .expect(200)
    })
})

afterAll(async () => {
    server.close()
    await mongoose.connection.close()
})