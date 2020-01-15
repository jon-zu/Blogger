import { BlogView } from "../api/views";
import { BlogClient } from "../api/client";
import { Action } from 'redux'
import { ThunkAction } from 'redux-thunk'

export interface BlogState {
    blogs: BlogView[]
    selectedBlog: BlogView | undefined
}

export const LOAD_BLOGS = 'LOAD_BLOGS';

interface LoadBlogsAction {
    type: typeof LOAD_BLOGS,
    payload: BlogView[]
}

export const SELECT_BLOG = 'SELECT_BLOG';

interface SelectBlogAction {
    type: typeof SELECT_BLOG,
    payload: BlogView
}

export type BlogActionTypes = LoadBlogsAction | SelectBlogAction;

const initialState: BlogState = {
    blogs: [],
    selectedBlog: undefined
};

export function blogReducer(
    state = initialState,
    action: BlogActionTypes
): BlogState {
    switch (action.type) {
        case LOAD_BLOGS:
            return { blogs: action.payload, selectedBlog: state.selectedBlog };
        case SELECT_BLOG:
            console.log("Setting blog: " + action.payload.id);
            return { blogs: state.blogs, selectedBlog: action.payload}
        default:
            return state
    }
}


export const thunkLoadBlogs = (): 
    ThunkAction<void, BlogState, BlogClient, Action<string>> => async (dispatch, _, api) => {
    var blogs = await api.getBlogs();
    dispatch({
        type: LOAD_BLOGS,
        payload: blogs!
    })
}

export const thunkSelectBlog = (blogId: number): 
    ThunkAction<void, BlogState, BlogClient, Action<string>> => async (dispatch, _, api) => {
    var blog = await api.getBlog(blogId);
    dispatch({
        type: SELECT_BLOG,
        payload: blog!
    })
}