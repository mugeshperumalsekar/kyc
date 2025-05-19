import { createStore, combineReducers } from 'redux';
import loginReducer from "../../../pages/State/LoginReducer";
import saveApplicationReducer from '../../../pages/KYC_NEW/Insert/state/save-application-reducer';

const rootReducer = combineReducers({
  loginReducer: loginReducer,
  kycApplication:saveApplicationReducer,

});

const store = createStore(rootReducer);

export default store;
