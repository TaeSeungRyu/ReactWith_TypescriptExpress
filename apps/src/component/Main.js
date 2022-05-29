import React, { useEffect, useState }   from 'react'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import {useDispatch} from 'react-redux';
import {UPDATE_SESSION} from '../state/Session' 

function Main(arg) {
  const navigate = useNavigate();

  //아이디와 비밀번호에 대해서 상태를 관리 합니다.
  const [ id, setId ] = useState("") 
  const [ pwd, setPassword ] = useState("") 

  //아이디, 비밀번호가 바뀐경우에 대한 이벤트 정의 입니다(나중에 hook처럼 라이브러리를 써도 좋을 것 같습니다.)
  const onId = ({target: {name, value}})=> setId(value);
  const setPwd = ({target: {name, value}})=> setPassword(value);

  const dispatch = useDispatch()

  useEffect(()=>{  

  }, [dispatch])

  /*
    로그인과 회원가입 둘다 담당 합니다.
    회원가입을 하는 경우에 서버에서 간단한 중복체크를 하게 되어 있습니다.
    회원가입이 되면 바로 로그인 됩니다.
    아주 단순하게 만든 로그인, 회원가입 기능 입니다. ^^
  */
  const logInOrJoin = ({target: {name, value}})=>{
    let param = { id, password:pwd };
    if(name === 'join') param.join = 'join';

    axios.post('data/joinOrLogIn', param).then(arg=>{  
      let {result} = arg.data;
      if(result === 'OK'){
        alert('성공!')
        dispatch(UPDATE_SESSION({ _id:id}))
        setTimeout(()=> navigate('/ChattingList',{ state : {param} }) ,10)
      } else{
        alert(`실패 : ${result}`)
      }
    })    

  }

  return (
    <div className='container'>

      <div className='row'>
        <span>id</span> : <input type='text' onChange={onId} value={id} className='form-control'/>
      </div>

      <div className='row'>
        <span>pwd</span> : <input type='text' onChange={setPwd} value={pwd} className='form-control'/>
      </div>    

      <div className='row'>
        <button type='button' onClick={logInOrJoin} name='logIn' className='btn btn-info'>로그인</button>
        <button type='button' onClick={logInOrJoin} name='join'  className='btn btn-success'>가입</button>
      </div> 
      
    </div>
  );
}

export default Main;
