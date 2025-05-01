const express = require('express')
const clientRouter = express.Router()
const {createItem, updateItem, getUserClients, getClient, deleteClient} = require('../controllers/client.js')
const {validatorCreateItem, validatorUpdateItem, validatorDeleteClient} = require('../validators/client.js')
const {authMiddleware} = require('../middleware/sessionJwt.js')
const app = express()

app.use('/practica/client', clientRouter)

clientRouter.post('/', authMiddleware, validatorCreateItem, createItem)

clientRouter.patch('/:id', authMiddleware, validatorUpdateItem, updateItem)

clientRouter.get('/', authMiddleware, getUserClients)

clientRouter.get('/:id', authMiddleware, getClient)

clientRouter.delete('/:id', authMiddleware, validatorDeleteClient, deleteClient)


module.exports = clientRouter