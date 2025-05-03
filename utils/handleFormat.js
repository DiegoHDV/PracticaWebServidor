const {handleHttpError} = require('./handleError.js')

const keys = ["description", "quantity"]

const incorrectData = (any) => {
    
    var invalidKeys
    for (item of any){
        invalidKeys = Object.keys(item).filter((key) => !keys.includes(key))
    }
    return invalidKeys.length
}

const allData = (any) => {
    var all_data
    for(item of any){
        const item_keys = Object.keys(item)
        all_data = keys.every((key) => item_keys.includes(key))
        if(!all_data){
            return all_data
        }
    }
    return all_data
}

const verifyFormat = async (req, res, next) => {
    
    const {format, hours, material} = req.body
    console.log("Format")
    console.log(format)
    if(format === "hours"){
        console.log("------------------------")
        console.log("Hours")
        console.log(Array.isArray(hours))
        console.log(hours)
        console.log(material == null)
        if(Array.isArray(hours) && hours.length !== 0 && material == null){
            if(incorrectData(hours) > 0){
                handleHttpError(res, "INVALID DATA", 401)
                return
            }
            if(!allData(hours)){
                handleHttpError(res, "ERROR FORBIDDEN", 403)
                return
            }
            next()
        }
        else{
            handleHttpError(res, "ERROR FORBIDDEN", 403)
            return
        }
    }
    else if(format === "material"){
        console.log("------------------------")
        console.log("Material")
        console.log(Array.isArray(material))
        console.log(material)
        if(Array.isArray(material) && material.length !== 0 && hours == null){
            if(incorrectData(material) > 0){
                handleHttpError(res, "INVALID DATA", 401)
                return
            }
            if(!allData(material)){
                handleHttpError(res, "ERROR FORBIDDEN", 403)
                return
            }
            next()
        }
        else{
            handleHttpError(res, "ERROR FORBIDDEN", 403)
            return
        }
    }
    else{
        console.log("------------------------")
        console.log("Hours")
        console.log(Array.isArray(hours))
        console.log(hours)
        console.log("------------------------")
        console.log("Material")
        console.log(Array.isArray(material))
        console.log(material)
        if((Array.isArray(hours) && hours.length !== 0) && (Array.isArray(material) && material.length !== 0)){
            if(incorrectData(hours) > 0 || incorrectData(material) > 0){
                handleHttpError(res, "INVALID DATA", 401)
                return
            }
            if(!allData(hours) || !allData(material)){
                handleHttpError(res, "ERROR FORBIDDEN", 403)
                return
            }
            next()
        }
        else if(Array.isArray(hours) && hours.length !== 0){
            if(incorrectData(hours) > 0){
                handleHttpError(res, "INVALID DATA", 401)
                return
            }
            if(!allData(hours)){
                handleHttpError(res, "ERROR FORBIDDEN", 403)
                return
            }
            next()
        }
        else if(Array.isArray(material) && material.length !== 0){
            if(incorrectData(material) > 0){
                handleHttpError(res, "INVALID DATA", 401)
                return
            }
            if(!allData(material)){
                handleHttpError(res, "ERROR FORBIDDEN", 403)
                return
            }
            next()
        }
        next()
    }
}



module.exports ={
    verifyFormat
}