const request = require("supertest")
const { app, server } = require("../index.js")
const mongoose = require("mongoose")
const { encrypt } = require('../utils/handlePassword.js')
const { tokenSign } = require('../utils/handleJwt')
const UserModel = require('../models/user.js')

const api = request(app)
const userUsed = { "name": "Hola", age: 20, "email": "hola@gmail.com", "password": "HolaMundo.01" }

let token
beforeAll(async () => {
    await new Promise((resolve) => mongoose.connection.once('connected', resolve));

});


describe.skip('userRegister', () => {
    var token = ""
    var id = ""
    test.skip('should get an error due to lack of data', async () => {
        const response = await request(app)
            .post('/practica/user/register')
            .send({ "name": "Menganito", "email": "jopetis28@gmail.com", "password": "HolaMundo.01" })
            .set('Accept', 'application/json')
            .expect(403)
    })
    test('should create a user', async () => {
        const response = await request(app)
            .post('/practica/user/register')
            .send({ "name": "Juan", age: 20, "email": "jopetis28@gmail.com", "password": "HolaMundo.01" })
            .set('Accept', 'application/json')
            .expect(201)
        expect(response.body.user.email).toEqual('jopetis28@gmail.com')
        expect(response.body.user.role).toEqual(['user'])
        token = response.body.token
        id = response.body.user._id
    })
    test('should get an error "ERROR_EMAIL_ALREADY_EXISTS"', async () => {
        const response = await request(app)
            .post('/practica/user/register')
            .send({ "name": "Juan", age: 20, "email": "jopetis28@gmail.com", "password": "HolaMundo.01" })
            .set('Accept', 'application/json')
            .expect(409)
    })
})


describe.skip('userRegisterValidation', () => {
    var tokenHola = ""
    var idHola = ""
    var code_validationHola = 0
    var tokenHMundo = ""
    var idHMundo = ""
    var code_validationHMundo = 0
    test('should create a user', async () => {
        const response1 = await request(app)
            .post('/practica/user/register')
            .send({ "name": "HolaMundo", age: 20, "email": "holaMundo@gmail.com", "password": "HolaMundo.01" })
            .set('Accept', 'application/json')
            .expect(201)
        expect(response1.body.user.email).toEqual('holaMundo@gmail.com')
        expect(response1.body.user.role).toEqual(['user'])
        tokenHMundo = response1.body.token
        idHMundo = response1.body.user._id
        code_validationHMundo = response1.body.user.code_validation

        const response2 = await request(app)
            .post('/practica/user/register')
            .send(userUsed)
            .set('Accept', 'application/json')
            .expect(201)
        expect(response2.body.user.email).toEqual('hola@gmail.com')
        expect(response2.body.user.role).toEqual(['user'])
        tokenHola = response2.body.token
        idHola = response2.body.user._id
        code_validationHola = response2.body.user.code_validation
        userUsed.id = idHola
    })
    test('should get an error "NOT_SESSION"', async () => {
        const response = await request(app)
            .post('/practica/user/register/validation')
            .send({ "code": 123456 })
            .set('Accept', 'application/json')
            .expect(401)
    })
    test('should get an error due to lack of data', async () => {
        const response1 = await request(app)
            .post('/practica/user/register/validation')
            .auth(tokenHMundo, { type: 'bearer' })
            .send({ "code": 1234567 })
            .set('Accept', 'application/json')
            .expect(403)
        const response2 = await request(app)
            .post('/practica/user/register/validation')
            .auth(tokenHMundo, { type: 'bearer' })
            .send({ "code": 12345 })
            .set('Accept', 'application/json')
            .expect(403)
    })
    test('should get an error "ERROR_CODE_VALIDATION" and user blocked', async () => {
        const response1 = await request(app)
            .post('/practica/user/register/validation')
            .auth(tokenHMundo, { type: 'bearer' })
            .send({ "code": 123456 })
            .set('Accept', 'application/json')
            .expect(401)
        const response2 = await request(app)
            .post('/practica/user/register/validation')
            .auth(tokenHMundo, { type: 'bearer' })
            .send({ "code": 123456 })
            .set('Accept', 'application/json')
            .expect(401)
        const response3 = await request(app)
            .post('/practica/user/register/validation')
            .auth(tokenHMundo, { type: 'bearer' })
            .send({ "code": 123456 })
            .set('Accept', 'application/json')
            .expect(401)
        const response4 = await request(app)
            .post('/practica/user/register/validation')
            .auth(tokenHMundo, { type: 'bearer' })
            .send({ "code": 123456 })
            .set('Accept', 'application/json')
            .expect(404)
    })
    test('should validate a user', async () => {
        const response = await request(app)
            .post('/practica/user/register/validation')
            .auth(tokenHola, { type: 'bearer' })
            .send({ "code": code_validationHola })
            .set('Accept', 'application/json')
            .expect(200)
        expect(response.body.email).toEqual(userUsed.email)
        expect(response.body.code_validation).toEqual(code_validationHola)
    })
    test('should get an error "ERROR_USER_ALREADY_VALIDATED"', async () => {
        const response = await request(app)
            .post('/practica/user/register/validation')
            .auth(tokenHola, { type: 'bearer' })
            .send({ "code": code_validationHola })
            .set('Accept', 'application/json')
            .expect(401)
    })
})


