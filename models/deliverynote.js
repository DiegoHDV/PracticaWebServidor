const mongoose = require('mongoose')

const DeliverynoteScheme = new mongoose.Schema(
    {
        userId: mongoose.Types.ObjectId,
        clientId: mongoose.Types.ObjectId,
        projectId: mongoose.Types.ObjectId,
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
        sign: String,
    },
    {
        timestamps: true,
        versionKey: false
    }
)

module.exports = mongoose.model("deliverynotes", DeliverynoteScheme)