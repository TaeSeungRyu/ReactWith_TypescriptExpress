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
exports.ResultBox = void 0;
const request = require("request");
const Anno_1 = require("./Anno");
//유틸 모음용 클래스 입니다.
class Util {
    parsingResponse(res) {
        let { statusCode, statusMessage, body, headers: { server, date }, request: { host }, socket: { remoteAddress }, } = res;
        body = body.substring(0, body.length * 0.1);
        return {
            statusCode,
            statusMessage,
            body,
            headers: { server, date },
            host,
            remoteAddress,
        };
    }
    validUrl(url) {
        if (url.split(".").length < 1)
            return "";
        return url;
    }
}
__decorate([
    Anno_1.stringToJson,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", String)
], Util.prototype, "validUrl", null);
//요청을 전달하고 결과를 받는 클래스 입니다.
class ResultBox extends Util {
    constructor() {
        //생성자를 막습니다.
        super();
    }
    static getInstance() {
        //싱글톤 형식으로 정의 합니다.
        if (!ResultBox.singleTon)
            ResultBox.singleTon = new ResultBox();
        return ResultBox.singleTon;
    }
    //요청에 따른 결과를 전달 하는 함수 입니다.
    askToAddress(url, calback) {
        url = this.validUrl(url);
        if (url == "") {
            calback(null);
            return;
        }
        request.get(url, (err, res, context) => {
            if (err) {
                calback(err);
            }
            else {
                let ress = this.parsingResponse(res);
                calback(ress);
            }
        });
    }
    //배열형태의 값을 문자로 치환합니다.
    toString(t) {
        if (t == null)
            return "";
        if (t instanceof Array)
            return t[0];
        return t.toString();
    }
}
exports.ResultBox = ResultBox;
