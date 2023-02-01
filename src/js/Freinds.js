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
const FriendPages = {
    inbox: 'pages/inbox.html',
    friends: 'pages/Friends_list.html',
};
function getReqDataFromServer() {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = getLoginId();
        const url = `/api/reqfriends/${userId}`;
        const data = yield fetch(url);
        const userData = yield data.json();
        // console.log(userData);
        const inboxElement = document.querySelector('.inbox');
        if (!inboxElement)
            return;
        inboxElement.innerHTML = '';
        userData.forEach((user) => {
            const friendElement = document.createElement('div');
            friendElement.className = 'friend';
            // username
            const userName = document.createElement('div');
            userName.className = 'username';
            userName.innerHTML = `ID : ${user.id}`;
            friendElement.append(userName);
            // signup-date
            const signupDate = document.createElement('div');
            signupDate.className = 'signup-date';
            signupDate.innerHTML = `가입날짜 : ${user.date}`;
            friendElement.append(signupDate);
            // accpet
            const accept = document.createElement('div');
            accept.className = 'accept';
            accept.id = user.id;
            accept.innerHTML = `수락`;
            friendElement.append(accept);
            accept.addEventListener('click', (e) => __awaiter(this, void 0, void 0, function* () {
                const friendId = e.target.id;
                const data = yield fetch(`/api/acceptfriends/${userId}/${friendId}`);
                const userData = yield data.json();
                if (userData.result === 'OK') {
                    alert('친구등록이 완료되었습니다');
                    yield getReqDataFromServer();
                }
            }));
            // reject
            const reject = document.createElement('div');
            reject.className = 'reject';
            reject.id = user.id;
            reject.innerHTML = `거절`;
            reject.addEventListener('click', (e) => __awaiter(this, void 0, void 0, function* () {
                const friendId = e.target.id;
                const data = yield fetch(`/api/rejectfriends/${userId}/${friendId}`);
                const userData = yield data.json();
                if (userData.result === 'OK') {
                    alert('친구 요청을 거절하였습니다.');
                    yield getReqDataFromServer();
                }
            }));
            friendElement.append(reject);
            inboxElement.append(friendElement);
        });
    });
}
function getMyFriendsDataFromServer() {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = getLoginId();
        const url = `/api/friends/${userId}`;
        const data = yield fetch(url);
        const userData = yield data.json();
        // console.log(userData);
        const friendsElement = document.querySelector('.friends');
        if (!friendsElement)
            return;
        friendsElement.innerHTML = '';
        userData.forEach((user) => {
            const friendElement = document.createElement('div');
            friendElement.className = 'friend';
            // username
            const userName = document.createElement('div');
            userName.className = 'username';
            userName.innerHTML = `ID : ${user.id}`;
            friendElement.append(userName);
            // signup-date
            const signupDate = document.createElement('div');
            signupDate.className = 'signup-date';
            signupDate.innerHTML = `가입날짜 : ${user.date}`;
            friendElement.append(signupDate);
            // friend-delete
            const deleteElement = document.createElement('div');
            deleteElement.className = 'friend-delete';
            deleteElement.id = user.id;
            deleteElement.innerHTML = `친구삭제`;
            friendElement.append(deleteElement);
            deleteElement.addEventListener('click', (e) => __awaiter(this, void 0, void 0, function* () {
                const friendId = e.target.id;
                const data = yield fetch(`/api/deletefriends/${userId}/${friendId}`);
                const userData = yield data.json();
                if (userData.result === 'OK') {
                    alert('친구삭제가 완료되었습니다');
                    yield getMyFriendsDataFromServer();
                }
            }));
            // direct-message
            const dmElement = document.createElement('div');
            dmElement.className = 'direct-message';
            dmElement.id = user.id;
            dmElement.innerHTML = `DM`;
            dmElement.addEventListener('click', (e) => __awaiter(this, void 0, void 0, function* () {
                alert('DM 생성');
            }));
            friendElement.append(dmElement);
            friendsElement.append(friendElement);
        });
    });
}
export function friendsInit() {
    return __awaiter(this, void 0, void 0, function* () {
        const friendsMain = document.querySelector('.friends_main');
        const nav2 = document.querySelector('.nav2');
        yield getReqDataFromServer();
        // Friends화면에서 click마다 nav화면전환
        if (!nav2)
            return;
        nav2.addEventListener('click', (e) => __awaiter(this, void 0, void 0, function* () {
            // console.log(e.target);
            const data = yield fetch(FriendPages[e.target.id]);
            const html = yield data.text();
            if (!friendsMain)
                return;
            friendsMain.innerHTML = html;
            if (e.target.id === 'inbox') {
                yield getReqDataFromServer();
            }
            else {
                yield getMyFriendsDataFromServer();
            }
            // console.log(html);
        }));
    });
}
