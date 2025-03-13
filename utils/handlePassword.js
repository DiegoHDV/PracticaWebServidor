const bcryptjs = require('bcryptjs')

const encrypt = async (clearPassword) => {
    const hash = await bcryptjs.hash(clearPassword, 10)
    return hash
}

module.exports = {encrypt}