const socket = io();

var player1 = ['', '']
var player2 = ['', '']
var room = ''

var turn = ['', '']
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
        player1 = [name, socket.id]
        player2 = ['', '']
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
    console.log(player1, player2, room, turn, board)
    if (player1[0] != "" && player2[0] == "") {
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
    if (player1[0] == "" && player2[0] == "") {
        document.getElementById("login").style.display = 'flex'
        document.getElementById("board").style.display = 'none'
        document.getElementById("turn").style.display = 'none'
        document.getElementById("playerNames").style.display = 'none'
        location.reload()
    }
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
    const end = checkWinner()
    if (end) {
        var res = ''
        if (end == 'T') {
            res = 'Tie'
        } else if (end == 'X') {
            res = player1[0] + ' wins'
        } else {
            res = player2[0] + ' wins'
        }
        alert(res)
        player1 = ['', '']
        player2 = ['', '']
        room = ''
        turn = ['', '']
        board = ['', '', '', '', '', '', '', '', '']
        sign = 'X'
        updateUi()
    }
})

const updateGame = (newBoard, newTurn, newSign) => {
    board = newBoard
    turn = newTurn
    sign = newSign
    updateUi()
    updateBoard()
}

const updateBoard = () => {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.textContent = board[cell.dataset.index]
    });
}

document.addEventListener('DOMContentLoaded', function () {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.addEventListener('click', function () {
            if (turn[1] == socket.id) {
                if (checkMove(cell.dataset.index)) {
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
                    const end = checkWinner()
                    if (end) {
                        var res = ''
                        if (end == 'T') {
                            res = 'Tie'
                        } else if (end == 'X') {
                            res = player1[0] + ' wins'
                        } else {
                            res = player2[0] + ' wins'
                        }
                        alert(res)
                        player1 = ['', '']
                        player2 = ['', '']
                        room = ''
                        turn = ['', '']
                        board = ['', '', '', '', '', '', '', '', '']
                        sign = 'X'
                        updateUi()
                    }
                } else {
                    alert('This move is not valid')
                }
            } else {
                alert('Is not your turn')
            }
        });
    });
});

const checkMove = (index) => {
    if (board[index] == '') {
        return true
    } else {
        return false
    }
}
const checkWinner = () => {
    for (const combination of [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]             // diagonals
    ]) {
        const [a, b, c] = combination;
        if (board[a] !== '' && board[a] === board[b] && board[a] === board[c]) {
            return board[a]; // winner
        }
    }
    if (!board.includes('')) {
        return 'T'; // tie
    }
    return null;
};
//------------------------------------------------
