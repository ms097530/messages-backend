const Message = require('../models/message')

exports.getMessages = async (req, res, next) =>
{
    try
    {
        const messages = await Message.find()
        res.status(200).json({ messages: messages })
    }
    catch (err)
    {
        res.status(404).json({ message: 'Could not retrieve messages' })
    }
}

exports.postMessage = async (req, res, next) =>
{
    // const { }
    const user = req.body.user
    const message = req.body.comment
}