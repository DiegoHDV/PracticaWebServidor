const email = require('../utils/handleEmail.js')
const pinata = require('../utils/handleUploadIPFS.js')
const spyEmail = jest.spyOn(email, 'sendEmail').mockImplementation(() => {
    console.log("Enviando email")
})
/* const spyLogo = jest.spyOn(pinata, 'uploadToPinata').mockImplementation(() => {
    console.log("Subiendo imagen a pinata")
}) */
const request = require("supertest")
const { app, server } = require("../index.js")
const mongoose = require("mongoose")
const { encrypt } = require('../utils/handlePassword.js')
const { tokenSign } = require('../utils/handleJwt')
const UserModel = require('../models/user.js')

const api = request(app)

beforeAll(async () => {
    await new Promise((resolve) => mongoose.connection.once('connected', resolve));

});

/**
 * spyEmail.mockClear() Para limpiar el número de llamadas a la función dicha en el spyOn
 */

describe('userRegister', () => {
    test('should get an error due to lack of data', async () => {
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
        expect(spyEmail).toHaveBeenCalled()
    })
    test('should get an error "ERROR_EMAIL_ALREADY_EXISTS"', async () => {
        const response = await request(app)
            .post('/practica/user/register')
            .send({"name": userPrueba.name, "email": userPrueba.email, "password": password, "age": userPrueba.age})
            .set('Accept', 'application/json')
            .expect(409)
    })
})


describe('userRegisterValidation', () => {
    test('should get an error "NOT_SESSION"', async () => {
        const response = await request(app)
            .post('/practica/user/register/validation')
            .send({ "code": "123456" })
            .set('Accept', 'application/json')
            .expect(401)
    })
    test('should get an error due to lack of data', async () => {
        const response1 = await request(app)
            .post('/practica/user/register/validation')
            .auth(tokenUserNoValidado, { type: 'bearer' })
            .send({ "code": "1234567" })
            .set('Accept', 'application/json')
            .expect(403)
        const response2 = await request(app)
            .post('/practica/user/register/validation')
            .auth(tokenUserNoValidado, { type: 'bearer' })
            .send({ "code": "12345" })
            .set('Accept', 'application/json')
            .expect(403)
    })
    test('should get an error "ERROR_CODE_VALIDATION" and user blocked', async () => {
        const response1 = await request(app)
            .post('/practica/user/register/validation')
            .auth(tokenUserNoValidado, { type: 'bearer' })
            .send({ "code": "123458" })
            .set('Accept', 'application/json')
            .expect(401)
        const response2 = await request(app)
            .post('/practica/user/register/validation')
            .auth(tokenUserBloqueadoNoValidado, { type: 'bearer' })
            .send({ "code": "123456" })
            .set('Accept', 'application/json')
            .expect(404)
    })
    test('should validate a user', async () => {
        const response = await request(app)
            .post('/practica/user/register/validation')
            .auth(tokenUserNoValidado, { type: 'bearer' })
            .send({ "code": "123456" })
            .set('Accept', 'application/json')
            .expect(200)
        expect(response.body.email).toEqual(userNoValidado.email)
        expect(response.body.code_validation).toEqual(userNoValidado.code_validation)
    })
    test('should get an error "ERROR_USER_ALREADY_VALIDATED"', async () => {
        const response = await request(app)
            .post('/practica/user/register/validation')
            .auth(tokenUserPrueba, { type: 'bearer' })
            .send({ "code": "123456" })
            .set('Accept', 'application/json')
            .expect(401)
    })
})


describe('userLogin', () => {
    var token = ""
    var id = ""
    var code_validation = 0
    test('should get an error "USER_NOT_FOUND"', async () => {
        const response = await request(app)
            .post('/practica/user/login')
            .send({ "email": "nocreado@gmail.com", "password": "HolaMundo.01" })
            .set('Accept', 'application/json')
            .expect(404)
    })
    test('should get an error due to lack of data', async () => {
        const response = await request(app)
            .post('/practica/user/login')
            .send({"email": userPrueba.email})
            .set('Accept', 'application/json')
            .expect(403)
    })
    test('should get an error user not validated', async () => {
        const response = await request(app)
            .post('/practica/user/login')
            .send({ "email": userNoValidado.email, "password": password })
            .set('Accept', 'application/json')
            .expect(403)
    })
    test('should get an error incorrect password and user blocked', async () => {
        const response1 = await request(app)
            .post('/practica/user/login')
            .send({ "email": userPrueba.email, "password": "123456789" })
            .set('Accept', 'application/json')
            .expect(402)
        const response2 = await request(app)
            .post('/practica/user/login')
            .send({ "email": userBloqueadoValidado.email, "password": "123456789" })
            .set('Accept', 'application/json')
            .expect(404)
    })
    test('should login a user', async () => {
        const response = await request(app)
            .post('/practica/user/login')
            .send({ "email": userPrueba.email, "password": password })
            .set('Accept', 'application/json')
            .expect(200)
        expect(response.body.user.email).toEqual(userPrueba.email)
        expect(response.body.user._id).toEqual(userPruebaA.id)
    })
})

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
var userNoValidado = {
    "name":"PruebaValidacion",
    "age":23,
    "email":"pruebavalidacion@gmail.com",
    "password":password,
    "role":["user"],
    "code_validation":"123456",
    "validado":false,
    "intentos":3,
    "bloqueado":false,
    "autonomo":true,
    "deleted":false,
    "verificate":false
}
var userBloqueadoNoValidado = {
    "name":"PruebaBloqueadoNoValidado",
    "age":23,
    "email":"pruebabloqueadonovalidacion@gmail.com",
    "password":password,
    "role":["user"],
    "code_validation":"123456",
    "validado":false,
    "intentos":0,
    "bloqueado":true,
    "autonomo":true,
    "deleted":false,
    "verificate":false
}
var userBloqueadoValidado = {
    "name":"PruebaBloqueadoValidado",
    "age":23,
    "email":"pruebabloqueadovalidacion@gmail.com",
    "password":password,
    "role":["user"],
    "code_validation":"123456",
    "validado":true,
    "intentos":0,
    "bloqueado":true,
    "autonomo":true,
    "deleted":false,
    "verificate":false
}
var userPruebaSoftDeleted = {
    "name":"PruebaDeleted",
    "age":23,
    "email":"pruebadeleted@gmail.com",
    "password":password,
    "role":["user"],
    "code_validation":"567890",
    "validado":true,
    "intentos":3,
    "bloqueado":false,
    "autonomo":true,
    "deleted":true,
    "verificate":false
}

