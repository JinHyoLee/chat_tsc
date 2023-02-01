var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { roomEnter } from './js/Rooms.js';
import { friendsInit } from './js/Freinds.js';
import { loginInit, signUpInit } from './js/Login.js';
import { usersInit } from './js/Users.js';
const nav = document.querySelector('.nav');
const main = document.querySelector('.main');
const pages = {
    Rooms: 'pages/Rooms.html',
    Users: 'pages/Users.html',
    Friends: 'pages/Friends.html',
    Logout: 'pages/login.html',
};
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield fetch(pages['Logout']);
        const html = yield data.text();
        // console.log(html);
        main.innerHTML = html;
        loginInit();
        signUpInit();
    });
}
init();
// click마다 nav화면전환
nav.addEventListener('click', (e) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(e.target);
    const clicked = e.target.id;
    const data = yield fetch(pages[clicked]);
    const html = yield data.text();
    const header = document.querySelector('.header');
    // console.log(html);
    main.innerHTML = html;
    // Friends화면 클릭 시
    if (clicked === 'Friends') {
        friendsInit();
    }
    else if (clicked === 'Rooms') {
        roomEnter();
    }
    else if (clicked === 'Users') {
        usersInit();
    }
    else if (clicked === 'Logout') {
        header.style.display = 'none';
        alert('로그아웃');
        init();
    }
}));
