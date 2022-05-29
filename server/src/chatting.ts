import { WebSocket, WebSocketServer } from "ws";
import { IncomingMessage } from "http";
import { stringToJson } from "./Anno";

//#1. 웹소켓 서버를 생성 합니다
const wss = new WebSocketServer({ port: 8001 });

//#2. 소캣 객체 타입 입니다.
type soketT = {
  ws: WebSocket; //웹소캣 객체 입니다.
  _room_id: string; //방 키값 입니다.
};

//#3. 방 관련 타입 입니다.
type roomT = {
  kor: string; //방이름 입니다.
  password: string; //방 미빌번호 입니다.
  _id?: string; //만든사람 아이디 입니다.
  _room_id: string; //실제 사용될 방키값 입니다.
  list?: Array<string>; //방에들어온 유저목록 입니다.
  showId?: string; //외부에서 사용되는 실제 아이디 입니다.
  join?: string; //방에 들어오는 경우입니다.
  send?: string; //메시지를 보내는 경우 입니다.
};

//#4. 메시지 타입 입니다.
type message = { _id: string; message: string; _room_id: string };

//#5. 3번과 4번의 마스터 타입 입니다.
type roomAndMsg = roomT & message;

//#6. 소캣객체를 보관 합니다.
const sokets = new Map<string, soketT>();

//#7. 방 입니다. index에서 객체를 받아서 사용하게 하였습니다.
let room: Map<string, roomT> = null;

//#8. 웹소캣 요청에 행동을 하는 클래스 입니다.
class RequestWorker {
  private RequestWorker() {}
  private static singleTon: RequestWorker;
  public static getInstance(): RequestWorker {
    //싱글톤 형식으로 정의 합니다.
    console.log("init!");
    if (!RequestWorker.singleTon) RequestWorker.singleTon = new RequestWorker();
    return RequestWorker.singleTon;
  }

  @stringToJson //문자형태의 데이터를 json 객체로 파싱하는 에노테이션 입니다.
  todoRequest(data: any): void {
    let { join, send, _room_id, _id, password, message }: roomAndMsg = data; //받은 메시지 입니다.

    if (join) {
      //방들어오기 기능이라면
      if (room.get(_room_id).password == password) {
        room.get(_room_id).list.push(_id);
        sokets.get(_id)._room_id = _room_id;
        //누가 들어옴을 방 인원에게 알림니다.
        room.get(_room_id).list.forEach((user) => {
          sokets.get(user).ws.send(`{"result":"someIn","_id":"${_id}"}`);
        });
      } else {
        sokets.get(_id).ws.send(`{"result":"fail"}`);
      }
    } else if (send) {
      //단순 메시지 전송이라면
      sokets.forEach((value: soketT, key: any) => {
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
    } else {
      //단순 테스트 케이스를 위해 만든 조건식 입니다.
      sokets.forEach((value: soketT, key: any) => {
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

  getParamFromUrl(arg: string) {
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

//#9. 웹소캣 행동을 정의하는 클래스를 생성 합니다.
const worker = RequestWorker.getInstance();

//#10. 웹소켓 서버가 연결된 경우 행동을 정의 합니다.
wss.on("connection", (ws: WebSocket, req: IncomingMessage) => {
  const id = worker.getParamFromUrl(req.url);
  sokets.set(id, { ws, _room_id: null }); //최초들어오면 아이디를 저장합니다.

  // 데이터 수신 이벤트는 RequestWorker 클래스에서 처리하게 합니다.
  ws.on("message", worker.todoRequest);

  //연결이 끊긴 경우
  ws.on("close", () => {
    sokets.delete(id); //저장된 아이디의 소캣 객체값을 제거 합니다.

    //생성된 방 에서 해당 인원의 정보를 제거 합니다.
    room.forEach((value: roomT, key: any) => {
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
function init(arg: Map<string, roomT>) {
  room = arg;
  return room;
}

let getUniqueID = worker.getUniqueID;

export { init, room, getUniqueID };
export type { roomT };
