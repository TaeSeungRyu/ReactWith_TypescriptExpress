"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const ws_1 = require("ws");
const Anno_1 = require("./Anno");
//익스프레스 객체 입니다.
const app = express();
//뷰 설정 입니다.
app.set('views', 'D:/reactWithApp/server/html');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
//화면 페이지로 이동시킵니다.
app.all('/', (req, res) => {
    res.render('index.html', { title: 'Welcome' });
});
app.listen(4885, () => {
    console.log('실행중');
});
// 웹소켓 서버 생성
const wss = new ws_1.WebSocketServer({ port: 8001 });
let getUniqueID = function () {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4();
};
// 웹소켓 서버 연결 이벤트 바인드
let map = new Map();
wss.on("connection", (ws) => {
    const id = getUniqueID();
    map.set(id, ws);
    //client.send(`새로운 유저가 접속했습니다. 현재 유저 ${wss.clients.size} 명`)
    console.log(`client on : ${wss.clients.size}`);
    // 데이터 수신 이벤트 바인드
    ws.on("message", aaa.todoRequest);
    wss.clients.forEach((client) => {
        console.log(client.id);
    });
    ws.on("close", () => {
        console.log(`client after : ${wss.clients.size}`);
    });
});
class aaa {
    static todoRequest(data) {
        console.log(`Received from user: ${data}`);
        //ws.send(`Received ${data}`) // 서버의 답장
        map.forEach((value, key) => {
            console.log(key);
            value.send(`hello : ${data}`);
        });
    }
}
__decorate([
    Anno_1.stringToJson,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], aaa, "todoRequest", null);
