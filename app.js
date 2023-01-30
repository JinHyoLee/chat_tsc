const express = require("express");
const http = require("http");
const app = express(); // express 서버 객체
const path = require("path");
const server = http.createServer(app);
const bodyParser = require("body-parser");
const moment = require("moment");

const socketIO = require("socket.io");
const io = socketIO(server);

// db 연결
const mysql = require("mysql");
const db = mysql.createConnection({
    host: "localhost",
    port: "3306",
    user: "root",
    password: "lhj0811!",
    database: "chat",
});

// db 접속
db.connect();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "src")));
const PORT = process.env.PORT || 5000;

// 로그인
app.post("/login", (req, res) => {
    console.log(req.body);
    let id = req.body.id;
    let password = req.body.password;

    if (id && password) {
        db.query("select * from usertable where username = ? and password = ?", [id, password], (error, results, fields) => {
            if (results.length > 0) {
                res.send({ result: "OK" });
            } else {
                res.send({ result: "Fail" });
            }
        });
    } else {
        res.send({ result: "None" });
    }
});

// 회원가입
app.post("/signUp", (req, res) => {
    let id = req.body.id;
    let password = req.body.password;

    if (id && password) {
        db.query("select * from usertable where username = ? and password = ?", [id, password], (error, results, fields) => {
            // 이미 있는 아이디
            if (results.length > 0) {
                res.send({ result: "Fail" });
            } else {
                // 없을 시 회원가입 완료
                db.query("insert into usertable (username, password) values(?, ?);", [id, password], (error, results, fields) => {
                    res.send({ result: "OK" });
                });
            }
        });
    } else {
        // 아이디 비밀번호 입력하지 않았을 때
        res.send({ result: "None" });
    }
});

app.get("/api/rooms", (req, res) => {
    res.json([
        {
            members: ["tony", "sam"],
            id: "1",
        },
        {
            members: [],
            id: "2",
        },
    ]);
});

io.on("connection", (socket) => {
    socket.on("chatting", (data) => {
        const { name, msg } = data;
        io.emit("chatting", {
            name,
            msg,
        });
    });
});

server.listen(PORT, () => console.log(`server is running ${PORT}`));
