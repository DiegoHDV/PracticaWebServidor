const DeliverynoteModel = require('../models/deliverynote.js')
const { matchedData } = require('express-validator')
const ClientModel = require('../models/client.js')
const ProjectModel = require('../models/project.js')

const createItem = async (req, res) => {
    const body = matchedData(req)
    body.userId = req.user._id.toString()
    // Sacamos los usuarios del cliente
    const clients = await ClientModel.find({userId: body.userId})
    const clientExists = clients.some((client) => client._id.toString() === body.clientId)
    // Si no existe ningún cliente con ese id
    if(!clientExists){
        res.status(404).send("ERROR CLIENT NOT FOUND")
    }
    else{
        // En caso de existir el cliente
        // Sacamos los pryectos del usuario
        const projects = await ProjectModel.find({userId: body.userId})
        const projectExists = projects.some((project) => project.clientId === body.clientId && project._id.toString() === body.projectId)
        // Si no existe ningún proyecto con ese id ni con ese clientId
        if(!projectExists){
            res.status(404).send("ERROR PROJECT NOT FOUND")
        }
        else{
            // En caso de existir, creamos el albarán
            const data = await DeliverynoteModel.create(body)
            res.status(201).send(data)
        }
    }
    
}

const getDeliverynotes = async (req, res) => {
    const userDeliverynotes = await DeliverynoteModel.find({userId: req.user._id})
    res.status(200).send(userDeliverynotes)
}

module.exports = {
    createItem,
    getDeliverynotes
}