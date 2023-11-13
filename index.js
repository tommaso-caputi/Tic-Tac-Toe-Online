const express = require("express");
const socket = require("socket.io");

// App setup
const PORT = 3000;
const app = express();
const server = app.listen(PORT, function () {
    console.log(`Listening on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});

// Static files
app.use(express.static("public"));

//Utils
rooms = {}

// Socket setup
const io = socket(server);

io.on("connection", (socket) => {
    //console.log("Made socket connection", socket.id);

    socket.on("get rooms", (cb) => {
        cb(getAvailableRooms())
    })

    socket.on("create room", (roomName, player1) => {
        rooms[roomName] = { 'player1': player1, player2: '' }
        socket.join(roomName)
    })
    socket.on("join room", (roomName, player2, cb) => {
        console.log(roomName)
        if (rooms[roomName].player2 == '') {
            socket.join(roomName)
            rooms[roomName].player2 = player2
            socket.to(roomName).emit('start', rooms[roomName])
            cb([true, rooms[roomName]])
        } else {
            cb([false, 'The room is full'])
        }
    })
    socket.on('disconnect', () => {
        console.log('User disconnected', socket.id);
        socket.to(socket.id).emit('prova');
        console.log(rooms)
    });
});


const getAvailableRooms = () => {
    var temp = {}
    for (var key of Object.keys(rooms)) {
        if (rooms[key].player2 == '') {
            temp[key] = rooms[key]
        }
    }
    return temp;
}