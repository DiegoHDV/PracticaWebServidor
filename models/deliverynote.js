const mongoose = require('mongoose')

const DeliverynoteScheme = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Types.ObjectId, 
            ref: 'users'
        },
        clientId: {
            type: mongoose.Types.ObjectId, 
            ref: 'clients'
        },
        projectId: {
            type: mongoose.Types.ObjectId, 
            ref: 'projects'
        },
        name: String,
        description: String,
        format: {
            type: String,
            enum: ["hours", "material", "any"]
        },
        hours: [
            {
                description: {
                    type: String,
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true
                }
            }
        ],
        material: [
            {
                description: {
                    type: String,
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true
                }
            }
        ],
        pdf: String,
        sign: String
    },
    {
        timestamps: true,
        versionKey: false
    }
)

module.exports = mongoose.model("deliverynotes", DeliverynoteScheme)