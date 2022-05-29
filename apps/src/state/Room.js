import { createAction, handleActions } from 'redux-actions';

//#1. 상태 정의 : 방만들기
const INSERT = 'ROOM/INSERT'


//#2. 함수 정의
export const INSERT_ROOM = createAction(INSERT, arg => arg)

//#3. 상태
const DATA_STATUS = []

//#4. 리듀서 : 방만들어진 것에 대해서 업데이트 합니다.
const INSERT_ROOMS = handleActions({
    [INSERT] : (state, action)=>{
        return state.filter(arg=> false).concat(action.payload.item) //전부 false로 제거하고 붙여줍니다.
    }        
}, DATA_STATUS)

export default INSERT_ROOMS

