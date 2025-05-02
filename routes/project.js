const express = require('express')
const projectRouter = express.Router()
const app = express()
const {authMiddleware} = require('../middleware/sessionJwt.js')
const {validatorCreateItem, validatorUpdateItem} = require('../validators/project.js')
const {createItem, updateItem, getUserProjects} = require('../controllers/project.js')

app.use('/practica/project', projectRouter)

projectRouter.post('/', authMiddleware, validatorCreateItem, createItem)

projectRouter.patch('/:id', authMiddleware, validatorUpdateItem, updateItem)

projectRouter.get('/', authMiddleware, getUserProjects)

module.exports = projectRouter