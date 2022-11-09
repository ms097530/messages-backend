const { validationResult } = require('express-validator')

const Message = require('../models/message')
const User = require('../models/user')

exports.getMessages = async (req, res, next) =>
{
    try
    {
        // order - top level[0], top level[0] reply[0], reply[0] reply2[0]
        // const messages = await Message.find({ "repliedTo": { "$exists": false } }).populate('user replies')
        const messages = await Message.find().populate('user')
        // console.log(messages)
        res.status(200).json({ messages: messages })
    }
    catch (err)
    {
        res.status(404).json({ message: 'Could not retrieve messages' })
    }
}

exports.postMessage = async (req, res, next) =>
{
    // console.log('repliedTo:', req.repliedTo)
    try
    {
        const validationResults = validationResult(req)
        if (!validationResults.isEmpty())
        {
            const resultsArr = validationResults.array()
            throw new Error(resultsArr[0].msg)
        }

        // message represents content, not an entire Message object
        // content = string of what the user entered
        // repliedTo - id of message user is replying to (or null/undefined)
        // userId - id of user posting message
        // 1. if repliedTo is null/undefined, it is top-level comment
        // 2. if not top-level comment, retrieve username of replied to user
        const { content, repliedTo, userId, } = req.body
        console.log(`
        content: ${content}
        repliedTo: ${repliedTo}
        userId: ${userId}`)
        let repliedToMessage
        let repliedToInfo = null
        if (repliedTo)
        {
            console.log('REPLIED TO NOT NULL')
            repliedToMessage = await Message.findById(repliedTo).populate('user')
            repliedToInfo =
            {
                messageId: repliedTo,
                username: repliedToMessage.user.username
            }
            console.log(repliedToInfo)
        }
        // console.log('repliedToUser: ', repliedToUser)
        const msg = new Message({
            content: content,
            user: userId,
            // null or object with messageId and username
            repliedTo: repliedToInfo,
            likes: 0,
            replies: []
        })
        const savedRes = await msg.save()
        console.log('SAVED RES', savedRes)
        // add new reply ID to replies array of parent message
        console.log('before adding to replies of parent message')
        if (repliedToMessage)
        {
            repliedToMessage.replies.push(savedRes._id)
            await repliedToMessage.save()
        }
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
        if (message.user.toString() !== userId)
        {
            throw new Error('Invalid user credentials')
        }

        message.content = content
        const savedMessage = await message.save()
        res.status(200).json({ message: 'Message successfully edited', content: savedMessage.content })
    }
    catch (err)
    {
        console.log(err)
        res.status(400).json({ message: err.message })
    }
}