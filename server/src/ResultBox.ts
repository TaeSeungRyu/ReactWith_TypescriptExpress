import * as request from 'request';
import {stringToJson} from './Anno';


//결과형태 타입 입니다.
type result = {
    statusCode : number,
    statusMessage : string,
    body : string,
    host? : string,
    remoteAddress? : string,
    headers : {
        server : string | string[],
        date : string
    }
};

//유틸 모음용 클래스 입니다.
class Util {
    public parsingResponse (res : request.Response) : result{
        let {statusCode, statusMessage, body , headers : {server, date}, request: {host}, socket: {remoteAddress} }  = res;
        body = body.substring(0, body.length * 0.1)
        return {statusCode, statusMessage, body, headers : {server, date}, host, remoteAddress}
    }

    @stringToJson
    public validUrl(url : string) : string{
        if(url.split('.').length < 1) return '';
        return url;
    }
}

//요청을 전달하고 결과를 받는 클래스 입니다.
class ResultBox extends Util{

    private static singleTon : ResultBox;

    private constructor(){  //생성자를 막습니다.
        super();
    }

    public static getInstance () : ResultBox{  //싱글톤 형식으로 정의 합니다.
        if(!ResultBox.singleTon) ResultBox.singleTon = new ResultBox();
        return ResultBox.singleTon;
    }

    //요청에 따른 결과를 전달 하는 함수 입니다.
    public askToAddress (url : string, calback : Function) : void{
        url = this.validUrl(url);
        if(url == '') {
            calback(null);
            return;
        }

        request.get( url, ( err, res, context) =>{
            if(err) {
                calback(err)
            } else {
                let ress = this.parsingResponse(res);
                calback(ress)
            }
        })        
    }

    //배열형태의 값을 문자로 치환합니다.
    public toString<T>(t : T) : string{
        if(t == null) return '';
        if(t instanceof Array) return t[0];
        return t.toString();
    }
}


export {ResultBox}
export type {result}