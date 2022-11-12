const mongoose = require('mongoose')

const Schema = mongoose.Schema

const messageSchema = Schema({
    content: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    likes: {
        type: Schema.Types.Number,
        required: true
    },
    replies: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Message',
            required: true
        }
    ],
    repliedTo: {
        messageId: {
            type: Schema.Types.ObjectId,
            ref: 'Message'
        },
        username: {
            type: String
        }
    },
    isDeleted: {
        type: Boolean
    }
}, { timestamps: true })

module.exports = mongoose.model('Message', messageSchema)