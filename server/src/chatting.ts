import { WebSocket, WebSocketServer } from "ws";
import { stringToJson } from "./Anno";

// 웹소켓 서버 생성
const wss = new WebSocketServer({ port: 8001 });
//소캣객체를 보관 합니다.
const map = new Map<string, any>();
//방 관련 타입 입니다.
type roomT = {
  kor: string;
  password: string;
  _id?: string;
  _room_id: string;
  list?: Array<string>;
}; //룸 데이터 형 지정
const room = new Map<any, roomT>();
//메시지 입니다.
type message = { _id: string; message: string };

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
    //data가 방만들기인지, 챗 메시지인지 구분할 필요가 있습니다.
    if (data.create) {
      //방만들기면 캐스팅!
      let createRoom: roomT = data.create;
      let rommId = this.getUniqueID();
      let array = new Array();
      array.push(createRoom._id); //방 만든사람 아이디 넣기
      room.set(rommId, {
        kor: createRoom.kor,
        password: createRoom.password,
        _room_id: rommId,
        list: array,
      });
    } else if (data.join) {
      //방들어오기 기능이라면
      let joinRoom: roomT = data.join;
      if (room.get(joinRoom._room_id).password == joinRoom.password) {
        room.get(joinRoom._room_id).list.push(joinRoom._id);
        map.get(joinRoom._id).ws.send(`{result:succ}`);
      } else {
        map.get(joinRoom._id).ws.send(`{result:fail}`);
      }
    } else if (data.send) {
      //단순 메시지 전송이라면
      let msg: message = data.send;
      map.forEach((value: any, key: any) => {
        if (key == msg._id) {
          //같은 방 식구한테만 메시지를 전송 합니다.
          value.ws.send(msg);
        }
      });
    }
  }

  getUniqueID() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return `${s4()}-${s4()}-${s4()}`;
  }
}

//웹소캣 행동을 정의하는 클래스 입니다.
const worker = RequestWorker.getInstance();

wss.on("connection", (ws: WebSocket) => {
  const id = worker.getUniqueID();
  map.set(id, { ws });

  // 데이터 수신 이벤트 바인드
  ws.on("message", worker.todoRequest);

  ws.on("close", () => {
    map.delete(id);

    room.forEach((value: roomT, key: any) => {
      //브라우저 끄고 나가면
      if (value.list.length > 0) {
        value.list = value.list.filter((k) => k != id);
        room.set(key, value);
      }
    });
  });
});

export { room };

//방 나가기, 브라우저 끄기 이벤트//방 나가기, 브라우저 끄기 이벤트
//방 나가기, 브라우저 끄기 이벤트//방 나가기, 브라우저 끄기 이벤트

/*

// 웹소켓 서버 생성
const wss = new WebSocketServer({ port: 8001 });

let getUniqueID = function () {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + "-" + s4();
};

// 웹소켓 서버 연결 이벤트 바인드
const map = new Map<any, any>();

wss.on("connection", (ws: WebSocket) => {
  const id = getUniqueID();
  map.set(id, { ws, room: null });

  //client.send(`새로운 유저가 접속했습니다. 현재 유저 ${wss.clients.size} 명`)

  console.log(`client on : ${wss.clients.size}`);

  // 데이터 수신 이벤트 바인드
  ws.on("message", RequestWorker.todoRequest);

  //   wss.clients.forEach((client: any) => {
  //     console.log(client.id);
  //   });

  ws.on("close", () => {
    console.log(`client after : ${wss.clients.size}`);
  });
});

class RequestWorker {
  private RequestWorker() {}
  private static singleTon: RequestWorker;
  public static getInstance(): RequestWorker {
    //싱글톤 형식으로 정의 합니다.
    if (!RequestWorker.singleTon) RequestWorker.singleTon = new RequestWorker();
    return RequestWorker.singleTon;
  }

  @stringToJson
  static todoRequest(data) {
    //console.log(`Received from user: ${data}`);
    map.forEach((value: any, key: any) => {
      console.log(key);
      value.ws.send(`hello : ${data}`);
    });
  }
}


*/
