const express = require('express')
const clientRouter = express.Router()
const {createItem, updateItem, getUserClients, getClient} = require('../controllers/client.js')
const {validatorCreateItem, validatorUpdateItem} = require('../validators/client.js')
const {authMiddleware} = require('../middleware/sessionJwt.js')
const app = express()

app.use('/practica/client', clientRouter)

clientRouter.post('/', authMiddleware, validatorCreateItem, createItem)

clientRouter.patch('/:id', authMiddleware, validatorUpdateItem, updateItem)

clientRouter.get('/', authMiddleware, getUserClients)

clientRouter.get('/:id', authMiddleware, getClient)

module.exports = clientRouter