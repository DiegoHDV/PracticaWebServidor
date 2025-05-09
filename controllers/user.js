const UserModel = require('../models/user.js')
const { matchedData } = require('express-validator')
const { encrypt, compare } = require('../utils/handlePassword.js')
const crypto = require('crypto')
const { sendEmail } = require('../utils/handleEmail.js')
const { tokenSign } = require("../utils/handleJwt.js")
const { uploadToPinata } = require("../utils/handleUploadIPFS.js")

const createItem = async (req, res) => {
    try {
        req = matchedData(req)
        //console.log(req)
        //console.log("------------------------")
        password = await encrypt(req.password)
        code_validation = crypto.randomBytes(3).toString('hex')
        validado = false
        intentos = process.env.NUM_INTENTOS
        bloqueado = false
        autonomo = true
        verificate = false
        body = { ...req, password, code_validation, validado, intentos, bloqueado, autonomo, verificate }
        //console.log(body)
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
        //console.log("------------------------")
    } catch (err) {
        if (err.code == 11000) {
            res.status(409).send("ERROR_EMAIL_ALREADY_EXISTS")
        }
        else {
            //console.log(err)
            res.status(500).send("Internal server error")
        }
    }
}

const validationEmail = async (req, res) => {
    code = matchedData(req)
    if(!req.user.validado){
        if (req.user.intentos != 0) {
            if (code.code != req.user.code_validation) {
                const user = await UserModel.findByIdAndUpdate(req.user._id, { intentos: req.user.intentos - 1 })
                res.status(401).send("ERROR_CODE_VALIDATION")
            }
            else {
                const user = await UserModel.findByIdAndUpdate(req.user._id, { validado: true, intentos: 3 })

                res.status(200).send(user)
            }
        }
        else {
            const user = await UserModel.findByIdAndUpdate(req.user._id, { bloqueado: true })
            res.status(404).send("El usuario ha sido bloqueado por excederse en número de intentos. Si desea desbloquearlo póngase en contacto con nosotros.")
        }
    }
    else{
        res.status(401).send("ERROR_USER_ALREADY_VALIDATED")
    }
    
}

