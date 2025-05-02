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

const getUserProjects = async (req, res) => {
    const userProjects = await ProjectModel.find({userId: req.user._id})
    res.status(200).send(userProjects)
}

const getProject = async (req, res) => {
    const projects = await ProjectModel.find({userId: req.user._id})
    const exists = projects.some(project => project._id.toString() === req.params.id)
    if(!exists){
        res.status(404).send("ERROR PROJECT NOT FOUND")
    }
    else{
        const client = await ProjectModel.findById(req.params.id)
        res.status(200).send(client)
    }
}

const deleteProject = async (req, res) => {
    const body = matchedData(req)
    
    const projects = await ProjectModel.find({userId: req.user._id})
    const exists = projects.some(project => project.projectCode === body.projectCode)

    if(!exists){
        res.status(404).send("ERROR PROJECT NOT FOUND")
    }
    else{
        const project = await ProjectModel.findOne({cif: body.cif})
        if (body.soft) {
            const data = await ProjectModel.delete({_id: project._id})
            res.status(200).send(data)
        }
        else {
            const data = await ProjectModel.findByIdAndDelete(project._id)
            res.status(200).send("Proyecto borrado correctamente")
        }
    }
}

const restoreProject = async (req, res) => {
    try{
        const data = await ProjectModel.restore({_id: req.params.id})
        if(data.modifiedCount === 0){
            res.status(404).send("ERROR PROJECT NOT FOUND")
        }
        else{
            res.status(200).send(data)
        }        
    }catch(err){
        if(req.params.id.length !== 24){
            res.status(404).send("ERROR PROJECT NOT FOUND")
        }
    }
}

module.exports = {
    createItem,
    updateItem,
    getUserProjects,
    getProject,
    deleteProject,
    restoreProject
}