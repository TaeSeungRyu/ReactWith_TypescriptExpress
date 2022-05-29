import { combineReducers } from 'redux';
import INSERT_SESSION from './Session';
import INSERT_ROOMS from './Room';

//2개의 리듀서를 담당 하는 메인 리듀서입니다.
const root = combineReducers({
  INSERT_SESSION, INSERT_ROOMS
});

export default root