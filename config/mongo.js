const mongoose = require('mongoose')
const db_uri = process.env.NODE_ENV === 'test' ? process.env.DB_URI : process.env.DB_URI_TEST
/*
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
}*/
const dbConnect = () => {
    mongoose.set('strictQuery', false)
    mongoose.connect(db_uri)
}

module.exports = dbConnect