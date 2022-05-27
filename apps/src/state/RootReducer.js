import { combineReducers } from 'redux';
import INSERT_SESSION from './Session';
import INSERT_ROOMS from './Room';


const root = combineReducers({
  INSERT_SESSION, INSERT_ROOMS
});

export default root