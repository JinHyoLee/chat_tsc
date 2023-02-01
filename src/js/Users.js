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
function getDataFromServer() {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = getLoginId();
        const url = `/api/users/${userId}`;
        const data = yield fetch(url);
        const userData = yield data.json();
        // console.log(userData);
        const usersElement = document.querySelector('.users');
        userData.forEach((user) => {
            const userElement = document.createElement('div');
            userElement.className = 'user';
            // username
            const userName = document.createElement('div');
            userName.className = 'username';
            userName.innerHTML = `ID : ${user.id}`;
            userElement.append(userName);
            // signup-date
            const signupDate = document.createElement('div');
            signupDate.className = 'signup-date';
            signupDate.innerHTML = `가입날짜 : ${user.date}`;
            userElement.append(signupDate);
            // friend-num
            const friendNum = document.createElement('div');
            friendNum.className = 'friendNum';
            friendNum.innerHTML = `친구수 : ${user.friendNum}`;
            userElement.append(friendNum);
            // friend-requests
            const friendRequests = document.createElement('div');
            friendRequests.className = 'friend-requests';
            friendRequests.id = user.id;
            friendRequests.innerHTML = `친구요청`;
            if (user.isFriend)
                friendRequests.style.visibility = 'hidden';
            userElement.append(friendRequests);
            usersElement.append(userElement);
        });
    });
}
export function usersInit() {
    return __awaiter(this, void 0, void 0, function* () {
        yield getDataFromServer();
        const userId = getLoginId();
        const friendRequests = document.querySelectorAll('.friend-requests');
        friendRequests.forEach((request) => {
            request.addEventListener('click', (e) => __awaiter(this, void 0, void 0, function* () {
                const friendId = e.target.id;
                const data = yield fetch(`/api/reqfriends/${userId}/${friendId}`);
                const userData = yield data.json();
                if (userData.result === 'OK') {
                    alert('요청이 완료되었습니다');
                }
            }));
        });
    });
}
