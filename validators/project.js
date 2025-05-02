const {check} = require('express-validator')
const validateResults = require("../utils/handleValidator.js")

const validatorCreateItem = [
    check("name").exists().notEmpty(),
    check("projectCode").exists().notEmpty().isLength(),
    check("address").exists().notEmpty(),
    check("clientId").exists().notEmpty().isLength({min: 24, max: 24}),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
]

const validatorUpdateItem = [
    check("name").optional().notEmpty(),
    check("address").optional().notEmpty(),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
]

const validatorDeleteProject = [
    check("projectCode").exists().notEmpty(),
    check("soft").exists().notEmpty().toBoolean(),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
]

module.exports = {
    validatorCreateItem,
    validatorUpdateItem,
    validatorDeleteProject
}