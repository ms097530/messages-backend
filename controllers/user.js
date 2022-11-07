const User = require('../models/user')

exports.getUser = async (req, res, next) =>
{
    try
    {
        const userArr = await User.find()
        const user = userArr[Math.floor(Math.random() * userArr.length)]
        user.imageUrl = user.imageUrl.replace(/\\/g, '/')
        res.status(200).json({ user: user })
    }
    catch (err)
    {
        res.status(404).json({ message: 'Unable to retrieve user' })
    }
}