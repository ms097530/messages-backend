const User = require('../../models/user')

exports.validateUser = async (userId, { req }) =>
{
    // console.log('validating user')
    if (!userId)
    {
        throw new Error('User ID must be provided')
    }
    const user = await User.findById(userId)
    // console.log('user in validateUser: ', user)
    if (!user)
    {
        throw new Error('Unable to find user')
    }
    req.user = user
    return true
}