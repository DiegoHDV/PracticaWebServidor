const express = require('express')
const userRouter = express.Router()
const app = express()
const {createItem, validationEmail, login, uploadImage, uploadPersonalData, uploadCompanyData, getUser, deleteUser, verificationEmailCode, verifyVerificationCode, updatePassword, invitePartners} = require('../controllers/user.js')
const {validatorCreateItem, validatorCode, validatorLogin, validatorPersonalData, validatorCompany, validatorDeleteUser, validatorEmail, validatorVerificationCode, validatorNewPassword, validatorInvitePartners} = require('../validators/user.js')
const {authMiddleware} = require('../middleware/sessionJwt.js')
const { uploadMiddlewareMemory } = require('../utils/handleMemmory.js')
const user = require('../models/user.js')

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

userRouter.get('/recuperarPassword/verificationEmailCode', validatorEmail, verificationEmailCode)

userRouter.post('/recuperarPassword/verifyCode', authMiddleware, validatorVerificationCode, verifyVerificationCode)

userRouter.post('/recuperarPassword/changePassword', authMiddleware, validatorNewPassword, updatePassword)

userRouter.post('/invitarGente', authMiddleware, validatorInvitePartners, invitePartners)

module.exports = userRouter