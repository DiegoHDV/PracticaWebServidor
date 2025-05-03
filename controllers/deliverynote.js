const DeliverynoteModel = require('../models/deliverynote.js')
const { matchedData } = require('express-validator')

const createItem = async (req, res) => {
    const body = matchedData(req)
    body.userId = req.user._id.toString()
    const data = await DeliverynoteModel.create(body)
    res.send(data)
}

module.exports = {
    createItem
}