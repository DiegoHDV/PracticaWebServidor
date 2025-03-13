const {check} = require('express-validator')
const validateResults = require("../utils/handleValidator.js")

const validatorCreateItem = [
    check("name").exists().notEmpty(),
    check("email").exists().notEmpty().isEmail(),
    check("password").exists().notEmpty().isLength( {min:8, max: 16} ),
    check("age").exists().isNumeric(),
    check("role").optional(),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
]



module.exports = {validatorCreateItem}