const request = require("supertest")
const { app, server } = require("../index.js")
const mongoose = require("mongoose")
const { encrypt } = require('../utils/handlePassword.js')
const { tokenSign } = require('../utils/handleJwt')
const UserModel = require('../models/user.js')

const api = request(app)

let token
beforeAll(async () => {
    await new Promise((resolve) => mongoose.connection.once('connected', resolve));
    await UserModel.deleteMany({})

});


describe('userRegister', () => {
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


describe('userRegisterValidation', () => {
    var tokenHola = ""
    var idHola = ""
    var code_validationHola = 0
    var tokenHMundo = ""
    var idHMundo = ""
    var code_validationHMundo = 0
    test('should create a user', async () => {
        const response = await request(app)
            .post('/practica/user/register')
            .send({ "name": "Hola", age: 20, "email": "hola@gmail.com", "password": "HolaMundo.01" })
            .set('Accept', 'application/json')
            .expect(201)
        expect(response.body.user.email).toEqual('hola@gmail.com')
        expect(response.body.user.role).toEqual(['user'])
        tokenHola = response.body.token
        idHola = response.body.user._id
        code_validationHola = response.body.user.code_validation
    })
    test('should create a user', async () => {
        const response = await request(app)
            .post('/practica/user/register')
            .send({ "name": "HolaMundo", age: 20, "email": "holaMundo@gmail.com", "password": "HolaMundo.01" })
            .set('Accept', 'application/json')
            .expect(201)
        expect(response.body.user.email).toEqual('holaMundo@gmail.com')
        expect(response.body.user.role).toEqual(['user'])
        tokenHMundo = response.body.token
        idHMundo = response.body.user._id
        code_validationHMundo = response.body.user.code_validation
    })
    test('should get an error "NOT_SESSION"', async () => {
        const response = await request(app)
            .post('/practica/user/register/validation')
            .send({ "code": 123456 })
            .set('Accept', 'application/json')
            .expect(401)
    })
    test('should get an error due to lack of data', async () => {
        const response = await request(app)
            .post('/practica/user/register/validation')
            .auth(tokenHMundo, { type: 'bearer' })
            .send({ "code": 12345 })
            .set('Accept', 'application/json')
            .expect(403)
    })
    test('should get an error due to lack of data', async () => {
        const response = await request(app)
            .post('/practica/user/register/validation')
            .auth(tokenHMundo, { type: 'bearer' })
            .send({ "code": 1234567 })
            .set('Accept', 'application/json')
            .expect(403)
    })
    test('should get an error "ERROR_CODE_VALIDATION"', async () => {
        const response = await request(app)
            .post('/practica/user/register/validation')
            .auth(tokenHMundo, { type: 'bearer' })
            .send({ "code": 123456 })
            .set('Accept', 'application/json')
            .expect(401)
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
            .expect(404)
    })
    test('should get validate a user', async () => {
        const response = await request(app)
            .post('/practica/user/register/validation')
            .auth(tokenHola, { type: 'bearer' })
            .send({ "code": code_validationHola })
            .set('Accept', 'application/json')
            .expect(200)
        expect(response.body.email).toEqual('hola@gmail.com')
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


afterAll(async () => {
    server.close()
    await mongoose.connection.close()
})