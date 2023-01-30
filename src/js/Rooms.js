const socket = io();

// enter눌렀을 때 메세지 보내기
function sendEnter() {
    const chatInput = document.querySelector(".chat-input");
    chatInput.addEventListener("keypress", (e) => {
        if (e.keyCode === 13) {
            send();
        }
    });
}

// 채팅방 참여인원 수
async function roomPeople() {
    let data;
    await fetch("/api/rooms")
        .then((res) => {
            if (res.ok) {
                return res.json();
            }
        })
        .then((text) => {
            console.log(text);
            data = text;
        });
    return data;
}

// 채팅방 현재인원, 방번호
function makeCurrentMember(id, roomData) {
    console.log(roomData);
    const roomNumber = document.querySelector("#room-number");
    const currentMember = document.querySelector("#current-member");
    const currentMemberName = document.querySelector(".current-membername");
    const foundElement = roomData.find((element) => element.id === id);
    // console.log(foundElement);
    foundElement.members.forEach((member) => {
        const user = document.createElement(`li`);
        user.innerHTML = member;
        currentMemberName.appendChild(user);
    });
    currentMember.innerHTML = foundElement.members.length;
    roomNumber.innerHTML = id;
}

function makeRoom(element) {
    const room = document.querySelector(`#room${element.id}`);
    room.innerHTML = element.members.length;
}

// 채팅방 입장
export async function roomEnter() {
    const id = document.querySelector("#id");
    const sendButton = document.querySelector(".send-button");
    const roomsDetail = document.querySelector(".rooms-detail");

    roomsDetail.style.display = "none"; // Rooms클릭시 채팅방 안보이기
    const roomData = await roomPeople();
    roomData.forEach((element) => {
        makeRoom(element);
    });
    const enters = document.querySelectorAll(".enter");
    console.log(enters);
    enters.forEach((enter) => {
        enter.addEventListener("click", async (e) => {
            makeCurrentMember(e.target.id, roomData);
            const roomMain = document.querySelector(".rooms-main");
            roomMain.style.display = "none";
            const roomDetail = document.querySelector(".rooms-detail");
            roomDetail.style.display = "flex";
            // console.log(e.target.id);
            sendEnter();
        });
    });
}

// message 보내기
function send() {
    const chatInput = document.querySelector(".chat-input");

    const param = {
        // name: id.value,
        name: "닉네임",
        msg: chatInput.value,
        // msg: "입장",
    };
    socket.emit("chatting", param);
    chatInput.value = "";
}

socket.on("chatting", (data) => {
    const chat = document.querySelector(".chat");

    const { name, msg } = data;
    console.log(name, msg);
    const item = new LiModel(name, msg); // LiModel 인스턴스화
    item.makeLi();
    chat.scrollTo(0, chat.scrollHeight);
});

function LiModel(name, msg) {
    const chatList = document.querySelector(".chatting-list");

    this.name = name;
    this.msg = msg;

    this.makeLi = () => {
        const li = document.createElement("li");
        // li.classList.add(id.value === this.name ? "sent" : "received");
        li.classList.add();
        const dom = `
         <span class="profile">
            <span class="chat-user">${this.name} : </span>
         </span>
         <span class="message">${this.msg}</span>
      `;
        li.innerHTML = dom;
        chatList.appendChild(li);
    };
}
