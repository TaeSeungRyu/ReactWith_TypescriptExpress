import { WebSocket, WebSocketServer } from "ws";
import { IncomingMessage } from "http";
import { stringToJson } from "./Anno";

// 웹소켓 서버 생성
const wss = new WebSocketServer({ port: 8001 });

//소캣 객체 타입 입니다.
type soketT = {
  ws: WebSocket; //웹소캣 객체 입니다.
  _room_id: string; //방 키값 입니다.
};

//방 관련 타입 입니다.
type roomT = {
  kor: string; //방이름 입니다.
  password: string; //방 미빌번호 입니다.
  _id?: string; //만든사람 아이디 입니다.
  _room_id: string; //실제 사용될 방키값 입니다.
  list?: Array<string>; //방에들어온 유저목록 입니다.
  showId?: string; //외부에서 사용되는 실제 아이디 입니다.
};

//메시지 타입 입니다.
type message = { _id: string; message: string; _room_id: string };

//소캣객체를 보관 합니다.
const sokets = new Map<string, soketT>();

//방 입니다.
let room: Map<string, roomT> = null;

class RequestWorker {
  private RequestWorker() {}
  private static singleTon: RequestWorker;
  public static getInstance(): RequestWorker {
    //싱글톤 형식으로 정의 합니다.
    console.log("init!");
    if (!RequestWorker.singleTon) RequestWorker.singleTon = new RequestWorker();
    return RequestWorker.singleTon;
  }

  @stringToJson
  todoRequest(data: any): void {
    //console.log("data::: ", data);
    if (data.join) {
      //방들어오기 기능이라면
      let joinRoom: roomT = data;
      if (room.get(joinRoom._room_id).password == joinRoom.password) {
        room.get(joinRoom._room_id).list.push(joinRoom._id);
        sokets.get(joinRoom._id)._room_id = joinRoom._room_id;

        //누가 들어옴을 방 인원에게 알림니다.
        room.get(joinRoom._room_id).list.forEach((user) => {
          sokets
            .get(user)
            .ws.send(`{"result":"someIn","user":"${joinRoom._id}"}`);
        });
      } else {
        sokets.get(joinRoom._id).ws.send(`{"result":"fail"}`);
      }
    } else if (data.send) {
      //단순 메시지 전송이라면
      let msg: message = data;
      sokets.forEach((value: soketT, key: any) => {
        //같은 방 식구한테만 메시지를 전송 합니다.
        if (value._room_id === msg._room_id) {
          let msgObject = { message: msg.message, _room_id: value._room_id };
          value.ws.send(JSON.stringify(msgObject));
        }
      });
    } else {
      sokets.forEach((value: soketT, key: any) => {
        console.log(`"test": "${JSON.stringify(data)}"`);
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

  getParamFromUrl(arg: string) {
    if (arg.indexOf("?") >= 0) {
      let data = arg.split(/[?]+/);
      let target = data[1];
      target = target.substring(target.indexOf("=") + 1, target.length);
      return target;
    }
    return arg;
  }
}

//웹소캣 행동을 정의하는 클래스 입니다.
const worker = RequestWorker.getInstance();

wss.on("connection", (ws: WebSocket, req: IncomingMessage) => {
  const id = worker.getParamFromUrl(req.url);
  sokets.set(id, { ws, _room_id: null });

  //ws.send(`{"id":"${id}","youIn":"true"}`); //최초들어오면 아이디를 저장합니다.

  // 데이터 수신 이벤트 바인드
  ws.on("message", worker.todoRequest);

  ws.on("close", () => {
    sokets.delete(id);

    room.forEach((value: roomT, key: any) => {
      //브라우저 끄고 나가면
      if (value.list.length > 0) {
        value.list = value.list.filter((k) => k != id);
        if (value.list.length > 0) {
          value.list.forEach((user) => {
            //남은 인원에게 나감을 알림
            sokets.get(user).ws.send(`{"result":"someOut","user":"${id}"}`);
          });
        }
        room.set(key, value);
      }
    });
  });
});

function init(arg: Map<string, roomT>) {
  room = arg;
  return room;
}

let getUniqueID = worker.getUniqueID;

export { init, room, getUniqueID };
export type { roomT };
