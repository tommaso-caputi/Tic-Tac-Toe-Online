const socket = io();

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
        

    } else {
        alert("Insert name")
    }
}

const joinRoom = () => {
    if (document.getElementById("name").value != "") {


    } else {
        alert("Insert name")
    }
}