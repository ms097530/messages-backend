const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = Schema({
    username: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    likedPosts: [
        { type: Schema.Types.ObjectId, ref: 'Message', required: true }
    ],
    dislikedPosts: [
        { type: Schema.Types.ObjectId, ref: 'Message', required: true }
    ]
})

module.exports = mongoose.model('User', userSchema)