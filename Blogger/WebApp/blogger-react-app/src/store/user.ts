import { UserView } from "../api/views";
import { BlogClient } from "../api/client";
import { Action } from 'redux'
import { ThunkAction } from 'redux-thunk'

export interface UserState {
    currentUser: UserView | undefined
}

export const LOGIN_USER = 'LOGIN_USER';
export const LOGOUT_USER = 'LOGOUT_USER';

interface LoginUserAction {
    type: typeof LOGIN_USER,
    payload: UserView
}

interface LogoutUserAction {
    type: typeof LOGOUT_USER
}

export type UserActionTypes = LoginUserAction | LogoutUserAction;

const initialState: UserState = {
    currentUser: undefined
};

export function userReducer(
    state = initialState,
    action: UserActionTypes
): UserState {
    switch (action.type) {
        case LOGIN_USER:
            return { currentUser: action.payload };
        case LOGOUT_USER:
            return { currentUser: undefined };
        default:
            return state
    }
}


export const thunkLogin = (
    username: string,
    password: string
): ThunkAction<void, UserState, BlogClient, Action<string>> => async (dispatch, getState, api) => {
    await api.login({
        username: username,
        password: password
    });

    var user = await api.currentUser();
    dispatch({
        type: LOGIN_USER,
        payload: user!
    })
}