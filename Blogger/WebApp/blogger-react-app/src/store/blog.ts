import { Action } from "redux";
import { ThunkAction } from "redux-thunk";
import { BlogClient } from "../api/client";
import { BlogCreateView, BlogView } from "../api/views";
import { BlogThunkResult } from ".";

export interface BlogState {
    blogs: BlogView[];
    selectedBlog: BlogView | undefined;
}

export const LOAD_BLOGS = "LOAD_BLOGS";

interface LoadBlogsAction {
    type: typeof LOAD_BLOGS;
    payload: BlogView[];
}

export const SELECT_BLOG = "SELECT_BLOG";

interface SelectBlogAction {
    type: typeof SELECT_BLOG;
    payload: BlogView;
}

export const DELETE_BLOG = "DELETE_BLOG";

interface DeleteBlogAction {
    type: typeof DELETE_BLOG;
    payload: number;
}

export const CREATE_BLOG = "CREATE_BLOG";

interface CreateBlogAction {
    type: typeof CREATE_BLOG;
    payload: BlogView;
}

export const UPDATE_BLOG = "UPDATE_BLOG";

interface UpdateBlogAction {
    type: typeof UPDATE_BLOG;
    payload: BlogView;
}

export type BlogActionTypes = LoadBlogsAction | SelectBlogAction |
    DeleteBlogAction | CreateBlogAction | UpdateBlogAction;

const initialState: BlogState = {
    blogs: [],
    selectedBlog: undefined,
};

export function blogReducer(
    state = initialState,
    action: BlogActionTypes,
): BlogState {
    switch (action.type) {
        case LOAD_BLOGS:
            return { blogs: action.payload, selectedBlog: state.selectedBlog };
        case SELECT_BLOG:
            return { blogs: state.blogs, selectedBlog: action.payload };
        case DELETE_BLOG:
            return { selectedBlog: undefined, blogs: state.blogs.filter((a) => a.id !== action.payload) };
        case CREATE_BLOG:
            return { ...state, blogs: [...state.blogs, action.payload] };
        case UPDATE_BLOG:
            return {
                blogs: state.blogs.map((a) => a.id === action.payload.id ? action.payload : a),
                selectedBlog: action.payload,
            };
        default:
            return state;
    }
}

export const thunkLoadBlogs = ():
    BlogThunkResult<Promise<void>> => async (dispatch, _, api) => {
        const blogs = await api.getBlogs();
        dispatch({
            payload: blogs!,
            type: LOAD_BLOGS,
        });
    };

export const thunkSelectBlog = (blogId: number):
    BlogThunkResult<Promise<void>> => async (dispatch, _, api) => {
        const blog = await api.getBlog(blogId);
        dispatch({
            payload: blog!,
            type: SELECT_BLOG,
        });
    };

export const thunkDeleteBlog = (blogId: number):
    BlogThunkResult<Promise<void>> => async (dispatch, _, api) => {
        await api.deleteBlog(blogId);
        dispatch({
            type: DELETE_BLOG,
            payload: blogId,
        });
    };

export const thunkCreateBlog = (blogCreateView: BlogCreateView):
    BlogThunkResult<Promise<void>> => async (dispatch, _, api) => {
        const blog = await api.createBlog(blogCreateView);
        dispatch({
            type: CREATE_BLOG,
            payload: blog,
        });
    };

export const thunkUpdateBlog = (blogId: number, blogUpdateView: BlogCreateView):
    BlogThunkResult<Promise<void>> => async (dispatch, _, api) => {
        const blog = await api.updateBlog(blogId, blogUpdateView);
        dispatch({
            type: UPDATE_BLOG,
            payload: blog,
        });
    };
