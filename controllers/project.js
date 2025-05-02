const ProjectModel = require('../models/project.js')
const ClientModel = require('../models/client.js')
const { matchedData } = require('express-validator')

const createItem = async (req, res) => {
    const body = matchedData(req)
    const projects = await ProjectModel.find({userId: req.user._id})
    const exists = projects.some(project => project.projectCode === body.projectCode)
    if(exists){
        res.status(401).send("ERROR PROJECT ALREADY EXISTS")
    }
    else{
        const client = await ClientModel.findById(body.clientId)
        if(client === null || client.userId !== req.user._id.toString()){
            res.status(404).send("ERROR CLIENT NOT FOUND")
        }
        else{
            const newProject = body
            newProject.userId = req.user._id
            const data = await ProjectModel.create(newProject)
            res.status(201).send(data)
        }
    }
}

const updateItem = async (req, res) => {
    const body = matchedData(req)
    const projects = await ProjectModel.find({userId: req.user._id})
    const exists = projects.some(project => project._id.toString() === req.params.id)
    if(!exists){
        res.status(404).send("ERROR PROJECT NOT FOUND")
    }
    else{
        const project = await ProjectModel.findByIdAndUpdate(req.params.id, body)
        res.status(200).send(project)
    }
}

module.exports = {
    createItem,
    updateItem
}