const express = require('express')
const clientRouter = express.Router()
const {createItem, updateItem} = require('../controllers/client.js')
const {validatorCreateItem, validatorUpdateItem} = require('../validators/client.js')
const {authMiddleware} = require('../middleware/sessionJwt.js')
const app = express()

app.use('/practica/client', clientRouter)

clientRouter.post('/', authMiddleware, validatorCreateItem, createItem)

clientRouter.patch('/:id', authMiddleware, validatorUpdateItem, updateItem)

module.exports = clientRouter