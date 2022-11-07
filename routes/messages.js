const express = require('express')
const { getMessages } = require('../controllers/messages')

const router = express.Router()

router.get('/', getMessages)

module.exports = router