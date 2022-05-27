import { createAction, handleActions } from 'redux-actions';

//#1. 상태 정의
const INSERT = 'ROOM/INSERT'


//#2. 함수 정의
export const INSERT_ROOM = createAction(INSERT, arg => arg)

//#3. 상태
const DATA_STATUS = []

//#4. 리듀서
const INSERT_ROOMS = handleActions({
    [INSERT] : (state, action)=>{
        return state.filter(arg=> false).concat(action.payload.item)
    }        
}, DATA_STATUS)

export default INSERT_ROOMS

