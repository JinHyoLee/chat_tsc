import { getMyId } from "./login.js";
let myId = "unknown";
let roomNumber = null;
const socket = io();

async function fetchData() {
    let data;
    await fetch(`/api/rooms`)
        .then((res) => {
            if (res.status != 200) {
                console.log(res.statusText);
                throw new Error(res.statusText);
            }
            return res.json();
        })
        .then((text) => {
            data = text;
        });
    return data;
}

function makeStatusWithRoomNumber(element) {
    const chatGroupRoomNumber = document.querySelector("#chat-group-room-number");
    chatGroupRoomNumber.innerHTML = element.roomId;
    const roomStatusBox = document.querySelector(".room-status-box");
    const members = document.createElement("div");
    members.innerHTML = `참여인원수 ${element.members.length}`;
    roomStatusBox.appendChild(members);

    const ul = document.createElement("ul");
    element.members.forEach((member) => {
        const li = document.createElement("li");
        li.innerHTML = member;
        ul.appendChild(li);
    });
    roomStatusBox.appendChild(ul);
}

function makeRoomContainer(element) {
    const roomGroup = document.querySelector(".room-group");

    const roomContainer = document.createElement("div");
    roomContainer.className = "room-container";

    const members = document.createElement("div");
    members.innerHTML = `참여인원수 ${element.members.length}`;
    roomContainer.appendChild(members);

    const roomId = document.createElement("div");
    roomId.innerHTML = `방번호 ${element.roomId}`;
    roomContainer.appendChild(roomId);

    const enter = document.createElement("button");
    enter.className = "enter";
    enter.innerHTML = "입장";
    enter.addEventListener("click", (e) => {
        myId = getMyId();
        makeStatusWithRoomNumber(element);
        roomNumber = element.roomId;
        console.log(`${myId} join to room ${roomNumber}`);
        socket.emit("join-room", myId, roomNumber);
    });
    roomContainer.appendChild(enter);
    roomGroup.appendChild(roomContainer);
}

async function getDatafromServer() {
    const data = await fetchData();
    data.forEach((element) => {
        makeRoomContainer(element);
    });
}

function makeLi(data) {
    const chatList = document.querySelector(".chatting-list");
    const displayContainer = document.querySelector(".chat-container");
    const li = document.createElement("li");
    li.classList.add(data.nickname === myId ? "sent" : "received");
    li.innerHTML = `<span class="profile">
                    <span class="user">${data.nickname} : </span></span>
                    <span class="message">${data.message}</span> `;
    chatList.appendChild(li);
    displayContainer.scrollTo(0, displayContainer.scrollHeight);
}

function sendData(message) {
    if (!roomNumber) return;
    const data = {
        nickname: myId,
        message: message,
    };
    console.log(data, roomNumber);
    makeLi(data);
    socket.emit("chatting", data, roomNumber);
}

export async function roomInit() {
    const chatInput = document.querySelector(".chatting-input");
    const exit = document.querySelector(".exit");

    getDatafromServer();
    chatInput.addEventListener("keypress", (e) => {
        if (e.keyCode === 13) {
            sendData(chatInput.value);
            chatInput.value = "";
        }
    });

    exit.addEventListener("click", (e) => {
        const chatList = document.querySelector(".chatting-list");
        const roomStatusBox = document.querySelector(".room-status-box");

        chatList.innerHTML = "";
        roomStatusBox.innerHTML = "";

        socket.emit("leave-room", myId, roomNumber);
        // socket.disconnect();
        roomNumber = null;
    });

    socket.on("connect", () => {
        console.log(`you connected with id ${socket.id}`);
    });

    socket.on("chatting", (data) => {
        console.log(data);
        makeLi(data);
    });
}
