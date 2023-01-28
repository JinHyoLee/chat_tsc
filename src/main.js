const nav = document.querySelector(".nav");
const main = document.querySelector(".rooms-main");
const signIn = document.querySelector("#sign-in");
const signUp = document.querySelector("#sign-up");

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

// 로그인

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
