import { roomEnter } from './js/Rooms.js';
import { friendsInit } from './js/Freinds.js';
import { loginInit, signUpInit } from './js/Login.js';

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
    const data = await fetch(pages[e.target.id]);
    const html = await data.text();
    // console.log(html);
    main.innerHTML = html;
    // Friends화면 클릭 시
    if (e.target.id === 'Friends') {
        friendsInit();
    } else if (e.target.id === 'Rooms') {
        roomEnter();
    }
});
