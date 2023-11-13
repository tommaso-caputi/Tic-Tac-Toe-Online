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
    let name = document.getElementById("name").value
    if (name != "") {
        let name = document.getElementById("name").value;
        socket.emit("create room", name + "'s room", name);
        room = name + "'s room"
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
                    console.log(response[1])
                    player2 = name
                    updateUi()
                } else {
                    alert(response[1])
                }
            })
    } else {
        alert("Insert name")
    }
}
socket.on("start", (room) => {
    console.log('cascjacajcja')
    player2 = room.player2
    updateUi()
})



const updateUi = () => {
    document.getElementById("login").style.display = 'none'
    document.getElementById("player1Name").innerHTML = player1
    document.getElementById("player2Name").innerHTML = player2
    document.getElementById("roomName").innerHTML = room
    document.getElementById("playerNames").style.display = 'block'
}