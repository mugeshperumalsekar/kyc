import { combineReducers } from 'redux';
import loginReducer from '../../../pages/State/LoginReducer';



export const rootReducer = combineReducers({
  loginReducer: loginReducer,

});

export type RootState = ReturnType<typeof rootReducer>;