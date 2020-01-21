import { Action } from "redux";
import { ThunkAction } from "redux-thunk";
import { BlogClient } from "../api/client";
import { ArticleCreateView, ArticleView } from "../api/views";
import { BlogThunkResult } from ".";

export interface ArticleState {
    articles: ArticleView[];
    selectedArticle: ArticleView | undefined;
}

export const LOAD_ARTICLES = "LOAD_ARTICLES";

interface LoadArticlesAction {
    type: typeof LOAD_ARTICLES;
    payload: ArticleView[];
}

export const SELECT_ARTICLE = "SELECT_ARTICLE";

interface SelectArticleAction {
    type: typeof SELECT_ARTICLE;
    payload: ArticleView;
}

export const DELETE_ARTICLE = "DELETE_ARTICLE";

interface DeleteArticleAction {
    type: typeof DELETE_ARTICLE;
    payload: number;
}

export const CREATE_ARTICLE = "CREATE_ARTICLE";

interface CreateArticleAction {
    type: typeof CREATE_ARTICLE;
    payload: ArticleView;
}

export const UPDATE_ARTICLE = "UPDATE_ARTICLE";

interface UpdateArticleAction {
    type: typeof UPDATE_ARTICLE;
    payload: ArticleView;
}

export type ArticleActionTypes = LoadArticlesAction |
    SelectArticleAction | DeleteArticleAction |
    CreateArticleAction | UpdateArticleAction;

const initialState: ArticleState = {
    articles: [],
    selectedArticle: undefined,
};

export function articleReducer(
    state = initialState,
    action: ArticleActionTypes,
): ArticleState {
    switch (action.type) {
        case LOAD_ARTICLES:
            return { ...state, articles: action.payload };
        case SELECT_ARTICLE:
            return { ...state, selectedArticle: action.payload };
        case DELETE_ARTICLE:
            return { selectedArticle: undefined, articles: state.articles.filter((a) => a.id !== action.payload) };
        case CREATE_ARTICLE:
            return { ...state, articles: [...state.articles, action.payload] };
        case UPDATE_ARTICLE:
            return {
                articles: state.articles.map((a) => a.id === action.payload.id ? action.payload : a),
                selectedArticle: action.payload,
            };
        default:
            return state;
    }
}

export const thunkLoadArticles = (blogId: number):
    BlogThunkResult<Promise<void>> => async (dispatch, _, api) => {
    const articles = await api.getArticlesForBlog(blogId);
    dispatch({
        payload: articles!,
        type: LOAD_ARTICLES,
    });
};

export const thunkSelectArticle = (articleId: number):
    BlogThunkResult<Promise<void>> => async (dispatch, _, api) => {
    const article = await api.getArticle(articleId);
    dispatch({
        payload: article!,
        type: SELECT_ARTICLE,
    });
};

export const thunkDeleteArticle = (articleId: number):
    BlogThunkResult<Promise<void>> => async (dispatch, _, api) => {
    await api.deleteArticle(articleId);
    dispatch({
        payload: articleId,
        type: DELETE_ARTICLE,
    });
};

export const thunkCreateArticle = (articleCreateView: ArticleCreateView):
    BlogThunkResult<Promise<void>> => async (dispatch, _, api) => {
    const article = await api.createArticle(articleCreateView);
    dispatch({
        payload: article,
        type: CREATE_ARTICLE,
    });
};

export const thunkUpdateArticle = (articleId: number, articleUpdateView: ArticleCreateView):
    BlogThunkResult<Promise<void>> => async (dispatch, _, api) => {
    const article = await api.updateArticle(articleId, articleUpdateView);
    dispatch({
        payload: article,
        type: UPDATE_ARTICLE,
    });
};
