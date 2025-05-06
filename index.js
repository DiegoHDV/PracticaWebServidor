const express = require('express')
const cors = require('cors')
const morganBody = require("morgan-body")
require('dotenv').config()
const loggerStream = require("./utils/handleLogger.js")

const app = express()

morganBody(app, {
    noColors: true,
    skip: function (req, res) {
        return res.statusCode < 500
    },
    stream: loggerStream
})

app.use(express.json())
app.use(cors())

const router = require('./routes')
app.use('/practica', router)

const port = process.env.PORT || 3000
const server = app.listen(port, () => {
    console.log("Servidor escuchando en el puerto: ", port)
})

const dbConnect = require('./config/mongo.js')
dbConnect()

module.exports = {app, server}