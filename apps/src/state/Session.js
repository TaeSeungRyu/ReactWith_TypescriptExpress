import { createAction, handleActions } from 'redux-actions';

//#1. 상태 정의
const INSERT_SESSION = 'LOGIN_SESSION'

//#2. 함수 정의
export const UPDATE_SESSION = createAction(INSERT_SESSION, arg => arg)

//#3. 상태(세션 스토리지에 저장하여 새로고침에 대비합니다.)
const DATA_STATUS = {id : ''}
if(sessionStorage.getItem('id')){
    DATA_STATUS.id = sessionStorage.getItem('id');
}

//#4. 리듀서
const GET_SESSION = handleActions({
    [INSERT_SESSION] : (state, action)=>{
         
        sessionStorage.setItem('id', action.payload._id)
        return {
            state, id : action.payload._id
        }
    }        
}, DATA_STATUS)

export default GET_SESSION

