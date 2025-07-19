"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
//global object
let userCount = 0;
//global array
let allSockets = [];
//here socket ued to receive the request and send the request
wss.on("connection", (socket) => {
    socket.on("message", (message) => {
        //BSICALLY WE WILL GET A STRING as a meaage
        //@ts-ignore
        const parsedMessage = JSON.parse(message);
        if (parsedMessage.type === "join") {
            console.log("user join");
            allSockets.push({
                socket,
                room: parsedMessage.payload.roomId
            });
        }
        if (parsedMessage.type === "chat") {
            console.log("chat:" + parsedMessage.payload.message);
            let currentuserRoom = null;
            for (let i = 0; i < allSockets.length; i++) {
                if (allSockets[i].socket == socket) {
                    currentuserRoom = allSockets[i].room;
                }
            }
            //send message to all
            for (let i = 0; i < allSockets.length; i++) {
                if (allSockets[i].room == currentuserRoom) {
                    allSockets[i].socket.send(parsedMessage.payload.message);
                }
            }
        }
    });
});
