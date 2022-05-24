import {HashRouter, Routes, Route} from 'react-router-dom'
import Main from './component/Main'
import Result from './component/Result'
import NotFound from './component/NotFound'


function App(props) {
  return (
    <HashRouter>
      <Routes>
        <Route path="/"  element={<Main {...props}/>} ></Route>
        <Route path="/result" element={<Result {...props}/>} ></Route>
        <Route path="*" element={<NotFound {...props}/>} ></Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
