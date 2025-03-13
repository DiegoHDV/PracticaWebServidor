const mongoose = require('mongoose')

const dbConnect = () => {
    const db_uri = process.env.DB_URI
    mongoose.set('strictQuery', false)
    try{
        mongoose.connect(db_uri)
    }catch{
        console.error("Error al conectarse a la base de datos")
    }
    // Listen events
    mongoose.connection.on("connected", () => console.log("Conectado a la base de datos"))
}

module.exports = dbConnect