const login = async (req, res) => {

    const body = matchedData(req)
    const user = await UserModel.findOne({ email: body.email })

    if (user == null) {
        res.status(404).send("ERROR_USER_NOT_FOUND")
    }
    else {
        if (user.intentos == 0) {
            const userBloqueado = await UserModel.findByIdAndUpdate(user._id, { bloqueado: true })
            res.status(404).send("El usuario ha sido bloqueado por excederse en número de intentos. Si desea desbloquearlo póngase en contacto con nosotros.")
        }
        else {
            if (!user.validado) {
                res.status(403).send("Por favor, valida el email para poder acceder")
            }
            else {
                const passwordMatch = await compare(body.password, user.password)
                if (!passwordMatch) {
                    const userFallido = await UserModel.findOneAndUpdate({ email: body.email }, { intentos: user.intentos - 1 })
                    res.status(402).send("ERROR_INCORRECT_DATA")
                }
                else {
                    const userAcertado = await UserModel.findOneAndUpdate({ email: body.email }, { intentos: 3 })
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
    if(req.user == null){
        res.status(404).send("ERROR_USER_NOT_FOUND")
    }
    else{
        try {
            const id = req.user._id
            const fileBuffer = req.file.buffer
            const fileName = req.file.originalname
            const pinataResponse = await uploadToPinata(fileBuffer, fileName)
            const ipfsFile = pinataResponse.IpfsHash
            const ipfs = `https://${process.env.PINATA_GATEWAY_URL}/ipfs/${ipfsFile}`

            const data = await UserModel.findByIdAndUpdate({ _id: id }, { url: ipfs })
            res.send(data)
        } catch (err) {
            console.log(err)
            res.status(500).send("ERROR_UPLOAD_COMPANY_IMAGE")
        }
    }
}

const uploadPersonalData = async (req, res) => {
    const personalData = matchedData(req)
    if(req.user == null){
        res.status(404).send("ERROR_USER_NOT_FOUND")
    }
    else{
         let user = { ...req.user._doc, name2: personalData.name2, fullname: personalData.fullname, nif: personalData.nif }

        if (user.autonomo) {

            user = { ...user, company: { name: personalData.name2, cif: personalData.nif } }

        }
        console.log(user)
        const data = await UserModel.findOneAndReplace(req.user, user, { returnDocument: 'after' })
        res.status(200).send(data)
    }
   
}

const uploadCompanyData = async (req, res) => {
    const company = matchedData(req)
    if(req.user == null){
        res.status(404).send("ERROR_USER_NOT_FOUND")
    }
    else{
        const user = { ...req.user._doc, company, autonomo: false }
        const data = await UserModel.findOneAndReplace(req.user, user, { returnDocument: 'after' })
        res.status(200).send(data)
    }
    
}

const getUser = async (req, res) => {
    
    if(req.user == null){
        res.status(404).send("ERROR_USER_NOT_FOUND")
    }
    else{
        const user = req.user
        res.status(200).send(user)
    }
    
}

const deleteUser = async (req, res) => {
    const soft = matchedData(req).soft

    if(req.user == null){
        res.status(404).send("ERROR_USER_NOT_FOUND")
    }
    else{
        const user = req.user
        if (soft) {
            const data = await UserModel.delete({_id: user._id})
            res.status(200).send(data)
        }
        else {
            await UserModel.findByIdAndDelete(user._id)
            res.status(200).send("Usuario borrado correctamente")
        }
    }
    

}

const verificationEmailCode = async (req, res) => {
    const email = matchedData(req).email
    const user = await UserModel.findOne({email: email})
    
    if(user == null){
        res.status(404).send("ERROR_USER_NOT_FOUND")
    }
    else{
        const code_verification = crypto.randomBytes(3).toString('hex')
        const userModified = await UserModel.findOneAndUpdate(user._id, { code_verification: code_verification })
        const data = {
            token: await tokenSign(userModified),
            user: userModified
        }
        const emailOptions = {
            'subject': "Recuperar contraseña",
            'text': `Vuelve a la página e introduce el código para poder recuperar la contraseña: ${code_verification}`,
            'to': user.email,
            'from': process.env.EMAIL
        }
        sendEmail(emailOptions)

        res.status(200).send(data)
    }  
}

const verifyVerificationCode = async (req, res) => {
    const body = matchedData(req)
    if(req.user == null){
        res.status(404).send("ERROR_USER_NOT_FOUND")
    }
    else{
        const user = await UserModel.findOne({ email: body.email })
        if (user == null) {
            res.status(404).send("ERROR_USER_NOT_FOUND")
        }
        else {
            console.log(req.user)
            if (user.email !== req.user.email) {
                res.status(401).send("ERROR_NO_MATCHING_EMAILS")
            }
            else {
                if (user.code_verification !== body.code_verification) {
                    res.status(401).send("ERROR_INVALID_VERIFICATION_CODE")
                }
                else {
                    const data = await UserModel.findByIdAndUpdate(user._id, { verificate: true }, { returnDocument: 'after' })
                    
                    res.status(200).send(data)
                }
            }
        }
    }
    
}

const updatePassword = async (req, res) => {
    const body = matchedData(req)
    if(req.user == null){
        res.status(404).send("ERROR_USER_NOT_FOUND")
    }
    else{
        const user = req.user
        if (!user.verificate) {
            res.status(401).send("ERROR_USER_NOT_VERIFICATED")
        }
        else {
            password = await encrypt(body.password)
            const data = await UserModel.findByIdAndUpdate(user._id, {password: password, verificate: false})
            res.status(200).send(data)
        }   
    }
    
}

const invitePartners = async (req, res) => {
    const partners = matchedData(req).partners
    if(req.user == null){
        res.status(404).send("ERROR_USER_NOT_FOUND")
    }
    else{
        console.log(partners)
        const company = req.user.company
        const invitados = []
        for(email of partners){
            const invitado = await UserModel.findOne({email: email})
            if(invitado === null){
                const user = {
                    name: "invitado",
                    age: 0,
                    email: email,
                    password: await encrypt("12345678"),
                    role: ['guest'],
                    code_validation: crypto.randomBytes(3).toString('hex'),
                    validado: false,
                    intentos: process.env.NUM_INTENTOS,
                    bloqueado: false,
                    autonomo: true,
                    company: company,
                    deleted: false,
                    verificate: false
                }
                const data = await UserModel.create(user)
                invitados.push(data)
            }
            else{
                invitados.push(`ACCOUNT_ALREADY_EXISTS: ${email}`)
            }
        }
        res.status(200).send(invitados)
    }
    
}

module.exports = {
    createItem,
    validationEmail,
    login,
    uploadImage,
    uploadPersonalData,
    uploadCompanyData,
    getUser,
    deleteUser,
    verificationEmailCode,
    verifyVerificationCode,
    updatePassword,
    invitePartners
}