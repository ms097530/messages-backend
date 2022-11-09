const Message = require('../../models/message')

exports.validateMessageId = async (messageId, { req }) =>
{
    console.log('validating message')
    // const { messageId } = req.body
    if (!messageId)
    {
        throw new Error('Message ID must be provided')
    }
    const message = await Message.findById(messageId)
    // console.log('Message in validateMessage: ', message)
    if (!message)
    {
        console.log('throwing after not finding message')
        throw new Error('Unable to find message')
    }

    req.message = message
    return true
}