const socket = io();

var player1 = ''
var player2 = ''
var room = ''

var turn = ''
var board = ['', '', '', '', '', '', '', '', '']
var sign = 'X'

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
                    player1 = response[1].player1
                    player2 = [name, socket.id]
                    turn = player1
                    room = document.getElementById("roomsList").value
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
    if (turn[0] != "") {
        document.getElementById("turn").innerHTML = "Turn: " + turn[0]
    }
    document.getElementById("login").style.display = 'none'
    document.getElementById("player1Name").innerHTML = player1[0]
    document.getElementById("player2Name").innerHTML = player2[0]
    document.getElementById("roomName").innerHTML = room
    document.getElementById("playerNames").style.display = 'block'
}

// function for handle game
socket.on('start game', (tempRoom) => {
    player1 = tempRoom.player1
    player2 = tempRoom.player2
    turn = player1
    startGame()
})

const startGame = () => {
    document.getElementById("board").style.display = 'block'
    updateGame(board, turn, sign)
}

socket.on('new move', (newBoard, newTurn, newSign) => {
    updateGame(newBoard, newTurn, newSign)
})

const updateGame = (newBoard, newTurn, newSign) => {
    board = newBoard
    turn = newTurn
    sign = newSign
    console.log(board)
    updateUi()
    updateBoard()
}

const updateBoard = () => {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.textContent = board[cell.dataset.index]
        //console.log(cell.dataset.index, board[cell.dataset.index])
    });
}

document.addEventListener('DOMContentLoaded', function () {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.addEventListener('click', function () {
            if (turn[1] == socket.id) {
                if (socket.id == player1[1]) {
                    newTurn = player2
                } else {
                    newTurn = player1
                }
                if (sign == 'X') {
                    newSign = 'O'
                } else {
                    newSign = 'X'
                }
                board[cell.dataset.index] = sign
                newBoard = board
                updateGame(newBoard, newTurn, newSign)
                socket.emit('new move', newBoard, newTurn, newSign, room)
            } else {
                alert('Is not your turn')
            }
        });
    });
});
//------------------------------------------------
