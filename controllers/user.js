const UserModel = require('../models/user.js')
const {matchedData} = require('express-validator')
const {encrypt, compare} = require('../utils/handlePassword.js')
const crypto = require('crypto')
const { sendEmail } = require('../utils/handleEmail.js')
const { tokenSign } = require("../utils/handleJwt.js")
const {uploadToPinata} = require("../utils/handleUploadIPFS.js")

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
        
        const emailOptions = {
            'subject': "Validación de email",
            'text': `Vuelve a la página e introduce el código para validar tu email en la aplicación ${body.code_validation}`,
            'to': body.email,
            'from': process.env.EMAIL
        }
        sendEmail(emailOptions)
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
    code = matchedData(req)
    
    if(req.user.intentos != 0){
        if(code.code != req.user.code_validation){
            const user = await UserModel.findByIdAndUpdate(req.user._id, {intentos: req.user.intentos - 1})
            res.status(401).send("ERROR_CODE_VALIDATION")
        }
        else{
            const user = await UserModel.findByIdAndUpdate(req.user._id, {validado: true, intentos: 3})
            
            res.status(200).send(user)
        }
    }
    else{
        const user = await UserModel.findByIdAndUpdate(req.user._id, {bloqueado: true})
        res.status(404).send("El usuario ha sido bloqueado por excederse en número de intentos. Si desea desbloquearlo póngase en contacto con nosotros.")
    }
}

const login = async (req, res) => {
    
    const body = matchedData(req)
    const user = await UserModel.findOne({email: body.email})
    
    if(user == null){
        res.status(404).send("ERROR_USER_NOT_FOUND")
    }
    else{
        if(user.intentos == 0){
            const userBloqueado = await UserModel.findByIdAndUpdate(user._id, {bloqueado: true})
            res.status(404).send("El usuario ha sido bloqueado por excederse en número de intentos. Si desea desbloquearlo póngase en contacto con nosotros.")
        }
        else{
            if(!user.validado){
                res.status(403).send("Por favor, valida el email para poder acceder")
            }
            else{
                const passwordMatch = await compare(body.password, user.password)
                if(!passwordMatch){
                    const userFallido = await UserModel.findOneAndUpdate({email: body.email}, {intentos: user.intentos - 1})
                    res.status(404).send("ERROR_INCORRECT_DATA")
                }
                else{
                    const userAcertado = await UserModel.findOneAndUpdate({email: body.email}, {intentos: 3})
                    const data = {
                        token: await tokenSign(userAcertado),
                        user: userAcertado
                    }
                    res.status(200).send(data)
                }
            }
            
        }
        
    }
    
}

const uploadImage = async (req, res) => {
    try {
        const id = req.params.id
        console.log(id)
        console.log(process.env.PINATA_GATEWAY_URL)
        const fileBuffer = req.file.buffer
        const fileName = req.file.originalname
        const pinataResponse = await uploadToPinata(fileBuffer, fileName)
        const ipfsFile = pinataResponse.IpfsHash
        const ipfs = `https://${process.env.PINATA_GATEWAY_URL}/ipfs/${ipfsFile}`
        
        const data = await UserModel.findByIdAndUpdate({_id: id}, {url: ipfs})
        res.send(data)
    } catch (err) {
        console.log(err)
        res.status(500).send("ERROR_UPLOAD_COMPANY_IMAGE")
        //handleHttpError(res, "ERROR_UPLOAD_COMPANY_IMAGE")
    }
}

module.exports = {createItem, validationEmail, login, uploadImage}