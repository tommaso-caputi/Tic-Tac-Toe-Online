const socket = io();

var player1 = ''
var player2 = ''
var room = ''

//add to select the available rooms
socket.emit("get rooms", (response) => {
    const roomsList = document.getElementById("roomsList");
    roomsList.innerHTML = '';
    Object.keys(response).forEach(response => {
        const option = document.createElement("option");
        option.text = response;
        roomsList.add(option);
    });
});
//-------------------------------------------------------------


const createRoom = () => {
    if (document.getElementById("name").value != "") {
        let name = document.getElementById("name").value;
        socket.emit("create room", name + "'s room", name);

        updateUi()
    } else {
        alert("Insert name")
    }
}

const joinRoom = () => {
    if (document.getElementById("name").value != "") {
        socket.emit("join room",
            document.getElementById("roomsList").value,
            document.getElementById("name").value,
            (response) => {
                if (response[0]) {
                    console.log(response[1])
                    updateUi()
                } else {
                    alert(response[1])
                }
            })
    } else {
        alert("Insert name")
    }
}

const updateUi = () => {
    document.getElementById("login").style.display = 'none'
    document.getElementById("player1Name").innerHTML = player1
    document.getElementById("player1Name").innerHTML = player2
    document.getElementById("playerNames").style.display = 'block'
}