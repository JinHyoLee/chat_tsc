const express = require('express');
const http = require('http');
const app = express(); // express 서버 객체
const path = require('path');
const server = http.createServer(app);
const bodyParser = require('body-parser');
const moment = require('moment');

const socketIO = require('socket.io');
const io = socketIO(server);

// db 연결
const mysql = require('mysql');
const db = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'lhj0811!',
    database: 'chat',
});

// db 접속
// db.connect();
// db.end();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'src')));
const PORT = process.env.PORT || 5000;

let roomData = [
    {
        members: [],
        id: '1',
    },
    {
        members: [],
        id: '2',
    },
];

// 로그인 페이지
// 로그인
app.post('/login', (req, res) => {
    // console.log(req.body);
    let id = req.body.id;
    let password = req.body.password;

    if (id && password) {
        db.query('SELECT * FROM usertable WHERE username = ? and password = ?;', [id, password], (err, results) => {
            if (results.length > 0) {
                res.send({ result: 'OK' });
            } else {
                res.send({ result: 'Fail' });
            }
        });
    } else {
        res.send({ result: 'None' });
    }
});

// 회원가입
app.post('/signUp', (req, res) => {
    let id = req.body.id;
    let password = req.body.password;

    if (id && password) {
        db.query('SELECT * FROM usertable WHERE username = ?;', id, (err, results) => {
            // 이미 있는 아이디
            if (results.length > 0) {
                res.send({ result: 'Fail' });
            } else {
                // 없을 시 회원가입 완료
                db.query('INSERT INTO usertable (username, password) VALUES(?, ?);', [id, password], (err, results) => {
                    res.send({ result: 'OK' });
                });
            }
        });
    } else {
        // 아이디 비밀번호 입력하지 않았을 때
        res.send({ result: 'None' });
    }
});

// Users 페이지
// 유저 목록
app.get('/api/users/:userId', (req, res) => {
    const userData2 = [];
    // console.log(req.params);
    // console.log(req.params.userId);

    // 이름, 생성 날짜
    db.query('SELECT username, dateCreated FROM userTable WHERE username != ?;', req.params.userId, (err, results) => {
        results.forEach((item) => {
            const data = {
                id: item.username,
                date: new Date(item.dateCreated).toISOString().substr(0, 10),
            };
            userData2.push(data);
        });
        // console.log(userData2);
    });

    // 친구 수 sql
    const sqlFriendCnt = `SELECT userTable.username, count(friendTable.friendname) AS friendNum
                          FROM userTable
                          JOIN friendTable
                          ON userTable.username = friendTable.username
                          WHERE userTable.username != ?
                          GROUP BY userTable.username;`;

    // 친구 수
    db.query(sqlFriendCnt, req.params.userId, (err, results) => {
        userData2.forEach((item) => {
            let isMatch = false;
            results.forEach((countItem) => {
                if (item.id === countItem.username) {
                    item.friendNum = countItem.friendNum;
                    isMatch = true;
                }
            });
            if (!isMatch) {
                item.friendNum = 0;
            }
        });
        // console.log(userData2);
    });

    // 친구인지 아닌지
    db.query('select * from friendTable where username = ?;', req.params.userId, (err, results) => {
        userData2.forEach((item) => {
            let isMatch = false;
            results.forEach((friendItem) => {
                if (item.id === friendItem.friendname) {
                    item.isFriend = true;
                    isMatch = true;
                }
            });
            if (!isMatch) {
                item.isFriend = false;
            }
        });
        console.log(userData2);
        res.json(userData2);
    });
    // console.log(userData2);
});

// Users 친구 요청
app.get('/api/reqfriends/:userId/:friendId', (req, res) => {
    const userId = req.params.userId;
    const friendId = req.params.friendId;
    // console.log(friendId);
    // console.log(userId);

    // // 친구 요청 추가 sql
    const sqlFriendReqAdd = 'INSERT INTO friendRequests VALUES (?, ?);';

    db.query(sqlFriendReqAdd, [friendId, userId], (err, results) => {
        console.log('친구 요청 목록에서  %s에게 요청 추가', friendId);
        res.send({ result: 'OK' });
    });
});

// Friends페이지

let reqFriendsData = [];

// Friends-수신함 친구 요청 목록
app.get('/api/reqfriends/:userId', (req, res) => {
    let reqFriendsData2 = [];

    // console.log('/api/reqfriends/:userId', req.params);
    const userId = req.params.userId;
    // console.log(userId);
    // 수신함 친구 요청 sql
    const reqFriendsSql = `SELECT userTable.username, userTable.dateCreated
                       FROM friendRequests
                       JOIN userTable
                       ON friendRequests.friendname = userTable.username
                       WHERE friendRequests.username = ?;`;

    db.query(reqFriendsSql, userId, (err, results) => {
        // console.log(results);
        results.forEach((item) => {
            const data = {
                id: item.username,
                date: new Date(item.dateCreated).toISOString().substr(0, 10),
            };
            reqFriendsData2.push(data);
        });
        // console.log(reqFriendsData2);
        res.json(reqFriendsData2);
    });
    // res.json(reqFriendsData);
    // console.log(reqFriendsData);
});

