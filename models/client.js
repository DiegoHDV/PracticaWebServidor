const mongoose = require('mongoose')
const mongooseDelete = require('mongoose-delete')

const ClientScheme = new mongoose.Schema(
    {
        userId: String,
        name: String,
        cif: String,
        address: String,
        logo: String,
        deleted: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

ClientScheme.plugin(mongooseDelete, { deletedAt: true, overrideMethods: 'all' });

module.exports = mongoose.model("clients", ClientScheme)