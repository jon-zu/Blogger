import { CommentView } from "../api/views";
import { BlogClient } from "../api/client";
import { Action } from 'redux'
import { ThunkAction } from 'redux-thunk'

export interface CommentState {
    comments: CommentView[]
}

export const LOAD_COMMENTS = 'LOAD_COMMENTS';

interface LoadCommentsAction {
    type: typeof LOAD_COMMENTS,
    payload: CommentView[]
}

export type CommentActionTypes = LoadCommentsAction;

const initialState: CommentState = {
    comments: []
};

export function commentReducer(
    state = initialState,
    action: CommentActionTypes
): CommentState {
    switch (action.type) {
        case LOAD_COMMENTS:
            return { comments: action.payload };
        default:
            return state
    }
}


export const thunkLoadComments = (articleId: number): 
    ThunkAction<void, CommentState, BlogClient, Action<string>> => async (dispatch, _, api) => {
    var comments = await api.getCommentsForArticle(articleId);
    dispatch({
        type: LOAD_COMMENTS,
        payload: comments!
    })
}