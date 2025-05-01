const mongoose = require('mongoose')
const ClientScheme = new mongoose.Schema(
    {
        userId: String,
        name: String,
        cif: String,
        address: String,
        logo: String
    },
    {
        timestamps: true,
        versionKey: false
    }
)

module.exports = mongoose.model("clients", ClientScheme)