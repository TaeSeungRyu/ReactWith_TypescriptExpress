import React, { useEffect }  from 'react'
import { useLocation } from "react-router";
import { useDispatch, useSelector} from 'react-redux';
//import {INSERT_ROOM} from '../state/Room';
import { useForm } from "react-hook-form"

function Result() {
  let param = useLocation();
  (()=>{
    console.log(param); 
  })();

  const dispatch = useDispatch();
  const ROOMS = useSelector( state => state.INSERT_ROOMS);

  const { register, handleSubmit, getValues } = useForm();
  const createRoom = ()=>{
    let param = getValues();
    console.log(param)
  }
  
  useEffect(()=>{  

  }, [dispatch, ROOMS])

  return (
    <div className='container'>   
      <div className='h2'>여기는 방 목록 페이지 입니다.</div>   
      <form onSubmit={handleSubmit(createRoom)} className='col-md-12 border m-4' >
        <span className='h6'> * 방만들기</span>
        <input type='text' name='kor' {...register('kor')} className='form-control' placeholder='방이름'  />
        <input type='text' name='password' {...register('password')} className='form-control' placeholder='비번'/>
        <button type='submit' className='btn btn-warning'>만들어져라</button>
      </form>
    </div>
  );
}

export default Result;
