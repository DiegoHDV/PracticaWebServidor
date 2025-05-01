const express = require('express')
const clientRouter = express.Router()
const {createItem} = require('../controllers/client.js')
const {validatorCreateItem} = require('../validators/client.js')
const {authMiddleware} = require('../middleware/sessionJwt.js')
const app = express()

app.use('/practica/client', clientRouter)

clientRouter.post('/', authMiddleware, validatorCreateItem, createItem)

module.exports = clientRouter