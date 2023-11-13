const socket = io();

var player1 = ''
var player2 = ''
var room = ''

var turn = ''

//add to select the available rooms
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
//-------------------------------------------------------------


const createRoom = () => {
    let name = document.getElementById("name").value
    if (name != "") {
        let name = document.getElementById("name").value;
        room = name + "'s room"
        socket.emit("create room", room, name);
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
            name,
            (response) => {
                if (response[0]) {
                    player1 = response[1].player1
                    player2 = name
                    room = document.getElementById("roomsList").value
                    updateUi()
                } else {
                    alert(response[1])
                    getRooms()
                }
            })
    } else {
        alert("Insert name")
    }
}
socket.on("start", (room) => {
    alert('start')
    player2 = room.player2
    updateUi()
    //show board
    showBoard('||||||||||')
    turn = 'Your turn'
})
socket.on("user disconnected", () => {
    alert('opponent disconnected')
    document.getElementById("login").style.display = 'flex'
    document.getElementById("playerNames").style.display = 'none'
})


const updateUi = () => {
    if (player2 == "") {
        document.getElementById("loading").style.display = 'block'
    } else {
        document.getElementById("loading").style.display = 'none'
    }
    document.getElementById("login").style.display = 'none'
    document.getElementById("player1Name").innerHTML = player1
    document.getElementById("player2Name").innerHTML = player2
    document.getElementById("roomName").innerHTML = room
    document.getElementById("playerNames").style.display = 'block'
}



//game functions
const showBoard = (board) => {
    var boardHtml = document.getElementById('board')
    boardHtml.style.display = 'block'
    board = board.split('|')
    console.log(board)
}

showBoard('|X|O||||O||||')

//handle moves
document.addEventListener('DOMContentLoaded', function () {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.addEventListener('click', function () {
            //cell.textContent =
            console.log(cell.dataset.index)
        });
    });
});