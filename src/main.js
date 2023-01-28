const nav = document.querySelector(".nav");
const main = document.querySelector(".rooms-main");
const signIn = document.querySelector("#sign-in");
const signUp = document.querySelector("#sign-up");
const header = document.querySelector(".header");
const id = document.querySelector("#id");
const password = document.querySelector("#password");

const nickname = document.querySelector("#nickname");
const chatList = document.querySelector(".chatting-list");
const chatInput = document.querySelector(".chatting-input");
const sendButton = document.querySelector(".send-button");
const displayContainer = document.querySelector(".display-container");

const socket = io();

const pages = {
    Rooms: "pages/Rooms.html",
    Users: "pages/Users.html",
    Friends: "pages/Friends.html",
    Logout: "pages/login.html",
};

const FriendPages = {
    inbox: "pages/inbox.html",
    friends: "pages/Friends_list.html",
};

function send() {
    // message 보내기
    const param = {
        // name: nickname.value,
        name: "닉네임",
        // msg: chatInput.value,
        msg: "입장",
    };
    socket.emit("chatting", param);
}

socket.on("chatting", (data) => {
    const { name, msg } = data;
    console.log(name, msg);
    // const item = new LiModel(name, msg); // LiModel 인스턴스화
    // item.makeLi();
    // displayContainer.scrollTo(0, displayContainer.scrollHeight);
});

function LiModel(name, msg) {
    this.name = name;
    this.msg = msg;

    this.makeLi = () => {
        const li = document.createElement("li");
        li.classList.add(nickname.value === this.name ? "sent" : "received");
        const dom = `
         <span class="profile">
            <span class="user">${this.name} : </span>
         </span>
         <span class="message">${this.msg}</span>
      `;
        li.innerHTML = dom;
        chatList.appendChild(li);
    };
}

// 채팅방 입장
async function roomEnter() {
    header.style.display = "block";
    const page = await fetch(pages["Rooms"]);
    const html = await page.text();
    main.innerHTML = html;
    const enters = document.querySelectorAll(".enter");
    console.log(enters);
    enters.forEach((enter) => {
        enter.addEventListener("click", async (e) => {
            const roomMain = document.querySelector(".rooms-main");
            roomMain.style.display = "none";
            const roomDetail = document.querySelector(".rooms-detail");
            roomDetail.style.display = "flex";
            console.log(e.target.id);
            send();
        });
    });
}

// 로그인
signIn.addEventListener("click", async (e) => {
    const req = {
        // id: id.value,
        // password: password.value,
        id: "abc",
        password: "123",
    };
    fetch(`/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req),
    })
        .then((res) => {
            if (res.status != 200) {
                console.log(res.statusText);
                throw new Error(res.statusText);
            }
            console.log(res);
            return res.json();
        })
        .then(async (data) => {
            // 성공시 생성된 아이디가 반환됨
            console.log(data);
            if (data.result === "OK") {
                roomEnter();
            } else {
                alert("없는 아이디 입니다");
            }
        });
});

// click마다 nav화면전환
nav.addEventListener("click", async (e) => {
    console.log(e.target);
    const data = await fetch(pages[e.target.id]);
    const html = await data.text();
    console.log(html);
    main.innerHTML = html;
    // Friends화면 클릭 시
    if (e.target.id === "Friends") {
        const friendsMain = document.querySelector(".friends_main");
        const nav2 = document.querySelector(".nav2");
        nav2.addEventListener("click", async (e) => {
            console.log(e.target);
            const data = await fetch(FriendPages[e.target.id]);
            const html = await data.text();
            friendsMain.innerHTML = html;
            console.log(html);
        });
    }
});
