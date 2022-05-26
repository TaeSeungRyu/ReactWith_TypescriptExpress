"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const chatting_1 = require("./chatting");
const bodyParser = require("body-parser");
//#1. 서버 기본 설정 입니다.
//익스프레스 객체 입니다.
const app = express();
console.log(chatting_1.room);
//뷰 설정 입니다.
app.set("views", "D:/reactWithApp/server/html");
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
//post 파라미터 파싱부분 입니다.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}));
//화면 페이지로 이동시킵니다.
app.all("/", (req, res) => {
    res.render("index.html", { title: "Welcome" });
});
//#2. 간단하게 구현한 로그인 관련 내용 입니다. ----------------
//데이터 베이스용 map 객체 입니다.
const db = new Map();
app.all("/data/joinOrLogIn", (req, res) => {
    let { id, password, join } = req.body;
    console.log(id, password, join);
    id = id.toString();
    if (join) {
        //회원가입
        if (!db.get(id)) {
            db.set(id, password);
            res.set(id, password.toString());
            res.send({ result: "OK" });
        }
        else {
            res.send({ result: "ID IS EXSIST" });
        }
    }
    else {
        //로그인
        if (!db.get(id)) {
            res.send({ result: "no member" });
        }
        else if (db.get(id) && db.get(id) != password) {
            res.send({ result: "wrong password" });
        }
        else {
            res.send({ result: "OK" });
        }
    }
});
//#2. end ----------------
app.listen(4885, () => {
    console.log("실행중");
});
