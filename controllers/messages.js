const { validationResult } = require('express-validator')

const Message = require('../models/message')
const User = require('../models/user')

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
    try
    {
        const validationResults = validationResult(req)
        if (!validationResults.isEmpty())
        {
            const resultsArr = validationResults.array()
            throw new Error(resultsArr[0].msg)
        }

        // message represents content, not an entire Message object
        const { content, repliedTo, userId, } = req.body
        console.log(`
        content: ${content}
        repliedTo: ${repliedTo}
        userId: ${userId}`)
        const msg = new Message({ content: content, user: userId, repliedTo: repliedTo, likes: 0 })
        const saveRes = await msg.save()
        res.status(200).json({ message: 'POSTED' })
    }
    catch (err)
    {
        console.log(err)
        res.status(400).json({ message: err.message })
    }
}

exports.deleteMessage = async (req, res, next) =>
{
    // expect to receive userId, messageId
    // return messageId
    try
    {
        const validationResults = validationResult(req)
        if (!validationResults.isEmpty())
        {
            const resultsArr = validationResults.array()
            throw new Error(resultsArr[0].msg)
        }
        const { userId } = req.body
        const { messageId } = req.params
        const message = req.message
        if (message.user.toString() !== userId)
        {
            throw new Error('Invalid user credentials')
        }

        const removeResponse = await message.remove()
        console.log(removeResponse)

        res.status(200).json({ message: 'Message successfully deleted', messageId: messageId })
    }
    catch (err)
    {
        console.log(err)
        res.status(400).json({ message: err.message })
    }
}

exports.updateLikes = async (req, res, next) =>
{
    try
    {
        const validationResults = validationResult(req)
        if (!validationResults.isEmpty())
        {
            const resultsArr = validationResults.array()
            throw new Error(resultsArr[0].msg)
        }

        const { userId, method } = req.body
        const { messageId } = req.params

        const message = req.message
        const user = req.user
        if (message.user.toString() === userId)
        {
            throw new Error('Can not vote on your own message')
        }

        // if post is already liked or disliked, one of these will return a number >= 0
        const likedPostIndex = user.likedPosts.findIndex((id) => id.toString() === messageId)
        const dislikedPostIndex = user.dislikedPosts.findIndex((id) => id.toString() === messageId)
        // check if message has already been voted on by this user
        if (likedPostIndex >= 0)
        {
            user.likedPosts.splice(likedPostIndex, 1)
            message.likes -= 1
        }
        else if (dislikedPostIndex >= 0)
        {
            user.dislikedPosts.splice(dislikedPostIndex, 1)
            message.likes += 1
        }
        // message not voted on - upvote or downvote
        else
        {
            const parsedMethod = req.parsedMethod
            switch (parsedMethod)
            {
                case 'up':
                    {
                        user.likedPosts.push(messageId)
                        message.likes += 1
                        break
                    }
                case 'down':
                    {
                        user.dislikedPosts.push(messageId)
                        message.likes -= 1
                        break
                    }
            }
        }
        const savedUser = await user.save()
        const savedMessage = await message.save()

        res.status(200).json({
            message: 'Like status updated',
            likes: savedMessage.likes,
            userLikedPosts: savedUser.likedPosts,
            userDislikedPosts: savedUser.dislikedPosts
        })
    }
    catch (err)
    {
        console.log(err)
        res.status(400).json({ message: err.message })
    }

}

exports.updateMessage = async (req, res, next) =>
{
    try
    {
        const validationResults = validationResult(req)
        if (!validationResults.isEmpty())
        {
            const resultsArr = validationResults.array()
            throw new Error(resultsArr[0].msg)
        }
        const { userId, content } = req.body
        const { messageId } = req.params

        const message = req.message
        const user = req.user
        if (message.user.toString() !== user._id.toString())
        {
            throw new Error('Invalid user credentials')
        }

        message.content = content
        const savedMessage = await message.save()
        res.status({ message: 'Message successfully editied', content: savedMessage.content })
    }
    catch (err)
    {
        console.log(err)
        res.status(400).json({ message: err.message })
    }
}