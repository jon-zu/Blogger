import { Action } from "redux";
import { ThunkAction } from "redux-thunk";
import { BlogClient, ClientError, ErrorCode } from "../api/client";
import { UserView } from "../api/views";
import { BlogThunkResult } from ".";

export interface UserState {
    currentUser: UserView | undefined;
}

export const LOGIN_USER = "LOGIN_USER";

interface LoginUserAction {
    type: typeof LOGIN_USER;
    payload: UserView;
}

export const LOGOUT_USER = "LOGOUT_USER";

interface LogoutUserAction {
    type: typeof LOGOUT_USER;
}

export const LOGIN_CHECK = "LOGIN_CHECK";

interface LoginCheckAction {
    type: typeof LOGIN_CHECK;
    payload: UserView | undefined;
}

export type UserActionTypes = LoginUserAction | LogoutUserAction | LoginCheckAction;

const initialState: UserState = {
    currentUser: undefined,
};

export function userReducer(
    state = initialState,
    action: UserActionTypes,
): UserState {
    switch (action.type) {
        case LOGIN_USER:
            return { currentUser: action.payload };
        case LOGOUT_USER:
            return { currentUser: undefined };
        case LOGIN_CHECK:
            return { currentUser: action.payload };
        default:
            return state;
    }
}

export const thunkLogin = (
    username: string,
    password: string,
): BlogThunkResult<Promise<void>> => async (dispatch, _, api) => {
    await api.login({
        username,
        password,
    });

    const user = await api.currentUser();
    dispatch({
        payload: user!,
        type: LOGIN_USER,
    });
};

export const thunkLoginCheck = ():
    BlogThunkResult<Promise<void>> => async (dispatch, _, api) => {
        let user;
        try {
            user = await api.currentUser() ?? undefined;
        } catch (err) {
            if (err instanceof ClientError) {
                if (err.errorCode !== ErrorCode.Auth) {
                    throw err;
                }
            } else {
                throw err;
            }
        }
        dispatch({
            payload: user,
            type: LOGIN_CHECK,
        });
    };
