const FriendPages = {
    inbox: 'pages/inbox.html',
    friends: 'pages/Friends_list.html',
};

export async function friendsInit() {
    const friendsMain = document.querySelector('.friends_main');
    const nav2 = document.querySelector('.nav2');
    // Friends화면에서 click마다 nav화면전환
    nav2.addEventListener('click', async (e) => {
        // console.log(e.target);
        const data = await fetch(FriendPages[e.target.id]);
        const html = await data.text();
        friendsMain.innerHTML = html;
        // console.log(html);
    });
}
