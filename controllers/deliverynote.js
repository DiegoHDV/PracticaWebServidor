const DeliverynoteModel = require('../models/deliverynote.js')
const { matchedData } = require('express-validator')
const ClientModel = require('../models/client.js')
const ProjectModel = require('../models/project.js')
const PDFDocument = require('pdfkit')
const { uploadToPinata } = require("../utils/handleUploadIPFS.js")

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

const getOneDeliverynote = async (req, res) => {
    const id = req.params.id
    const data = await DeliverynoteModel.findById(id)
        .populate('userId')
        .populate('clientId')
        .populate('projectId')
    if(data == null){
        res.status(404).send("ERROR DELIVERYNOTE NOT FOUND")
    }
    else{
        res.status(200).send(data)
    }
    
}

const getPDF = async (req, res) => {
    const id = req.params.id
    
    const deliverynote = await DeliverynoteModel.findById(id)
        .populate('userId')
        .populate('clientId')
        .populate('projectId')

    if(deliverynote == null){
        res.status(404).send("ERROR DELIVERYNOTE NOT FOUND")
    }
    else{
        res.setHeader('Content-Disposition', `attachment; filename=deliverynote_${id}.pdf`)
        res.setHeader('Content-Type', 'application/pdf')
        const doc = new PDFDocument()
        const buffer = []
        doc.on('data', buff => buffer.push(buff))
        doc.pipe(res)
        doc.text(`Productor: ${deliverynote.userId.name}`)
        doc.text(`Cliente: ${deliverynote.clientId.name}; CIF: ${deliverynote.clientId.cif}`)
        doc.text(`Proyecto: ${deliverynote.projectId.name}; Dirección: ${deliverynote.projectId.address}`)
        doc.text(`Formato: ${deliverynote.format}`)
        if(deliverynote.hours.length !== 0){
            doc.text('Horas:')
            for(item of deliverynote.hours){
                doc.text(`${item.description}: ${item.quantity}`)
            }
        }
        if(deliverynote.material.length !== 0){
            doc.text('Materiales:')
            for(item of deliverynote.material){
                doc.text(`${item.description}: ${item.quantity}`)
            }
        }
        if(deliverynote.sign != null){
            doc.text("Firma: ")
        }
        doc.on('end', async () => {
            const bufferPDF = Buffer.concat(buffer)
            try {
                const pinataResponse = await uploadToPinata(bufferPDF, `deliverynote_${deliverynote._id.toString()}.pdf`)
                const ipfsFile = pinataResponse.IpfsHash
                const ipfs = `https://${process.env.PINATA_GATEWAY_URL}/ipfs/${ipfsFile}`
                const data = await DeliverynoteModel.findByIdAndUpdate({ _id: id }, { pdf: ipfs })
                console.log(data)
            } catch (err) {
                console.log(err)
            }
        })
        doc.end()
    }
}

const firmarDeliverynote = async (req, res) => {
    const id = req.params.id
    const deliverynote = await DeliverynoteModel.findById(id)

    if(deliverynote == null){
        res.status(404).send("ERROR DELIVERYNOTE NOT FOUND")
    }
    else{
        try {
            const fileBuffer = req.file.buffer
            const fileName = req.file.originalname
            const pinataResponse = await uploadToPinata(fileBuffer, fileName)
            const ipfsFile = pinataResponse.IpfsHash
            const ipfs = `https://${process.env.PINATA_GATEWAY_URL}/ipfs/${ipfsFile}`
    
            const data = await DeliverynoteModel.findByIdAndUpdate({ _id: id }, { sign: ipfs })
            res.send(data)
        } catch (err) {
            console.log(err)
            res.status(500).send("ERROR_UPLOAD_COMPANY_IMAGE")
        }
    }
}

module.exports = {
    createItem,
    getDeliverynotes,
    getOneDeliverynote,
    getPDF,
    firmarDeliverynote
}