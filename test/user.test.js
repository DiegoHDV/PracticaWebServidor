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
})


afterAll(async () => {
    server.close()
    await mongoose.connection.close()
})