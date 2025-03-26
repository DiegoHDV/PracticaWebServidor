const express = require('express')
const userRouter = express.Router()
const app = express()
const {createItem, validationEmail, login, uploadImage, uploadPersonalData, uploadCompanyData} = require('../controllers/user.js')
const {validatorCreateItem, validatorCode, validatorLogin, validatorPersonalData, validatorCompany} = require('../validators/user.js')
const {authMiddleware} = require('../middleware/sessionJwt.js')
const { uploadMiddlewareMemory } = require('../utils/handleMemmory.js')

app.use('/practica/user', userRouter)

userRouter.get('/', (req, res) => {
    res.send("Funciona")
})

userRouter.post('/register', validatorCreateItem, createItem)

userRouter.post('/register/validation', authMiddleware, validatorCode, validationEmail)

userRouter.post('/login', validatorLogin, login)

userRouter.put('/personalData', authMiddleware, validatorPersonalData, uploadPersonalData)

userRouter.put('/company', authMiddleware, validatorCompany, uploadCompanyData)

userRouter.patch('/:id/logo', uploadMiddlewareMemory.single("image"), uploadImage)

module.exports = userRouter