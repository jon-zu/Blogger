import { UserView } from "../api/views";
import { BlogClient, ClientError, ErrorCode } from "../api/client";
import { Action } from 'redux'
import { ThunkAction } from 'redux-thunk'

export interface UserState {
    currentUser: UserView | undefined
}

export const LOGIN_USER = 'LOGIN_USER';

interface LoginUserAction {
    type: typeof LOGIN_USER,
    payload: UserView
}


export const LOGOUT_USER = 'LOGOUT_USER';

interface LogoutUserAction {
    type: typeof LOGOUT_USER
}

export const LOGIN_CHECK = 'LOGIN_CHECK';

interface LoginCheckAction {
    type: typeof LOGIN_CHECK
    payload: UserView | undefined
}

export type UserActionTypes = LoginUserAction | LogoutUserAction | LoginCheckAction;

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
        case LOGIN_CHECK:
            return {currentUser: action.payload}
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

export const thunkLoginCheck = (): 
    ThunkAction<void, UserState, BlogClient, Action<string>> => {
        return async (dispatch, getState, api) => {
            var user = undefined;
            try {
                user = await api.currentUser();
            }
            catch (err) {
                if (err instanceof ClientError) {
                    if (err.errorCode !== ErrorCode.Auth)
                        throw err;
                }
                else {
                    throw err;
                }
            }
            dispatch({
                type: LOGIN_CHECK,
                payload: user
            });
        };
    }