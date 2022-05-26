import React, { useEffect, useState }   from 'react'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import {useDispatch} from 'react-redux';
import {UPDATE_SESSION} from '../state/Session' 

function Main(arg) {
  const navigate = useNavigate();
  const [ id, setId ] = useState("") 
  const [ pwd, setPassword ] = useState("") 

  const onId = ({target: {name, value}})=> setId(value);
  const setPwd = ({target: {name, value}})=> setPassword(value);

  const dispatch = useDispatch()

  useEffect(()=>{  

  }, [dispatch])



  const logInOrJoin = ({target: {name, value}})=>{
    let param = { id, password:pwd };
    if(name === 'join') param.join = 'join';

    axios.post('data/joinOrLogIn', param).then(arg=>{
      let {result} = arg.data;
      if(result === 'OK'){
        alert('성공!')
        dispatch(UPDATE_SESSION({ _id:id}))
        setTimeout(()=> navigate('/result',{ state : {param} }) ,10)
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
