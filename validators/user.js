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

const validatorCode = [
    check("code").exists().notEmpty().isLength({min:6, max:6}),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
]

const validatorLogin = [
    check("email").exists().notEmpty().isEmail(),
    check("password").exists().notEmpty().isLength( {min:8, max: 16} ),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
]

const validatorPersonalData = [
    check("name2").exists().notEmpty(),
    check("fullname").exists().notEmpty(),
    check("nif").exists().notEmpty().isLength({min:9, max:9}),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
]

const validatorCompany = [
    check("name").exists().notEmpty(),
    check("cif").exists().notEmpty().isLength({min:9, max:9}),
    check("address").exists().notEmpty(),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
]

const validatorDeleteUser = [
    check("soft").exists().notEmpty().toBoolean(),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
]

const validatorVerificationCode = [
    check("email").exists().notEmpty().isEmail(),
    check("code_verification").exists().notEmpty().isLength({min:6, max:6}),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
]

module.exports = {validatorCreateItem, 
    validatorCode, 
    validatorLogin, 
    validatorPersonalData, 
    validatorCompany, 
    validatorDeleteUser, 
    validatorVerificationCode}