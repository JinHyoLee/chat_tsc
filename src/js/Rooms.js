var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getLoginId } from './Login.js';
import { io } from '../../node_modules/socket.io-client/build/esm/index.js';
const socket = io();
let loginId;
let serverRoomNumber;
// enter눌렀을 때 메세지 보내기
function sendEnter(id, roomNumber) {
    const chatInput = document.querySelector('.chat-input');
    if (!chatInput)
        return;
    chatInput.addEventListener('keypress', (e) => {
        if (e.keyCode === 13) {
            send(id, roomNumber);
        }
    });
}
// 채팅방 참여인원 수
function roomPeople() {
    return __awaiter(this, void 0, void 0, function* () {
        let data = [];
        yield fetch('/api/rooms')
            .then((res) => {
            if (res.ok) {
                return res.json();
            }
        })
            .then((text) => {
            // console.log(text);
            data = text;
        });
        return data;
    });
}
// 채팅방 현재인원, 방번호
function makeCurrentMember(id, roomData) {
    // console.log(roomData);
    const roomNumber = document.querySelector('#room-number');
    const currentMember = document.querySelector('#current-member');
    const currentMemberName = document.querySelector('.current-membername');
    const foundElement = roomData.find((item) => item.id === id);
    // console.log(foundElement);
    if (!currentMemberName)
        return;
    if (!currentMember)
        return;
    if (!roomNumber)
        return;
    if (!foundElement)
        return;
    currentMemberName.innerHTML = ''; // 참여 목록 초기화
    if (foundElement.members.length > 0) {
        foundElement === null || foundElement === void 0 ? void 0 : foundElement.members.forEach((member) => {
            const user = document.createElement(`li`);
            user.innerHTML = member;
            currentMemberName.appendChild(user);
        });
    }
    currentMember.innerHTML = foundElement.members.length.toString();
    roomNumber.innerHTML = id;
}
function makeRoom(element) {
    const room = document.querySelector(`#room${element.id}`);
    if (!room)
        return;
    room.innerHTML = element.members.length.toString();
}
// 채팅방 입장
export function roomEnter() {
    return __awaiter(this, void 0, void 0, function* () {
        const roomDetail = document.querySelector('.rooms-detail');
        const chatInput = document.querySelector('.chat-input');
        const roomExit = document.querySelector('.exit');
        const currentMemberName = document.querySelector('.current-membername');
        const roomMain = document.querySelector('.rooms-main');
        const chatList = document.querySelector('.chatting-list');
        if (!chatInput || !roomExit || !roomMain || !roomDetail || !currentMemberName || !chatList)
            return;
        chatInput.addEventListener('keypress', (e) => {
            if (e.keyCode === 13) {
                send(loginId, serverRoomNumber);
            }
        });
        // 채팅방 나가기
        roomExit.addEventListener('click', (e) => __awaiter(this, void 0, void 0, function* () {
            socket.emit('leave-room', loginId, serverRoomNumber);
            roomMain.style.display = 'block';
            roomDetail.style.display = 'none';
            currentMemberName.innerHTML = '';
            chatList.innerHTML = '';
            currentMemberName.innerHTML = '';
        }));
        roomDetail.style.display = 'none'; // Rooms클릭시 채팅방 안보이기
        const roomData = yield roomPeople();
        roomData.forEach((element) => {
            makeRoom(element);
        });
        const enters = document.querySelectorAll('.enter');
        // console.log(enters);
        enters.forEach((enter) => {
            // console.log('addEventListener to enter button');
            // console.log(enter);
            enter.addEventListener('click', (e) => __awaiter(this, void 0, void 0, function* () {
                // console.log(e.target.id);
                loginId = getLoginId();
                serverRoomNumber = e.target.id;
                makeCurrentMember(serverRoomNumber, roomData);
                roomMain.style.display = 'none';
                roomDetail.style.display = 'flex';
                // console.log(e.target.id);
                // socket.connect();
                socket.emit('join-room', loginId, serverRoomNumber);
                // sendEnter(getLoginId(), roomNumber);
            }));
        });
    });
}
// message 보내기
function send(id, roomNumber) {
    const chatInput = document.querySelector('.chat-input');
    const chat = document.querySelector('.chat');
    if (!chat)
        return;
    if (!chatInput)
        return;
    const param = {
        name: id,
        msg: chatInput.value,
    };
    // console.log(param.name, param.msg);
    makeChatlist(param.name, param.msg); // LiModel 인스턴스화
    chat.scrollTo(0, chat.scrollHeight);
    socket.emit('chatting', param, roomNumber);
    chatInput.value = '';
}
// 채팅
socket.on('chatting', (data) => {
    const chat = document.querySelector('.chat');
    if (!chat)
        return;
    const { name, msg } = data;
    // console.log(name, msg);
    makeChatlist(name, msg); // LiModel 인스턴스화
    chat.scrollTo(0, chat.scrollHeight);
});
// 채팅방 내 유저목록
socket.on('newmember-join', (id, roomData) => {
    makeCurrentMember(id, roomData);
});
function makeChatlist(name, msg) {
    const chatList = document.querySelector('.chatting-list');
    if (!chatList)
        return;
    const li = document.createElement('li');
    // li.classList.add(id.value === this.name ? "sent" : "received");
    li.classList.add();
    const dom = `
         <span class="profile">
            <span class="chat-user">${name} : </span>
         </span>
         <span class="message">${msg}</span>
      `;
    li.innerHTML = dom;
    chatList.appendChild(li);
}
