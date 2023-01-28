const express = require("express");
const http = require("http");
const app = express(); // express 서버 객체
const path = require("path");
const server = http.createServer(app);
const bodyParser = require("body-parser");
const moment = require("moment");

const socketIO = require("socket.io");
const io = socketIO(server);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "src")));
const PORT = process.env.PORT || 5000;

app.post("/api/login", (req, res) => {
    console.log("POST api");
    console.log(req.body);
    let id = req.body.id;
    let password = req.body.password;
    if (id === "abc" && password === "123") {
        res.send({ result: "OK" });
    } else {
        res.send({ result: "NO" });
    }
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
