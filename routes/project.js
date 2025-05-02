const express = require('express')
const projectRouter = express.Router()
const app = express()
const {authMiddleware} = require('../middleware/sessionJwt.js')
const {validatorCreateItem} = require('../validators/project.js')
const {createItem} = require('../controllers/project.js')

app.use('/practica/project', projectRouter)

projectRouter.post('/', authMiddleware, validatorCreateItem, createItem)

module.exports = projectRouter