const Message = require('../models/message')

exports.getMessages = async (req, res, next) =>
{
    try
    {
        const messages = await Message.find().populate('user')
        res.status(200).json({ messages: messages })
    }
    catch (err)
    {
        res.status(404).json({ message: 'Could not retrieve messages' })
    }
}

exports.postMessage = async (req, res, next) =>
{
    const { message, repliedTo, userId, } = req.body
    try
    {
        console.log(`
        message: ${message}
        repliedTo: ${repliedTo}
        userId: ${userId}`)
        const msg = new Message({ content: message, user: userId, repliedTo: repliedTo })
        const saveRes = await msg.save()
        res.status(200).json({ message: 'POSTED' })
    }
    catch (err)
    {
        console.log(err)
        res.status(400).json({ message: 'Incorrect info provided' })
    }
}