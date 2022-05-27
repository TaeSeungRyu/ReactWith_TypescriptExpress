import React, { useEffect }  from 'react'
import { useDispatch, useSelector} from 'react-redux';
import {INSERT_ROOM} from '../state/Room';
import { useForm } from "react-hook-form"
import axios from 'axios'
import {useNavigate} from 'react-router-dom'

function Result() {

  const { register, handleSubmit, getValues } = useForm();

  const dispatch = useDispatch();
  const ROOMS = useSelector( state => state.INSERT_ROOMS);  //채팅방
  const logInData = useSelector( state => state.INSERT_SESSION);  //로그인 정보


  //최초 등록된 방 목록을 가져 옵니다.
  useEffect(()=>{  
    axios.post('data/getRoomList', {}).then(arg=>{
       console.log(arg.data)
       if(arg.data && arg.data.length > 0 )dispatch(INSERT_ROOM({item : arg.data}))
    })   
  }, [dispatch])

  //방만들기 버튼기능 함수 입니다.
  const createRoom = ()=>{
    let param = getValues();
    param._id = logInData.id
    console.log(param)
    axios.post('data/createRoom', param).then(arg=>{
      console.log(arg.data)
      axios.post('data/getRoomList', {}).then(arg=>{
        console.log(arg.data)
        if(arg.data && arg.data.length > 0 )dispatch(INSERT_ROOM({item : arg.data}))
     })         
   })       
  } 

  const setRoomPwd = (event, value)=>{
    value.comparePwd = event.target.value;
  }

  const navigate = useNavigate();
  const accessRoom = (event, value)=>{
    console.log(event, value)
    if(value.comparePwd === value.password){
      setTimeout(()=> navigate('/chatting',{ state : {value, _id : logInData.id} }) ,10)
    }
  }

  return (
    <div className='container'>   
      <div className='h2'>여기는 방 목록 페이지 입니다.</div>   
      <form onSubmit={handleSubmit(createRoom)} className='col-md-12 border m-4' >
        <span className='h6'> * 방만들기</span>
        <input type='text' name='kor' {...register('kor')} className='form-control' placeholder='방이름'  />
        <input type='text' name='password' {...register('password')} className='form-control' placeholder='비번'/>
        <button type='submit' className='btn btn-warning'>만들어져라</button>
      </form>
      <div>

        <div></div>

        {
          ROOMS && ROOMS.length > 0 && ROOMS.map( value => 
          <div key={value._room_id}>
            <div>{value.kor}</div>
            <input type='text' value={value.comparePwd} placeholder='비밀번호 입력' onChange={(event)=> setRoomPwd(event, value)}/>
            <input type='button' value='방들어가기' onClick={ (event)=> accessRoom(event, value) }/>
          </div> )
        }


      </div>
    </div>
  );
}

export default Result;
