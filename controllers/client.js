const { readerrevenuesubscriptionlinking } = require('googleapis/build/src/apis/readerrevenuesubscriptionlinking/index.js')
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
        try{
            const newClient = body
            newClient.userId = req.user._id
            const data = await ClientModel.create(newClient)
            res.status(201).send(data)
        }catch(err){
            res.status(405).send("ERROR CLIENT ALREADY EXISTS")
        }
        
    }
}

const updateItem = async (req, res) => {
    const body = matchedData(req)
    const clients = await ClientModel.find({userId: req.user._id})
    const exists = clients.some(client => client._id.toString() === req.params.id)
    if(!exists){
        res.status(404).send("ERROR CLIENT NOT FOUND")
    }
    else{
        const client = await ClientModel.findByIdAndUpdate(req.params.id, body)
        res.status(200).send(client)
    }
    
}

const getUserClients = async (req, res) => {
    const userClients = await ClientModel.find({userId: req.user._id})
    res.status(200).send(userClients)
}

const getClient = async (req, res) => {
    const clients = await ClientModel.find({userId: req.user._id})
    const exists = clients.some(client => client._id.toString() === req.params.id)
    if(!exists){
        res.status(404).send("ERROR CLIENT NOT FOUND")
    }
    else{
        const client = await ClientModel.findById(req.params.id)
        res.status(200).send(client)
    }
}

const deleteClient = async (req, res) => {
    const body = matchedData(req)
    
    const clients = await ClientModel.find({userId: req.user._id})
    const exists = clients.some(client => client.cif === body.cif)

    if(!exists){
        res.status(404).send("ERROR CLIENT NOT FOUND")
    }
    else{
        const client = await ClientModel.findOne({cif: body.cif})
        if (body.soft) {
            const data = await ClientModel.delete({_id: client._id})
            res.status(200).send(data)
        }
        else {
            const data = await ClientModel.findByIdAndDelete(client._id)
            res.status(200).send("Usuario borrado correctamente")
        }
    }
}

const restoreClient = async (req, res) => {
    const data = await ClientModel.restore({_id: req.params.id})
    if(!data.modifiedCount){
        res.status(404).send("ERROR CLIENT NOT FOUND")
    }
    else{
        res.status(200).send(data)
    }
    
}

module.exports = {
    createItem,
    updateItem,
    getUserClients,
    getClient,
    deleteClient,
    restoreClient
}