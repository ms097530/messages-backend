// creates io as a global in this file, then sets the value with the call to init
// the value can then be retrieved using getIO
let io
module.exports = {
    init: (httpServer) =>
    {
        io = require('socket.io')(httpServer, {
            cors: {
                origin: 'http://localhost:3000'
            }
        })
        return io
    },
    getIO: () =>
    {
        if (!io)
        {
            throw new Error('Socket.io is not initialized!')
        }
        return io
    }
}