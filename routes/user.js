const express = require('express')
const userRouter = express.Router()
const app = express()

app.use('/practica/user', userRouter)

userRouter.get('/', (req, res) => {
    res.send("Funciona")
})

module.exports = userRouter