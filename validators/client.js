const {check} = require('express-validator')
const validateResults = require("../utils/handleValidator.js")

const validatorCreateItem = [
    check("name").exists().notEmpty(),
    check("cif").exists().notEmpty().isLength({min:9, max:9}),
    check("address").exists().notEmpty(),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
]

const validatorUpdateItem = [
    check("name").optional().notEmpty(),
    check("cif").optional().notEmpty().isLength({min:9, max:9}),
    check("address").optional().notEmpty(),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
]

module.exports = {
    validatorCreateItem,
    validatorUpdateItem
}