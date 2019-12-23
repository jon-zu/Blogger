import {todoReducer} from "./todo/reducers";
import {combineReducers} from 'redux';
import {visibilityReducer} from "./visibility/reducers";

export const rootReducer = combineReducers({
    todo: todoReducer,
    visibility: visibilityReducer
});

export type RootState = ReturnType<typeof rootReducer>;