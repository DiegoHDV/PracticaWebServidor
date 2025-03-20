const express = require('express')
const userRouter = express.Router()
const app = express()
const {createItem, validationEmail, login} = require('../controllers/user.js')
const {validatorCreateItem, validatorCode, validatorLogin} = require('../validators/user.js')
const {authMiddleware} = require('../middleware/sessionJwt.js')

app.use('/practica/user', userRouter)

userRouter.get('/', (req, res) => {
    res.send("Funciona")
})

userRouter.post('/register', validatorCreateItem, createItem)

userRouter.post('/register/validation', authMiddleware, validatorCode, validationEmail)

userRouter.post('/login', validatorLogin, login)

module.exports = userRouter