// Friends-수신함 친구 승낙
app.get('/api/acceptfriends/:userId/:friendId', (req, res) => {
    const userId = req.params.userId;
    const reqFriendId = req.params.friendId;
    reqFriendsData = reqFriendsData.filter((item) => item.id !== reqFriendId);
    // console.log(reqFriendId, userId);

    // 친구 요청 삭제 sql
    const delReqFriend = 'DELETE from friendRequests WHERE username = ? and friendname = ?;';

    // 친구 요청 목록 db에서 삭제
    db.query(delReqFriend, [userId, reqFriendId], (err, results) => {
        console.log('친구 요청 목록에서 %s의 요청 삭제', reqFriendId);
    });

    //  친구 추가 sql
    const sqlFriendAdd = 'INSERT INTO friendTable VALUES (?, ?), (?, ?);';

    db.query(sqlFriendAdd, [reqFriendId, userId, userId, reqFriendId], (err, results) => {
        console.log('친구 목록에 %s 추가', reqFriendId);
        res.send({ result: 'OK' });
    });

    // res.send({ result: 'OK' });
});

// Friends-수신함 친구 거절
app.get('/api/rejectfriends/:userId/:friendId', (req, res) => {
    // console.log(req.params);
    const userId = req.params.userId;
    const reqFriendId = req.params.friendId;
    reqFriendsData = reqFriendsData.filter((item) => item.id !== reqFriendId);

    // 친구 요청 삭제 sql
    const delReqFriend = 'DELETE from friendRequests WHERE username = ? and friendname = ?;';

    // 친구 요청 목록 db에서 삭제
    db.query(delReqFriend, [userId, reqFriendId], (err, results) => {
        console.log('친구 요청 목록에서 %s의 요청 삭제', reqFriendId);
        res.send({ result: 'OK' });
    });
});

let friendsData = [];

// Friends-목록 친구 목록
app.get('/api/friends/:userId', (req, res) => {
    let friendsData2 = [];

    const userId = req.params.userId;

    // Friends-목록 친구 목록
    const selFriends = `SELECT friendTable.friendname, userTable.dateCreated
                        FROM friendTable
                        JOIN userTable
                        ON friendTable.username = userTable.username
                        WHERE friendtable.username = ?;`;

    // console.log('/api/friendsData/:userId', req.params);
    db.query(selFriends, userId, (err, results) => {
        // console.log(results);
        results.forEach((item) => {
            const data = {
                id: item.friendname,
                date: new Date(item.dateCreated).toISOString().substr(0, 10),
            };
            friendsData2.push(data);
        });
        // console.log(friendsData2);
        res.json(friendsData2);
    });
});

// 친구 삭제
app.get('/api/deleteFriends/:userId/:friendId', (req, res) => {
    const userId = req.params.userId;
    const delFriendId = req.params.friendId;
    friendsData = friendsData.filter((item) => item.id !== delFriendId);
    // console.log(userId, delFriendId);

    // 친구 목록에서 삭제 sql
    const delFriend = 'DELETE from friendTable WHERE username = ? and friendname = ?;';
    const delFriend2 = 'DELETE from friendTable WHERE friendname = ? and username = ?;';

    // 친구 목록 db에서 삭제
    db.query(delFriend, [userId, delFriendId], (err, results) => {
        db.query(delFriend2, [userId, delFriendId], (err, results) => {
            console.log('서로의 친구 목록에서 %s와 %s 삭제', userId, delFriendId);
            res.send({ result: 'OK' });
        });
        // console.log('서로의 친구 목록에서 %s 삭제', delFriendId);
        // res.send({ result: 'OK' });
    });
});

app.get('/api/rooms', (req, res) => {
    res.json(roomData);
});

// socket 통신
io.on('connection', (socket) => {
    // console.log('a user connected : ', socket.id);
    socket.on('chatting', (data, room) => {
        // console.log(`data: ${data.name} ${data.msg},  room: ${room}`);
        socket.to(room).emit('chatting', data);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    // 방 입장
    socket.on('join-room', (id, room) => {
        roomData[room - 1].members.push(id);
        // console.log(`${id} join room ${room}`);
        socket.join(room);
        socket.to(room).emit('chatting', {
            name: id,
            msg: '님이 입장',
        });

        socket.to(room).emit('newmember-join', room, roomData);
    });

    socket.on('disconnecting', () => {
        socket.rooms.forEach((room) =>
            socket.to(room).emit({
                name: 'unknown',
                msg: '님의 연결이 해제되었습니다.',
            })
        );
    });

    // 방 퇴장
    socket.on('leave-room', (id, room) => {
        roomData[room - 1].members = roomData[room - 1].members.filter((element) => element !== id);

        // console.log(`${id} leave rooom ${room}`);
        socket.to(room).emit('chatting', {
            name: id,
            msg: '님이 퇴장',
        });

        socket.to(room).emit('newmember-join', room, roomData);

        socket.leave(room);
    });
});

server.listen(PORT, () => console.log(`server is running ${PORT}`));
