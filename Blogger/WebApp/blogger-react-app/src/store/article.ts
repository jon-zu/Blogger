import { ArticleView } from "../api/views";
import { BlogClient } from "../api/client";
import { Action } from 'redux'
import { ThunkAction } from 'redux-thunk'

export interface ArticleState {
    articles: ArticleView[]
    selectedArticle: ArticleView | undefined
}

export const LOAD_ARTICLES = 'LOAD_ARTICLES';

interface LoadArticlesAction {
    type: typeof LOAD_ARTICLES,
    payload: ArticleView[]
}

export const SELECT_ARTICLE = 'SELECT_ARTICLE';

interface SelectArticleAction {
    type: typeof SELECT_ARTICLE,
    payload: ArticleView
}

export type ArticleActionTypes = LoadArticlesAction | SelectArticleAction;

const initialState: ArticleState = {
    articles: [],
    selectedArticle: undefined
};

export function articleReducer(
    state = initialState,
    action: ArticleActionTypes
): ArticleState {
    switch (action.type) {
        case LOAD_ARTICLES:
            return { articles: action.payload, selectedArticle: state.selectedArticle };
        case SELECT_ARTICLE:
            return { articles: state.articles, selectedArticle: action.payload};
        default:
            return state
    }
}


export const thunkLoadArticles = (blogId: number): 
    ThunkAction<void, ArticleState, BlogClient, Action<string>> => async (dispatch, _, api) => {
    var articles = await api.getArticlesForBlog(blogId);
    dispatch({
        type: LOAD_ARTICLES,
        payload: articles!
    })
}

export const thunkSelectArticle = (articleId: number): 
    ThunkAction<void, ArticleState, BlogClient, Action<string>> => async (dispatch, _, api) => {
    var blog = await api.getArticle(articleId);
    dispatch({
        type: SELECT_ARTICLE,
        payload: blog!
    })
}