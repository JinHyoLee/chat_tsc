const express = require("express");
const http = require("http");
const app = express(); // express 서버 객체
const path = require("path");
const server = http.createServer(app);
const socketIO = require("socket.io");
const bodyParser_post = require("body-parser");

const io = socketIO(server);

app.set("port", 3000);

app.use(express.static(path.join(__dirname, "src")));
// const PORT = process.env.PORT || 5000;

// io.on("connection", (socket) => {
//     socket.on("chatting", (data) => {
//         const { name, msg } = data;
//         io.emit("chatting", {
//             name,
//             msg,
//             time: moment(new Date()).format("h:mm A"),
//         });
//     });
// });

server.listen(PORT, () => console.log(`server is running ${PORT}`));
