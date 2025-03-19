const {verifyToken } = require('../utils/handleJwt.js')
const UserModel = require('../models/user.js')
const {handleHttpError} = require('../utils/handleError.js')

const authMiddleware = async (req, res, next) => {
    try{
        if(!req.headers.authorization){
            handleHttpError(res, "NOT_TOKEN", 401)
            return
        }
        const token = req.headers.authorization.split(' ').pop()
        const dataToken = await verifyToken(token)
        if(!dataToken._id){
            handleHttpError(res, "ERROR_ID_TOKEN", 401)
            return
        }
        const user = await UserModel.findById(dataToken._id)
        req.user = user
        next()
    } catch(err){
        handleHttpError(res, "NOT_SESSION", 401)
    }
}

module.exports = {authMiddleware}