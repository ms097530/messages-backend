const express = require('express')
const { getMessages, postMessage } = require('../controllers/messages')

const router = express.Router()

router.get('/', getMessages)

router.post('/', postMessage)

module.exports = router