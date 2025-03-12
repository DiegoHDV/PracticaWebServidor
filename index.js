const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()

app.use(express.json())
app.use(cors())

const router = require('./routes')
app.use('/practica', router)

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log("Servidor escuchando en el puerto: ", port)
})

