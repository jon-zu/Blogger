import { BlogView, BlogCreateView } from "../api/views";
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

export const DELETE_BLOG = 'DELETE_BLOG';

interface DeleteBlogAction {
    type: typeof DELETE_BLOG,
    payload: number
}

export const CREATE_BLOG = 'CREATE_BLOG';

interface CreateBlogAction {
    type: typeof CREATE_BLOG,
    payload: BlogView
}

export const UPDATE_BLOG = 'UPDATE_BLOG';

interface UpdateBlogAction {
    type: typeof UPDATE_BLOG,
    payload: BlogView
}

export type BlogActionTypes = LoadBlogsAction | SelectBlogAction | DeleteBlogAction | CreateBlogAction | UpdateBlogAction;

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
            return { blogs: state.blogs, selectedBlog: action.payload}
        case DELETE_BLOG:
            return {selectedBlog: undefined, blogs: state.blogs.filter(a => a.id !== action.payload)};
        case CREATE_BLOG:
            return {...state, blogs: [...state.blogs, action.payload]};
        case UPDATE_BLOG:
            return {selectedBlog: action.payload, blogs: state.blogs.map(a => a.id === action.payload.id ? action.payload : a)}
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

export const thunkDeleteBlog = (blogId: number): 
    ThunkAction<void, BlogState, BlogClient, Action<string>> => async (dispatch, _, api) => {
    await api.deleteBlog(blogId);
    dispatch({
        type: DELETE_BLOG,
        payload: blogId
    })
}

export const thunkCreateBlog = (blogCreateView: BlogCreateView): 
    ThunkAction<void, BlogState, BlogClient, Action<string>> => async (dispatch, _, api) => {
    var blog = await api.createBlog(blogCreateView);
    dispatch({
        type: CREATE_BLOG,
        payload: blog
    })
}

export const thunkUpdateBlog = (blogId: number, blogUpdateView: BlogCreateView): 
    ThunkAction<void, BlogState, BlogClient, Action<string>> => async (dispatch, _, api) => {
    var blog = await api.updateBlog(blogId, blogUpdateView);
    dispatch({
        type: UPDATE_BLOG,
        payload: blog
    })
}