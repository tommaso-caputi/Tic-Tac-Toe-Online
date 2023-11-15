const socket = io();

var player1 = ''
var player2 = ''
var room = ''

// functions for handle rooms
const getRooms = () => {
    socket.emit("get rooms", (response) => {
        const roomsList = document.getElementById("roomsList");
        roomsList.innerHTML = '';
        Object.keys(response).forEach(response => {
            const option = document.createElement("option");
            option.text = response;
            roomsList.add(option);
        });
    });
}
getRooms()
const createRoom = () => {
    let name = document.getElementById("name").value
    if (name != "") {
        let name = document.getElementById("name").value;
        room = name + "'s room"
        socket.emit("create room", room, [name, socket.id]);
        player1 = name
        updateUi()
    } else {
        alert("Insert name")
    }
}
const joinRoom = () => {
    let name = document.getElementById("name").value
    if (name != "") {
        socket.emit("join room",
            document.getElementById("roomsList").value,
            [name, socket.id],
            (response) => {
                if (response[0]) {
                    console.log(response)
                    player1 = response[1].player1
                    player2 = [name, socket.id]
                    room = document.getElementById("roomsList").value
                    updateUi()
                    startGame()
                } else {
                    alert(response[1])
                    getRooms()
                }
            })
    } else {
        alert("Insert name")
    }
}
socket.on("user disconnected", () => {
    alert('opponent disconnected')
    document.getElementById("login").style.display = 'flex'
    document.getElementById("playerNames").style.display = 'none'
})
//-------------------------------------------------------------

const updateUi = () => {
    if (player2 == "") {
        document.getElementById("loading").style.display = 'block'
    } else {
        document.getElementById("loading").style.display = 'none'
    }
    document.getElementById("login").style.display = 'none'
    document.getElementById("player1Name").innerHTML = player1[0]
    document.getElementById("player2Name").innerHTML = player2[0]
    document.getElementById("roomName").innerHTML = room
    document.getElementById("playerNames").style.display = 'block'
}