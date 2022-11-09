const express = require('express')
const { body, param } = require('express-validator')

const { getMessages, postMessage, deleteMessage, updateLikes, updateMessage } = require('../controllers/messages')

const { validateMessageId } = require('../middleware/validation/validateMessageId')
const { validateMethod } = require('../middleware/validation/validateMethod')

const router = express.Router()

router.get('/', getMessages)

router.post('/',
    body('content')
        .isString()
        .withMessage('Content must be a string')
        .isLength({ min: 3 })
        .withMessage('Content must be at least 3 characters long'),
    postMessage)

router.put('/:messageId',
    param('messageId', 'Message validation failed')
        .isString()
        .custom(validateMessageId),
    body('content')
        .isString()
        .withMessage('Content must be a string')
        .isLength({ min: 3 })
        .withMessage('Content must be at least 3 characters long'),
    updateMessage)

router.delete('/:messageId',
    param('messageId', 'Message validation failed')
        .isString()
        .custom(validateMessageId)
    , deleteMessage)

router.put('/likes/:messageId',
    param('messageId', 'Message validation failed')
        .isString()
        .custom(validateMessageId),
    body('method', 'Method Validation failed')
        .isString()
        .custom(validateMethod),
    updateLikes)

module.exports = router