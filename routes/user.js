const express = require('express')
const userRouter = express.Router()
const app = express()
const {createItem, validationEmail, login, uploadImage, uploadPersonalData, uploadCompanyData, getUser, deleteUser, verificationCode, verifyVerificationCode} = require('../controllers/user.js')
const {validatorCreateItem, validatorCode, validatorLogin, validatorPersonalData, validatorCompany, validatorDeleteUser, validatorVerificationCode} = require('../validators/user.js')
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

userRouter.patch('/logo', authMiddleware, uploadMiddlewareMemory.single("image"), uploadImage)

userRouter.get('/getUser', authMiddleware, getUser)

userRouter.delete('/deleteUser', authMiddleware, validatorDeleteUser, deleteUser)

userRouter.get('/recuperarPassword/verificationCode', authMiddleware, verificationCode)

userRouter.post('/recuperarPassword/verificationCode', authMiddleware, validatorVerificationCode, verifyVerificationCode)

module.exports = userRouter