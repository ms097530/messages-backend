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
    repliedTo: {
        type: Schema.Types.ObjectId,
        ref: 'Message'
    }
}, { timestamps: true })

module.exports = mongoose.model('Message', messageSchema)