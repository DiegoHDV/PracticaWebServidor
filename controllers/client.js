const ClientModel = require('../models/client.js')
const { matchedData } = require('express-validator')

const createItem = async (req, res) => {
    const body = matchedData(req)
    const clients = await ClientModel.find({userId: req.user._id})
    const exists = clients.some(client => client.cif === body.cif)
    if(exists){
        res.status(401).send("ERROR CLIENT ALREADY EXISTS")
    }
    else{
        const newClient = body
        newClient.userId = req.user._id
        const data = await ClientModel.create(newClient)
        res.status(201).send(data)
    }
}

const updateItem = async (req, res) => {
    const body = matchedData(req)
    const clients = await ClientModel.find({userId: req.user._id})
    const exists = clients.some(client => client._id.toString() === req.params.id)
    if(!exists){
        res.status(404).status("ERROR CLIENT NOT FOUND")
    }
    else{
        const client = await ClientModel.findByIdAndUpdate(req.params.id, body)
        res.status(200).send(client)
    }
    
}

module.exports = {
    createItem,
    updateItem
}