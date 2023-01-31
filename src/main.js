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

async function init() {
    const data = await fetch(pages['Logout']);
    const html = await data.text();
    // console.log(html);
    main.innerHTML = html;
    loginInit();
    signUpInit();
}

init();

// click마다 nav화면전환
nav.addEventListener('click', async (e) => {
    // console.log(e.target);
    const clicked = e.target.id;
    const data = await fetch(pages[clicked]);
    const html = await data.text();
    const header = document.querySelector('.header');
    // console.log(html);
    main.innerHTML = html;
    // Friends화면 클릭 시
    if (clicked === 'Friends') {
        friendsInit();
    } else if (clicked === 'Rooms') {
        roomEnter();
    } else if (clicked === 'Users') {
        usersInit();
    } else if (clicked === 'Logout') {
        header.style.display = 'none';
        alert('로그아웃');
        init();
    }
});
