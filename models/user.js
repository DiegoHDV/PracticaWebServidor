const mongoose = require('mongoose')
const UserScheme = new mongoose.Schema(
    {
        name: String,
        age: Number,
        email: {
            type: String,
            unique: true
        },
        password: String,
        role: {
            type: ["user", "admin", "guest"],
            default: "user"
        },
        code_validation: String,
        validado: Boolean,
        intentos: Number,
        bloqueado: Boolean,
        url: String,
        name2: String,
        fullname: String,
        nif: String,
        autonomo: Boolean,
        company: {
            name: String,
            cif: String,
            address: String
        },
        deleted: Boolean,
        code_verification: String,
        verificate: Boolean
    },
    {
        timestamps: true,
        versionKey: false
    }
)

module.exports = mongoose.model("users", UserScheme)