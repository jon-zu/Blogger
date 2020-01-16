import { combineReducers } from "redux";
import { articleReducer } from "./article";
import { blogReducer } from "./blog";
import { commentReducer } from "./comment";
import { userReducer } from "./user";

export const rootReducer = combineReducers({
    user: userReducer,
    blog: blogReducer,
    article: articleReducer,
    comment: commentReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
