const express = require('express')
const { getMessages, postMessage, deleteMessage, updateLikes } = require('../controllers/messages')

const router = express.Router()

router.get('/', getMessages)

router.post('/', postMessage)

router.delete('/', deleteMessage)

router.put('/likes', updateLikes)

module.exports = router