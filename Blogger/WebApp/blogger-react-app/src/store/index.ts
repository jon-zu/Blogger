import { combineReducers } from "redux";

import { articleReducer, ArticleActionTypes } from "./article";
import { blogReducer, BlogActionTypes } from "./blog";
import { commentReducer, CommentActionTypes } from "./comment";
import { userReducer, UserActionTypes } from "./user";
import { ThunkDispatch, ThunkAction } from "redux-thunk";
import { BlogClient } from "../api/client";

export const rootReducer = combineReducers({
    article: articleReducer,
    blog: blogReducer,
    comment: commentReducer,
    user: userReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type ActionTypes = BlogActionTypes | ArticleActionTypes | CommentActionTypes | UserActionTypes;
export type BlogThunkResult<R> = ThunkAction<R, RootState, BlogClient, ActionTypes>;
export type BlogThunkDispatch = ThunkDispatch<RootState, BlogClient, ActionTypes>;
