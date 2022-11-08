const express = require('express')
const { getMessages, postMessage, deleteMessage, updateLikes, updateMessage } = require('../controllers/messages')

const router = express.Router()

router.get('/', getMessages)

router.post('/', postMessage)

router.put('/:messageId', updateMessage)

router.delete('/:messageId', deleteMessage)

router.put('/likes/:messageId', updateLikes)

module.exports = router