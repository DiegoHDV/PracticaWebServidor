const express = require('express')
const clientRouter = express.Router()
const {validatorCreateItem} = require('../validators/client.js')
const app = express()

app.use('/practica/client', clientRouter)

clientRouter.post('/', validatorCreateItem)