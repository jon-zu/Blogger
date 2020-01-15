import * as rm from 'typed-rest-client/RestClient'
import * as bh from 'typed-rest-client/handlers/bearertoken';
import * as v from './views';


enum ErrorCode {
    Auth,
    InvalidLogin,
    App
}

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

class ClientError extends Error {
    errorCode: ErrorCode

    constructor(errorCode: ErrorCode, msg: string | undefined) {
        super(msg);
        this.errorCode = errorCode;
    }
}



export class BlogClient {
    private token: v.AuthTokenView | undefined
    private client: rm.RestClient

    constructor(baseUrl: string) {
        this.client = new rm.RestClient('test', baseUrl);
        this.token = undefined;
    }

    private checkStatus(code: number, msg: string, allow404 = false) {
        var ec;
        
        switch(code) {
            case 403:
                ec = ErrorCode.Auth;
                break;
            case 200:
                ec = undefined;
                break;
            default:
                if (allow404 && code === 404) {
                    ec = undefined 
                } else {
                    ec = ErrorCode.App;
                }
                break;
        };


        if (ec !== undefined) {
            throw new ClientError(ec, msg);
        }
    }

    private async create<TData, TOut>(url: string, create: TData): Promise<TOut> {
        var resp = await this.client.create<TOut>(url, create);
        this.checkStatus(resp.statusCode, url);

        return resp.result!;
    }

    private async update<TData, TOut>(url: string, update: TData): Promise<TOut> {
        var resp = await this.client.update<TOut>(url, update);
        this.checkStatus(resp.statusCode, url);

        return resp.result!;
    }

    private async get<TOut>(url: string): Promise<TOut | null> {
        var resp = await this.client.get<TOut>(url);
        this.checkStatus(resp.statusCode, url, true);

        return resp.result;
    }

    private async delete(url: string) {
        var resp = await this.client.del<object>(url);
        this.checkStatus(resp.statusCode, url);
    }


    async login(login: v.LoginInputView) {
        var resp = await this.client.create<v.AuthTokenView>("/api/User/Login/cookie", login);
        if(resp.statusCode !== 200)
            throw new ClientError(ErrorCode.InvalidLogin, "Login");

        /*this.token = resp.result!;
        var handler = new bh.BearerCredentialHandler(this.token!.token);
        this.client.client.handlers = [handler];*/
        return resp.result;
    }

    async register(login: v.LoginInputView): Promise<v.UserView> {
        return this.create<v.LoginInputView, v.UserView>("/api/User/Register", login);
    }

    async isLoggedIn(): Promise<boolean> {
        let code = (await this.client.get("/api/User/Current")).statusCode;
        switch (code) {
            case 403:
                return false;
            case 200:
                return true;
            default:
                throw new ClientError(ErrorCode.App, "IsLoggedIn");
        }
    }

    async currentUser() {
        return this.get<v.UserView>("/api/User/Current")!;
    }

    async getUser(id: string): Promise<v.UserView | null> {
        return this.get<v.UserView>(`/api/User/${id}`);
    }

    async getBlog(id: number) {
        return this.get<v.BlogView>(`/api/Blog/${id}`);
    }

    async getBlogs(): Promise<v.BlogView[] | null> {
        return this.get<v.BlogView[]>(`/api/Blog`);
    }

    async createBlog(blog: v.BlogCreateView): Promise<v.BlogView> {
        return this.create("/api/Blog", blog);
    }

    async updateBlog(id: number, blog: v.BlogCreateView) {
        return this.update(`/api/Blog/${id}`, blog);
    }

    async deleteBlog(id: number) {
        return this.delete(`/api/Blog/${id}`);
    }

    async getArticle(id: number) {
        return this.get<v.ArticleView>(`/api/Article/${id}`);
    }

    async getArticlesForBlog(blogId: number): Promise<v.ArticleView[] | null> {
        return this.get<v.ArticleView[]>(`/api/Article/blog/${blogId}`);
    }

    async createArticle(article: v.ArticleCreateView): Promise<v.ArticleView> {
        return this.create(`/api/Article`, article);
    }

    async updateArticle(id: number, article: v.ArticleCreateView) {
        return this.update(`/api/Article/${id}`, article);
    }

    async deleteArticle(id: number) {
        return this.delete(`/api/Article/${id}`);
    }

    async getComment(id: number) {
        return this.get<v.CommentView>(`/api/Comment/${id}`);
    }

    async getCommentsForArticle(articleId: number): Promise<v.CommentView[] | null> {
        return this.get<v.CommentView[]>(`/api/Comment/ByArticle/${articleId}`);
    }

    async createComment(Comment: v.CommentCreateView): Promise<v.CommentView> {
        return this.create(`/api/Comment`, Comment);
    }

    async updateComment(id: number, Comment: v.CommentCreateView) {
        return this.update(`/api/Comment/${id}`, Comment);
    }

    async deleteComment(id: number) {
        return this.delete(`/api/Comment/${id}`);
    }
}