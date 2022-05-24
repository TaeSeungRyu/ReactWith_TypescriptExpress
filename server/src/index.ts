import * as express from 'express';

import  {ResultBox}  from './ResultBox';
import type {result} from './ResultBox';


//익스프레스 객체 입니다.
const app : express.Application = express();
const box = ResultBox.getInstance();

//뷰 설정 입니다.
app.set('views',  'D:/reactWithApp/server/html' );
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');


//화면 페이지로 이동시킵니다.
app.all('/', (req: express.Request, res: express.Response) => {
    res.render('index.html',{title:'Welcome'});
});

//데이터 질의를 위한 응답 정의 입니다.
app.all('/ask', (req: express.Request, res: express.Response) => {
    let query = box.toString(req.query.url);
    box.askToAddress(query, (ress : result)=>{
        if(ress){
            res.send(ress)
        } else {
            res.send({error : ' parameter key "url" must be in request '})
        }  
    })
});


app.listen(4885, () => {
    console.log('실행중');
});  



