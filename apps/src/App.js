import {HashRouter, Routes, Route} from 'react-router-dom'
import Main from './component/Main'
import Result from './component/Result'
import NotFound from './component/NotFound'
import Chatting from './component/Chatting'
import { useSelector} from 'react-redux';


function App(props) {
  const logInData = useSelector( state => state.INSERT_SESSION)
  //console.log('app login data : ',logInData)
  return (
    <HashRouter>
      <Routes>
        <Route path="/"  element={<Main {...props}/>} ></Route>
        <Route path="/result" element={ logInData.id.length > 0 ? <Result {...props}/> : <NotFound {...props}/> } ></Route>
        <Route path="/chatting" element={ logInData.id.length > 0 ? <Chatting {...props}/> : <NotFound {...props}/> } ></Route>
        <Route path="*" element={<NotFound {...props}/>} ></Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
