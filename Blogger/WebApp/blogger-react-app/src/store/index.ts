import { combineReducers } from "redux";
import { userReducer } from "./user";
import { articleReducer } from "./article";
import { blogReducer } from "./blog";
import { commentReducer } from "./comment";

export const rootReducer = combineReducers({
    user: userReducer,
    blog: blogReducer,
    article: articleReducer,
    comment: commentReducer
});

export type RootState = ReturnType<typeof rootReducer>;