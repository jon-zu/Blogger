import { Action } from "redux";
import { BlogThunkResult } from ".";
import { CommentCreateView, CommentView } from "../api/views";
import { BlogClient } from "../api/client";

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
            return { ...state, comments: state.comments.filter((a) => a.id !== action.payload) };
        case CREATE_COMMENT:
            return { ...state, comments: [...state.comments, action.payload] };
        case UPDATE_COMMENT:
            return { ...state, comments: state.comments.map((a) => a.id === action.payload.id ? action.payload : a) };

        default:
            return state;
    }
}

export const thunkLoadComments = (articleId: number):
    BlogThunkResult<Promise<void>> => async (dispatch, _, api) => {
        const comments = await api.getCommentsForArticle(articleId);
        dispatch({
            payload: comments!,
            type: LOAD_COMMENTS,
        });
    };

export const thunkDeleteComment = (commentId: number):
    BlogThunkResult<Promise<void>> => async (dispatch, _, api) => {
        await api.deleteComment(commentId);
        dispatch({
            payload: commentId,
            type: DELETE_COMMENT,
        });
    };

export const thunkCreateComment = (commentCreateView: CommentCreateView):
    BlogThunkResult<Promise<void>> => async (dispatch, _, api) => {
        const comment = await api.createComment(commentCreateView);
        dispatch({
            payload: comment,
            type: CREATE_COMMENT,
        });
    };

export const thunkUpdateComment = (commentId: number, commentUpdateView: CommentCreateView):
    BlogThunkResult<Promise<void>> => async (dispatch, _, api) => {
        const comment = await api.updateComment(commentId, commentUpdateView);
        dispatch({
            payload: comment,
            type: UPDATE_COMMENT,
        });
    };
