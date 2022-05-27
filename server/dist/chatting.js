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
exports.getUniqueID = exports.room = exports.init = void 0;
const ws_1 = require("ws");
const Anno_1 = require("./Anno");
// 웹소켓 서버 생성
const wss = new ws_1.WebSocketServer({ port: 8001 });
//소캣객체를 보관 합니다.
const sokets = new Map();
//방 입니다.
let room = null;
exports.room = room;
class RequestWorker {
    RequestWorker() { }
    static getInstance() {
        //싱글톤 형식으로 정의 합니다.
        console.log("init!");
        if (!RequestWorker.singleTon)
            RequestWorker.singleTon = new RequestWorker();
        return RequestWorker.singleTon;
    }
    todoRequest(data) {
        console.log("data::: ", data);
        if (data.join) {
            //방들어오기 기능이라면
            let joinRoom = data;
            if (room.get(joinRoom._room_id).password == joinRoom.password) {
                room.get(joinRoom._room_id).list.push(joinRoom._id);
                sokets.get(joinRoom._id)._room_id = joinRoom._room_id;
                sokets.get(joinRoom._id).ws.send(`{"result":"join_succ"}`);
            }
            else {
                sokets.get(joinRoom._id).ws.send(`{"result":"fail"}`);
            }
        }
        else if (data.send) {
            //단순 메시지 전송이라면
            let msg = data;
            sokets.forEach((value, key) => {
                //같은 방 식구한테만 메시지를 전송 합니다.
                if (value._room_id === msg._room_id) {
                    let msgObject = { message: msg.message, _room_id: value._room_id };
                    value.ws.send(JSON.stringify(msgObject));
                }
            });
        }
        else {
            sokets.forEach((value, key) => {
                value.ws.send(`"test": "${JSON.stringify(data)}"`);
            });
        }
    }
    getUniqueID() {
        let s4 = () => {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        };
        return `${s4()}-${s4()}-${s4()}`;
    }
    getParamFromUrl(arg) {
        if (arg.indexOf("?") >= 0) {
            let data = arg.split(/[?]+/);
            let target = data[1];
            target = target.substring(target.indexOf("="), target.length);
            return target;
        }
        console.log("wtf");
        return arg;
    }
}
__decorate([
    Anno_1.stringToJson,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RequestWorker.prototype, "todoRequest", null);
//웹소캣 행동을 정의하는 클래스 입니다.
const worker = RequestWorker.getInstance();
wss.on("connection", (ws, req) => {
    const id = worker.getUniqueID();
    ws.send(`{"id":"${id}"}`); //최초들어오면 아이디를 발급해줍니다.
    console.log("req url : ", req.url, worker.getParamFromUrl(req.url));
    sokets.set(id, { ws, _room_id: null });
    // 데이터 수신 이벤트 바인드
    ws.on("message", worker.todoRequest);
    ws.on("close", () => {
        sokets.delete(id);
        room.forEach((value, key) => {
            //브라우저 끄고 나가면
            if (value.list.length > 0) {
                value.list = value.list.filter((k) => k != id);
                room.set(key, value);
            }
        });
    });
});
function init(arg) {
    exports.room = room = arg;
    return room;
}
exports.init = init;
let getUniqueID = worker.getUniqueID;
exports.getUniqueID = getUniqueID;
