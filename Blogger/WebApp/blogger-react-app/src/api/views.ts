export interface ArticleCreateView {
    blogId: number;
    title: string;
    content: string;
}

export interface BlogCreateView {
    title: string;
    about: string;
}

export interface BlogView {
    id: number;
    title: string;
    about: string;
    owner: UserView;
}

export interface ArticleView {
    id: number;
    title: string;
    content: string;
    owner: UserView;
}

export interface CommentCreateView {
    articleId: number;
    content: string;
}

export interface CommentView {
    createdAt: Date;
    content: string;
    id: number;
    owner: UserView;
}

export interface LoginInputView {
    username: string;
    password: string;
}

export interface UserView {
    name: string;
    id: string;
}

export interface AuthTokenView {
    token: string;
    expiration: Date;
}
