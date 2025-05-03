const express = require('express')
const deliverynoteRouter = express.Router()
const {createItem} = require('../controllers/deliverynote.js')
const {validatorCreateItem} = require('../validators/deliverynote.js')
const {authMiddleware} = require('../middleware/sessionJwt.js')
const {verifyFormat} = require('../utils/handleFormat.js')
const app = express()

app.use('/practica/deliverynote', deliverynoteRouter)

deliverynoteRouter.post('/', authMiddleware, validatorCreateItem, verifyFormat, createItem)

module.exports = deliverynoteRouter