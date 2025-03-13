const express = require('express')
const userRouter = express.Router()
const app = express()
const {createItem} = require('../controllers/user.js')
const {validatorCreateItem} = require('../validators/user.js')

app.use('/practica/user', userRouter)

userRouter.get('/', (req, res) => {
    res.send("Funciona")
})

userRouter.post('/register', validatorCreateItem, createItem)


module.exports = userRouter