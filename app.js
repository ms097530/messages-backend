const path = require('path')

const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv').config()
const cors = require('cors')
const bodyParser = require('body-parser')
const { body } = require('express-validator')

const messageRoutes = require('./routes/messages')
const userRoutes = require('./routes/user')
const { validateUser } = require('./middleware/validation/validateUser')

const PORT = 8000
const pw = process.env.MONGO_PW
const MONGODB_URI = `mongodb+srv://ms097530:${pw}@dev.btceb4a.mongodb.net/?retryWrites=true&w=majority`

const app = express()

app.use(bodyParser.json({}))
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use(cors())


app.use('/messages',
    body('userId', 'User validation failed')
        .isString()
        .custom(validateUser),
    messageRoutes)
app.use('/user', userRoutes)

mongoose.connect(MONGODB_URI)
    .then(() =>
    {
        const server = app.listen(PORT, () =>
        {
            console.log('listening on port ' + PORT)
        })
        const io = require('./util/socket').init(server)
        io.on('connection', socket =>
        {
            console.log('Client connected')
        })
    })