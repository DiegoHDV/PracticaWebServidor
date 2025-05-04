const express = require('express')
const deliverynoteRouter = express.Router()
const {createItem, getDeliverynotes, getOneDeliverynote, getPDF, firmarDeliverynote} = require('../controllers/deliverynote.js')
const {validatorCreateItem} = require('../validators/deliverynote.js')
const {authMiddleware} = require('../middleware/sessionJwt.js')
const {verifyFormat} = require('../utils/handleFormat.js')
const { uploadMiddlewareMemory } = require('../utils/handleMemmory.js')

const app = express()

app.use('/practica/deliverynote', deliverynoteRouter)

deliverynoteRouter.post('/', authMiddleware, validatorCreateItem, verifyFormat, createItem)

deliverynoteRouter.get('/', authMiddleware, getDeliverynotes)

deliverynoteRouter.get('/:id', authMiddleware, getOneDeliverynote)

deliverynoteRouter.get('/pdf/:id', authMiddleware, getPDF)

deliverynoteRouter.patch('/firmar/:id', authMiddleware, uploadMiddlewareMemory.single("image"), firmarDeliverynote)

module.exports = deliverynoteRouter