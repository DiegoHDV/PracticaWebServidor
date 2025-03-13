const UserModel = require('../models/user.js')
const {matchedData} = require('express-validator')

const createItem = async (req, res) => {
    try{
        console.log("------------------------")
        console.log(req.body)
        console.log("------------------------")
        body = matchedData(req)
        console.log(body)
        console.log("------------------------")
        const result = await UserModel.create(body)
        res.status(201).send(result)
        console.log("------------------------")
    } catch(err){
        if(err == 11000){
            res.status(409).send("ERROR_EMAIL_ALREADY_EXISTS")
        }
        else{
            console.log(err)
            res.status(500).send("Internal server error")
        }
    }
}

module.exports = {createItem}