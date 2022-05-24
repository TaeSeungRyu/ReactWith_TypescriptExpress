import * as express from "express";
import { WebSocket, WebSocketServer } from "ws";

import { stringToJson } from "./Anno";

//익스프레스 객체 입니다.
const app: express.Application = express();

//뷰 설정 입니다.
app.set("views", "D:/reactWithApp/server/html");
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

//화면 페이지로 이동시킵니다.
app.all("/", (req: express.Request, res: express.Response) => {
  res.render("index.html", { title: "Welcome" });
});

app.listen(4885, () => {
  console.log("실행중");
});

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
  map.set(id, ws);

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
  @stringToJson
  static todoRequest(data) {
    console.log(`Received from user: ${data}`);
    map.forEach((value: WebSocket, key: any) => {
      console.log(key);

      value.send(`hello : ${data}`);
    });
  }
}
