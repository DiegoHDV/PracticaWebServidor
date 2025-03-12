const express = require('express')
const router = express.Router()
const fs = require('fs')
const removeExtension = (filename) => {
    // Solo la primera parte del split (lo de antes del punto)
    return filename.split('.').shift()
}

fs.readdirSync(__dirname).filter((file) => {
    const name = removeExtension(file) // index, user, storage, tracks
    if(name !== 'index'){
        router.use('/' + name, require('./'+name)) // http://localhost:3000/api/tracks
    }
})

module.exports = router