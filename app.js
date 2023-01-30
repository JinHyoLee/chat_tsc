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
db.connect();

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

// 로그인
app.post('/login', (req, res) => {
    console.log(req.body);
    let id = req.body.id;
    let password = req.body.password;

    if (id && password) {
        db.query('select * from usertable where username = ? and password = ?', [id, password], (error, results, fields) => {
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
        db.query('select * from usertable where username = ? and password = ?', [id, password], (error, results, fields) => {
            // 이미 있는 아이디
            if (results.length > 0) {
                res.send({ result: 'Fail' });
            } else {
                // 없을 시 회원가입 완료
                db.query('insert into usertable (username, password) values(?, ?);', [id, password], (error, results, fields) => {
                    res.send({ result: 'OK' });
                });
            }
        });
    } else {
        // 아이디 비밀번호 입력하지 않았을 때
        res.send({ result: 'None' });
    }
});

app.get('/api/rooms', (req, res) => {
    res.json(roomData);
});

// io.on("connection", (socket) => {
//     socket.on("chatting", (data) => {
//         const { name, msg } = data;
//         io.emit("chatting", {
//             name,
//             msg,
//         });
//     });
// });

io.on('connection', (socket) => {
    console.log('a user connected : ', socket.id);
    socket.on('chatting', (data, room) => {
        console.log(`data: ${data.name} ${data.msg},  room: ${room}`);
        socket.to(room).emit('chatting', data);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    // 방 입장
    socket.on('join-room', (id, room) => {
        roomData[room - 1].members.push(id);
        console.log(`${id} join room ${room}`);
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

        console.log(`${id} leave rooom ${room}`);
        socket.to(room).emit('chatting', {
            name: id,
            msg: '님이 퇴장',
        });

        socket.to(room).emit('newmember-join', room, roomData);

        socket.leave(room);
    });
});

server.listen(PORT, () => console.log(`server is running ${PORT}`));
