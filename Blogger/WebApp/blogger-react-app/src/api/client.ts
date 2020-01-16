import * as rm from "typed-rest-client/RestClient";
import * as v from "./views";

export enum ErrorCode {
    Auth,
    InvalidLogin,
    App,
}

function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export class ClientError extends Error {
    public errorCode: ErrorCode;

    constructor(errorCode: ErrorCode, msg: string | undefined) {
        super(msg);
        this.errorCode = errorCode;
    }
}

export class BlogClient {
    private token: v.AuthTokenView | undefined;
    private client: rm.RestClient;

    constructor(baseUrl: string) {
        this.client = new rm.RestClient("test", baseUrl);
        this.token = undefined;
    }

    public async login(login: v.LoginInputView) {
        const resp = await this.client.create<v.AuthTokenView>("/api/User/Login/cookie", login);
        if (resp.statusCode !== 200) {
            throw new ClientError(ErrorCode.InvalidLogin, "Login");
        }

        /*this.token = resp.result!;
        var handler = new bh.BearerCredentialHandler(this.token!.token);
        this.client.client.handlers = [handler];*/
        return resp.result;
    }

    public async register(login: v.LoginInputView): Promise<v.UserView> {
        return this.create<v.LoginInputView, v.UserView>("/api/User/Register", login);
    }

    public async isLoggedIn(): Promise<boolean> {
        const code = (await this.client.get("/api/User/Current")).statusCode;
        switch (code) {
            case 403:
                return false;
            case 200:
                return true;
            default:
                throw new ClientError(ErrorCode.App, "IsLoggedIn");
        }
    }

    public async currentUser() {
        return this.get<v.UserView>("/api/User/Current")!;
    }

    public async getUser(id: string): Promise<v.UserView | null> {
        return this.get<v.UserView>(`/api/User/${id}`);
    }

    public async getBlog(id: number) {
        return this.get<v.BlogView>(`/api/Blog/${id}`);
    }

    public async getBlogs(): Promise<v.BlogView[] | null> {
        return this.get<v.BlogView[]>(`/api/Blog`);
    }

    public async createBlog(blog: v.BlogCreateView): Promise<v.BlogView> {
        return this.create("/api/Blog", blog);
    }

    public async updateBlog(id: number, blog: v.BlogCreateView): Promise<v.BlogView> {
        return this.replace(`/api/Blog/${id}`, blog);
    }

    public async deleteBlog(id: number) {
        return this.delete(`/api/Blog/${id}`);
    }

    public async getArticle(id: number) {
        return this.get<v.ArticleView>(`/api/Article/${id}`);
    }

    public async getArticlesForBlog(blogId: number): Promise<v.ArticleView[] | null> {
        return this.get<v.ArticleView[]>(`/api/Article/blog/${blogId}`);
    }

    public async createArticle(article: v.ArticleCreateView): Promise<v.ArticleView> {
        return this.create(`/api/Article`, article);
    }

    public async updateArticle(id: number, article: v.ArticleCreateView): Promise<v.ArticleView> {
        return this.replace(`/api/Article/${id}`, article);
    }

    public async deleteArticle(id: number) {
        return this.delete(`/api/Article/${id}`);
    }

    public async getComment(id: number) {
        return this.get<v.CommentView>(`/api/Comment/${id}`);
    }

    public async getCommentsForArticle(articleId: number): Promise<v.CommentView[] | null> {
        return this.get<v.CommentView[]>(`/api/Comment/ByArticle/${articleId}`);
    }

    public async createComment(Comment: v.CommentCreateView): Promise<v.CommentView> {
        return this.create(`/api/Comment`, Comment);
    }

    public async updateComment(id: number, Comment: v.CommentCreateView): Promise<v.CommentView> {
        return this.replace(`/api/Comment/${id}`, Comment);
    }

    public async deleteComment(id: number) {
        return this.delete(`/api/Comment/${id}`);
    }

    private checkStatus(code: number, msg: string, allow404 = false) {
        let ec;

        switch (code) {
            case 403:
                ec = ErrorCode.Auth;
                break;
            case 200:
                ec = undefined;
                break;
            default:
                ec = allow404 && code === 404 ? undefined : ErrorCode.App;
                break;
        }

        if (ec !== undefined) {
            throw new ClientError(ec, msg);
        }
    }

    private async create<TData, TOut>(url: string, create: TData): Promise<TOut> {
        const resp = await this.client.create<TOut>(url, create);
        this.checkStatus(resp.statusCode, url);

        return resp.result!;
    }

    private async replace<TData, TOut>(url: string, update: TData): Promise<TOut> {
        const resp = await this.client.replace<TOut>(url, update);
        this.checkStatus(resp.statusCode, url);

        return resp.result!;
    }

    private async get<TOut>(url: string): Promise<TOut | null> {
        const resp = await this.client.get<TOut>(url);
        this.checkStatus(resp.statusCode, url, true);

        return resp.result;
    }

    private async delete(url: string) {
        const resp = await this.client.del<object>(url);
        this.checkStatus(resp.statusCode, url);
    }
}
