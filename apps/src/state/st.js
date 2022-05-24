import { createAction, handleActions } from 'redux-actions';

//#1. 상태 정의
const INSERT = 'Data/INSERT'
const UPDATE = 'Data/UPDATE'
const DELETE = 'Data/DELETE'
const INIT = 'Data/INIT'

//#2. 함수 정의
export const init_data = createAction(INIT, arg => arg)
export const insert_data = createAction(INSERT, arg => arg)
export const update_data = createAction(UPDATE, arg => arg)
export const delete_data = createAction(DELETE, arg => arg)

//#3. 상태
const DATA_STATUS = [

]

//#4. 리듀서
const HistoryData = handleActions({
    [INIT] : (state, action)=>{
        return state.filter( arg=> false).concat(action.payload)
    },    
    [INSERT] : (state, action)=>{
        return state.concat(action.payload)
    },
    [UPDATE] : (state, action)=>{  //_id라는 키로 업데이트 정의
        return state.map( arg=>{  
            return arg._id === action.payload._id ? {...arg, ...action.payload} : arg
        })
    },
    [DELETE] : (state, action)=>{ //_id라는 키로 삭제 정의
        return state.filter( arg=>{
            return arg._id === action.payload._id ? false : true
        })
    }           
}, DATA_STATUS)

export default HistoryData
