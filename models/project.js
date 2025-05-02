const mongoose = require('mongoose')
const mongooseDelete = require('mongoose-delete')

const ProjectScheme = new mongoose.Schema(
    {
        userId: String,
        clientId: String,
        name: String,
        address: String,
        projectCode: String,
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

ProjectScheme.plugin(mongooseDelete, { deletedAt: true, overrideMethods: 'all' });

module.exports = mongoose.model("projects", ProjectScheme)