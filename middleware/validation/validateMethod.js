exports.validateMethod = (val, { req }) =>
{
    const lowerVal = val.toLowerCase()
    if (lowerVal !== 'up' && lowerVal !== 'down')
    {
        throw new Error('Invalid method value provided')
    }
    req.parsedMethod = lowerVal
    return true
}