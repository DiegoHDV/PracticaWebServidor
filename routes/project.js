const express = require('express')
const projectRouter = express.Router()
const app = express()
const {authMiddleware} = require('../middleware/sessionJwt.js')
const {validatorCreateItem, validatorUpdateItem} = require('../validators/project.js')
const {createItem, updateItem} = require('../controllers/project.js')

app.use('/practica/project', projectRouter)

projectRouter.post('/', authMiddleware, validatorCreateItem, createItem)

projectRouter.patch('/:id', authMiddleware, validatorUpdateItem, updateItem)

module.exports = projectRouter