beforeEach(async () => {
    await UserModel.deleteMany({})
    userPrueba.password = await encrypt(password)
    userPruebaA = await UserModel.create(userPrueba)
    tokenUserPrueba = await tokenSign(userPruebaA)
    userPruebaSoftDeletedA = await UserModel.create(userPruebaSoftDeleted)
    tokenUserDeleted = await tokenSign(userPruebaSoftDeletedA)
    userNoValidadoA = await UserModel.create(userNoValidado)
    tokenUserNoValidado = await tokenSign(userNoValidadoA)
    userBloqueadoNoValidadoA = await UserModel.create(userBloqueadoNoValidado)
    tokenUserBloqueadoNoValidado = await tokenSign(userBloqueadoNoValidadoA)
    spyEmail.mockClear()
    //spyLogo.mockClear()
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


describe('companyData', () => {
    test('should get an error "NOT_SESSION"', async () => {
        const response = await request(app)
            .put('/practica/user/company')
            .send({
                "name": "U-Tad",
                "cif": "12349078B",
                "address": "Rozas"
            })
            .set('Accept', 'application/json')
            .expect(401)
    })
    test('should get an error due to lack of data', async () => {
        const response = await request(app)
            .put('/practica/user/company')
            .auth(tokenUserPrueba, { type: 'bearer' })
            .send({
                "name": "U-Tad",
                "cif": "12349078B"
            })
            .set('Accept', 'application/json')
            .expect(403)
    })
    test('should get an error "ERROR_USER_NOT_FOUND"', async () => {
        const response = await request(app)
            .put('/practica/user/company')
            .auth(tokenUserDeleted, { type: 'bearer' })
            .send({
                "name": "U-Tad",
                "cif": "12349078B",
                "address": "Rozas"
            })
            .set('Accept', 'application/json')
            .expect(404)
    })
    test('should change the companyData', async () => {
        const response = await request(app)
            .put('/practica/user/company')
            .auth(tokenUserPrueba, { type: 'bearer' })
            .send({
                "name": "U-Tad",
                "cif": "12349078B",
                "address": "Rozas"
            })
            .set('Accept', 'application/json')
            .expect(200)
    })
})


describe('logo', () => {
    test.skip('should get an error "NOT_SESSION"', async () => {
        const response = await request(app)
            .patch('/practica/user/logo')
            .attach('image', './pass.jpg')
            .expect(401)
    })
    test.skip('should get an error cause the file size', async () => {
        const response = await request(app)
            .patch('/practica/user/logo')
            .auth(tokenUserPrueba, { type: 'bearer' })
            .attach('image', './fondo22.jpg')
            .expect(500)
    })
    test('should patch the logo', async () => {
        const response = await request(app)
            .patch('/practica/user/logo')
            .auth(tokenUserPrueba, { type: 'bearer' })
            .attach('image', './user.jpg')
            .expect(200)
            //expect(spyLogo).toHaveBeenCalled()
    })
})

describe('get user', () => {
    test('should get an error "NOT_SESSION"', async () => {
        const response = await request(app)
            .get('/practica/user/getUser')
            .expect(401)
    })
    test('should get an error USER NOT FOUND', async () => {
        const response = await request(app)
            .get('/practica/user/getUser')
            .auth(tokenUserDeleted, { type: 'bearer' })
            .expect(404)
    })
    test('should get the user', async () => {
        const response = await request(app)
            .get('/practica/user/getUser')
            .auth(tokenUserPrueba, { type: 'bearer' })
            .expect(200)
    })
})

afterAll(async () => {
    server.close()
    await mongoose.connection.close()
})