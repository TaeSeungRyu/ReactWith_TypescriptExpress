import React, { useEffect }  from 'react'
import { useDispatch, useSelector} from 'react-redux';
import {INSERT_ROOM} from '../state/Room';
import { useForm } from "react-hook-form"
import axios from 'axios'
import {useNavigate} from 'react-router-dom'

function ChattingList() {

  const { register, handleSubmit, getValues } = useForm();  //useFomr을 한번 사용하여 보았습니다.

  const dispatch = useDispatch();
  const ROOMS = useSelector( state => state.INSERT_ROOMS);  //채팅방
  const logInData = useSelector( state => state.INSERT_SESSION);  //로그인 정보


  //최초 등록된 방 목록을 가져 옵니다.
  useEffect(()=>{  
    axios.post('data/getRoomList', {}).then(arg=>{
       if(arg.data && arg.data.length > 0 ) dispatch(INSERT_ROOM({item : arg.data}))
    })   
  }, [dispatch])

  //방만들기 버튼기능 함수 입니다.
  const createRoom = ()=>{
    let param = getValues();
    param._id = logInData.id
    axios.post('data/createRoom', param).then(arg=>{  //방을 만들고
      axios.post('data/getRoomList', {}).then(arg=>{ // 혹시 다른사람도 만들었을 수 있으니 방 목록을 다시 가져옵니다.
        console.log(arg.data)
        if(arg.data && arg.data.length > 0 )dispatch(INSERT_ROOM({item : arg.data}))
     })         
   })       
  } 

  //각각 만들어진 채팅방에서 방에 들어가기 위해 비밀번호를 입력할 때 데이터를 대입하기 위한 함수 입니다.
  const setRoomPwd = (event, value)=>{
    value.comparePwd = event.target.value;
  }

  //방 들어가기 함수 입니다.
  const navigate = useNavigate();
  const accessRoom = (event, value)=>{
    if(value.comparePwd === value.password){// 비밀번호가 일치하면 방에 들여보내 줍니다.(서버에서 확인하는 걸로 바꾸는게 당연히 효율적인 방법 입니다!)
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
        <div className='clearfix'>&nbsp;</div>
      </form>
      <div>

        <div>* 방 목록들</div>
        {
          ROOMS && ROOMS.length > 0 && ROOMS.map( 
            value => 
              <div key={value._room_id} className='col-md-12 border m-4' >
                <div>방 이름 : {value.kor}, 현재 인원 : {value.size}</div>
                <input type='text' value={value.comparePwd} placeholder='비밀번호 입력' onChange={(event)=> setRoomPwd(event, value)}/>
                <input type='button' value='방들어가기' onClick={ (event)=> accessRoom(event, value) }/>
                <div className='clearfix'>&nbsp;</div>
              </div> 
          )
        }
      </div>
    </div>
  );
}

export default ChattingList;
