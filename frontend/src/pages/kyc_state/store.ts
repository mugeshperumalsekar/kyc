import { createStore } from "redux";
import appReducers from "./reducer";

const store = createStore(appReducers);
export default store;