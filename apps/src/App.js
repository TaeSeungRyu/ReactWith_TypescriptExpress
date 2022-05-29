import {HashRouter, Routes, Route} from 'react-router-dom'
import Main from './component/Main'
import ChattingList from './component/ChattingList'
import NotFound from './component/NotFound'
import Chatting from './component/Chatting'
import { useSelector} from 'react-redux';

//라우팅을 담당하는 App 함수 입니다.
function App(props) {
  const logInData = useSelector( state => state.INSERT_SESSION)  //로그인 여부에 대한 레덕스 입니다. ChattingList와 Chatting 컴포넌트에 대한 접근을 제한합니다.
  return (
    <HashRouter>
      <Routes>
        <Route path="/"  element={<Main {...props}/>} ></Route>
        <Route path="/ChattingList" element={ logInData.id.length > 0 ? <ChattingList {...props}/> : <NotFound {...props}/> } ></Route>
        <Route path="/chatting" element={ logInData.id.length > 0 ? <Chatting {...props}/> : <NotFound {...props}/> } ></Route>
        <Route path="*" element={<NotFound {...props}/>} ></Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