describe.skip('userLogin', () => {
    var token = ""
    var id = ""
    var code_validation = 0
    test('should get an error "USER_NOT_FOUND"', async () => {
        const response = await request(app)
            .post('/practica/user/login')
            .send({ "email": "novalidado@gmail.com", "password": "HolaMundo.01" })
            .set('Accept', 'application/json')
            .expect(404)
    })
    test('should create a user', async () => {
        const response = await request(app)
            .post('/practica/user/register')
            .send({ "name": "NoValidado", age: 20, "email": "novalidado@gmail.com", "password": "HolaMundo.01" })
            .set('Accept', 'application/json')
            .expect(201)
        expect(response.body.user.email).toEqual('novalidado@gmail.com')
        expect(response.body.user.role).toEqual(['user'])
        token = response.body.token
        id = response.body.user._id
        code_validation = response.body.user.code_validation
    })
    test('should get an error due to lack of data', async () => {
        const response = await request(app)
            .post('/practica/user/login')
            .send({"email": userUsed.email})
            .set('Accept', 'application/json')
            .expect(403)
    })
    test('should get an error user not validated', async () => {
        const response = await request(app)
            .post('/practica/user/login')
            .send({ "email": "novalidado@gmail.com", "password": "HolaMundo.01" })
            .set('Accept', 'application/json')
            .expect(403)
    })
    test('should validate a user', async () => {
        const response = await request(app)
            .post('/practica/user/register/validation')
            .auth(token, { type: 'bearer' })
            .send({ "code": code_validation })
            .set('Accept', 'application/json')
            .expect(200)
        expect(response.body.email).toEqual("novalidado@gmail.com")
        expect(response.body.code_validation).toEqual(code_validation)
    })
    test('should get an error incorrect password and usser blocked', async () => {
        const response1 = await request(app)
            .post('/practica/user/login')
            .send({ "email": "novalidado@gmail.com", "password": "123456789" })
            .set('Accept', 'application/json')
            .expect(402)
        const response2 = await request(app)
            .post('/practica/user/login')
            .send({ "email": "novalidado@gmail.com", "password": "123456789" })
            .set('Accept', 'application/json')
            .expect(402)
        const response3 = await request(app)
            .post('/practica/user/login')
            .send({ "email": "novalidado@gmail.com", "password": "123456789" })
            .set('Accept', 'application/json')
            .expect(402)
        const response4 = await request(app)
            .post('/practica/user/login')
            .send({ "email": "novalidado@gmail.com", "password": "123456789" })
            .set('Accept', 'application/json')
            .expect(404)
    })
    test('should login a user', async () => {
        const response = await request(app)
            .post('/practica/user/login')
            .send({ "email": userUsed.email, "password": userUsed.password })
            .set('Accept', 'application/json')
            .expect(200)
        expect(response.body.user.email).toEqual(userUsed.email)
        expect(response.body.user._id).toEqual(userUsed.id)
    })
})

var userPrueba = {
    "name":"Pruebas",
    "age":20,
    "email":"prueba@gmail.com",
    "password":"Prueba123",
    "role":["user"],
    "code_validation":"123456",
    "validado":true,
    "intentos":3,
    "bloqueado":false,
    "autonomo":true,
    "deleted":false,
    "verificate":false
}
var userPruebaSoftDeleted = {
    "name":"PruebaDeleted",
    "age":23,
    "email":"pruebadeleted@gmail.com",
    "password":"PruebaDeleted123",
    "role":["user"],
    "code_validation":"567890",
    "validado":true,
    "intentos":3,
    "bloqueado":false,
    "autonomo":true,
    "deleted":true,
    "verificate":false
}
var tokenUserPrueba = ""
var idUserPrueba = ""

beforeEach(async () => {
    await UserModel.deleteMany({})
    userPruebaA = await UserModel.create(userPrueba)
    tokenUserPrueba = await tokenSign(userPruebaA)
    userPruebaSoftDeletedA = await UserModel.create(userPruebaSoftDeleted)
    tokenUserDeleted = await tokenSign(userPruebaSoftDeletedA)
})

describe('personalData', () => {
    
    test('should get an error "NOT_SESSION"', async () => {
        const response = await request(app)
            .put('/practica/user/personalData')
            .send({
                "name2": "Patata",
                "fullname": "Campera",
                "nif": "12341234B"
            })
            .set('Accept', 'application/json')
            .expect(401)
    })
    test('should get an error due to lack of data', async () => {
        const response = await request(app)
            .put('/practica/user/personalData')
            .auth(tokenUserPrueba, { type: 'bearer' })
            .send({
                "name2": "Patata",
                "fullname": "Campera"
            })
            .set('Accept', 'application/json')
            .expect(403)
    })
    test('should get an error "ERROR_USER_NOT_FOUND"', async () => {
        const response = await request(app)
            .put('/practica/user/personalData')
            .auth(tokenUserDeleted, { type: 'bearer' })
            .send({
                "name2": "Patata",
                "fullname": "Campera",
                "nif": "12341234B"
            })
            .set('Accept', 'application/json')
            .expect(404)
    })
    test('should change the personalData', async () => {
        const response = await request(app)
            .put('/practica/user/personalData')
            .auth(tokenUserPrueba, { type: 'bearer' })
            .send({
                "name2": "Patata",
                "fullname": "Campera",
                "nif": "12341234B"
            })
            .set('Accept', 'application/json')
            .expect(200)
    })
})

afterAll(async () => {
    server.close()
    await mongoose.connection.close()
})