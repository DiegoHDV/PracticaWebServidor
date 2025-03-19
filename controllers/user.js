const UserModel = require('../models/user.js')
const {matchedData} = require('express-validator')
const {encrypt} = require('../utils/handlePassword.js')
const crypto = require('crypto')

const createItem = async (req, res) => {
    try{
        req = matchedData(req)
        console.log(req)
        console.log("------------------------")
        password = await encrypt(req.password)
        code_validation = crypto.randomBytes(3).toString('hex')
        validado = false
        intentos = process.env.NUM_INTENTOS
        bloqueado = false
        body = {...req, password, code_validation, validado, intentos, bloqueado}
        console.log(body)
        const result = await UserModel.create(body)
        res.status(201).send(result)
        console.log("------------------------")
    } catch(err){
        if(err.code == 11000){
            res.status(409).send("ERROR_EMAIL_ALREADY_EXISTS")
        }
        else{
            console.log(err)
            res.status(500).send("Internal server error")
        }
    }
}

module.exports = {createItem}