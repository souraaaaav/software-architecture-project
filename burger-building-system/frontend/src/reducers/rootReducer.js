import { combineReducers } from "redux";
import { authReducer } from "../reducers/authReducer";
import { burgerReducer } from "./burgerReducer";

const rootReducer = combineReducers({
    auth: authReducer,
    burger: burgerReducer
});

export default rootReducer;