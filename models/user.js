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
            type: ["user", "admin"],
            default: "user"
        },
        code_validation: String,
        validado: Boolean,
        intentos: Number,
        bloqueado: Boolean,
        url: String,
        fullname: String,
        nif: String
    },
    {
        timestamps: true,
        versionKey: false
    }
)

module.exports = mongoose.model("users", UserScheme)