const UserModel = require('../models/user.js')
const {matchedData} = require('express-validator')
const {encrypt} = require('../utils/handlePassword.js')
const crypto = require('crypto')
const { sendEmail } = require('../utils/handleEmail.js')
const { tokenSign } = require("../utils/handleJwt.js")

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

        const data = {
            token: await tokenSign(result),
            user: result
        }
        /*
        const emailOptions = {
            'subject': "Validación de email",
            'text': `Vuelve a la página e introduce el código para validar tu email en la aplicación ${body.code_validation}`,
            'to': body.email,
            'from': process.env.EMAIL
        }
        sendEmail(emailOptions)*/
        res.status(201).send(data)
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

const validationEmail = async (req, res) => {
    const body = req.body
    console.log(body)
    res.send(body)
}

module.exports = {createItem, validationEmail}