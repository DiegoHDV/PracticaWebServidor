const {check} = require('express-validator')
const validateResults = require("../utils/handleValidator.js")

const validatorCreateItem = [
    check("clientId").exists().notEmpty().isMongoId(),
    check("projectId").exists().notEmpty().isMongoId(),
    check("name").exists().notEmpty(),
    check("description").optional(),
    check("format").exists().notEmpty().isIn(["hours", "material", "any"]),
    check("hours").optional().isArray(),
    check("material").optional().isArray(),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
]

module.exports = {
    validatorCreateItem
}