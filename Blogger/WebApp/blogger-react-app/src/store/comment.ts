import { Action } from "redux";
import { ThunkAction } from "redux-thunk";
import { BlogClient } from "../api/client";
import { CommentCreateView, CommentView } from "../api/views";

export interface CommentState {
    comments: CommentView[];
}

export const LOAD_COMMENTS = "LOAD_COMMENTS";

interface LoadCommentsAction {
    type: typeof LOAD_COMMENTS;
    payload: CommentView[];
}

export const DELETE_COMMENT = "DELETE_COMMENT";

interface DeleteCommentAction {
    type: typeof DELETE_COMMENT;
    payload: number;
}

export const CREATE_COMMENT = "CREATE_COMMENT";

interface CreateCommentAction {
    type: typeof CREATE_COMMENT;
    payload: CommentView;
}

export const UPDATE_COMMENT = "UPDATE_COMMENT";

interface UpdateCommentAction {
    type: typeof UPDATE_COMMENT;
    payload: CommentView;
}

export type CommentActionTypes = LoadCommentsAction | DeleteCommentAction | CreateCommentAction | UpdateCommentAction;

const initialState: CommentState = {
    comments: [],
};

export function commentReducer(
    state = initialState,
    action: CommentActionTypes,
): CommentState {
    switch (action.type) {
        case LOAD_COMMENTS:
            return { comments: action.payload };
            case DELETE_COMMENT:
                return {...state, comments: state.comments.filter((a) => a.id !== action.payload)};
            case CREATE_COMMENT:
                return {...state, comments: [...state.comments, action.payload]};
            case UPDATE_COMMENT:
                return {...state, comments: state.comments.map((a) => a.id === action.payload.id ? action.payload : a)};

        default:
            return state;
    }
}

export const thunkLoadComments = (articleId: number):
    ThunkAction<void, CommentState, BlogClient, Action<string>> => {
        return async (dispatch, _, api) => {
            const comments = await api.getCommentsForArticle(articleId);
            dispatch({
                type: LOAD_COMMENTS,
                payload: comments!,
            });
        };
    };

export const thunkDeleteComment = (commentId: number):
    ThunkAction<void, CommentState, BlogClient, Action<string>> => async (dispatch, _, api) => {
    await api.deleteComment(commentId);
    dispatch({
        type: DELETE_COMMENT,
        payload: commentId,
    });
};

export const thunkCreateComment = (commentCreateView: CommentCreateView):
    ThunkAction<void, CommentState, BlogClient, Action<string>> => {
        return async (dispatch, _, api) => {
            const comment = await api.createComment(commentCreateView);
            dispatch({
                type: CREATE_COMMENT,
                payload: comment,
            });
        };
    };

export const thunkUpdateComment = (commentId: number, commentUpdateView: CommentCreateView):
    ThunkAction<void, CommentState, BlogClient, Action<string>> => {
        return async (dispatch, _, api) => {
            const comment = await api.updateComment(commentId, commentUpdateView);
            dispatch({
                type: UPDATE_COMMENT,
                payload: comment,
            });
        };
    };
