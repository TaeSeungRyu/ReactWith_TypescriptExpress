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
//#1. 웹소켓 서버를 생성 합니다
const wss = new ws_1.WebSocketServer({ port: 8001 });
//#6. 소캣객체를 보관 합니다.
const sokets = new Map();
//#7. 방 입니다. index에서 객체를 받아서 사용하게 하였습니다.
let room = null;
exports.room = room;
//#8. 웹소캣 요청에 행동을 하는 클래스 입니다.
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
        let { join, send, _room_id, _id, password, message } = data; //받은 메시지 입니다.
        if (join) {
            //방들어오기 기능이라면
            if (room.get(_room_id).password == password) {
                room.get(_room_id).list.push(_id);
                sokets.get(_id)._room_id = _room_id;
                //누가 들어옴을 방 인원에게 알림니다.
                room.get(_room_id).list.forEach((user) => {
                    sokets.get(user).ws.send(`{"result":"someIn","_id":"${_id}"}`);
                });
            }
            else {
                sokets.get(_id).ws.send(`{"result":"fail"}`);
            }
        }
        else if (send) {
            //단순 메시지 전송이라면
            sokets.forEach((value, key) => {
                //같은 방 식구한테만 메시지를 전송 합니다.
                if (value._room_id === _room_id) {
                    let msgObject = {
                        message: message,
                        _room_id: value._room_id,
                        _id: _id,
                    };
                    value.ws.send(JSON.stringify(msgObject));
                }
            });
        }
        else {
            //단순 테스트 케이스를 위해 만든 조건식 입니다.
            sokets.forEach((value, key) => {
                console.log(`"test": "${JSON.stringify(data)}"`);
                value.ws.send(`"test": "${JSON.stringify(data)}"`);
            });
        }
    }
    getUniqueID() {
        //유니크한 아이디 값을 생성 합니다.
        let s4 = () => {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        };
        return `${s4()}-${s4()}-${s4()}`;
    }
    getParamFromUrl(arg) {
        //웹소켓 url값 에서 파라미터를 분리합니다.(http:x.x.x.x/?a=b) 인 경우 b값을 받습니다.
        if (arg.indexOf("?") >= 0) {
            let data = arg.split(/[?]+/);
            let target = data[1];
            target = target.substring(target.indexOf("=") + 1, target.length);
            return target;
        }
        return arg;
    }
}
__decorate([
    Anno_1.stringToJson //문자형태의 데이터를 json 객체로 파싱하는 에노테이션 입니다.
    ,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RequestWorker.prototype, "todoRequest", null);
//#9. 웹소캣 행동을 정의하는 클래스를 생성 합니다.
const worker = RequestWorker.getInstance();
//#10. 웹소켓 서버가 연결된 경우 행동을 정의 합니다.
wss.on("connection", (ws, req) => {
    const id = worker.getParamFromUrl(req.url);
    sokets.set(id, { ws, _room_id: null }); //최초들어오면 아이디를 저장합니다.
    // 데이터 수신 이벤트는 RequestWorker 클래스에서 처리하게 합니다.
    ws.on("message", worker.todoRequest);
    //연결이 끊긴 경우
    ws.on("close", () => {
        sokets.delete(id); //저장된 아이디의 소캣 객체값을 제거 합니다.
        //생성된 방 에서 해당 인원의 정보를 제거 합니다.
        room.forEach((value, key) => {
            if (value.list.length > 0) {
                value.list = value.list.filter((k) => k != id);
                if (value.list.length > 0) {
                    value.list.forEach((user) => {
                        //남은 인원에게 나감을 알림
                        sokets.get(user).ws.send(`{"result":"someOut","_id":"${id}"}`);
                    });
                }
                room.set(key, value);
            }
        });
    });
});
//#10. 설정 함수 입니다.(index 파일에서 객체를 받기위해 만들었습니다..굳이..ㅋ)
function init(arg) {
    exports.room = room = arg;
    return room;
}
exports.init = init;
let getUniqueID = worker.getUniqueID;
exports.getUniqueID = getUniqueID;
