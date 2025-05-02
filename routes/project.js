const express = require('express')
const projectRouter = express.Router()
const app = express()
const {authMiddleware} = require('../middleware/sessionJwt.js')
const {validatorCreateItem, validatorUpdateItem, validatorDeleteProject} = require('../validators/project.js')
const {createItem, updateItem, getUserProjects, getProject, deleteProject} = require('../controllers/project.js')

app.use('/practica/project', projectRouter)

projectRouter.post('/', authMiddleware, validatorCreateItem, createItem)

projectRouter.patch('/:id', authMiddleware, validatorUpdateItem, updateItem)

projectRouter.get('/', authMiddleware, getUserProjects)

projectRouter.get('/:id', authMiddleware, getProject)

projectRouter.delete('/deleteProject', authMiddleware, validatorDeleteProject, deleteProject)

module.exports = projectRouter