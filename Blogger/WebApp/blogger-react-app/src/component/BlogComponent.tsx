import React from "react";
import { connect } from "react-redux";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import { ThunkDispatch } from "redux-thunk";
import * as v from "../api/views";
import { RootState } from "../store";
import { thunkLoadArticles } from "../store/article";
import { thunkDeleteBlog, thunkSelectBlog } from "../store/blog";

interface OwnProps {
    blogId: number;
}

interface DispatchProps {
    loadBlog: (blogId: number) => Promise<void>;
    deleteBlog: (blogId: number) => Promise<void>;
}

interface StateProps {
    blog: v.BlogView | undefined;
    articles: v.ArticleView[];
    canEdit: boolean;
}

type Props = StateProps & OwnProps & DispatchProps & RouteComponentProps;

interface State {
}

export class BlogComponent extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {};

        this.deleteBlog = this.deleteBlog.bind(this);
    }

    public async componentDidMount() {
        await this.props.loadBlog(+this.props.blogId);
    }

    public async deleteBlog() {
        await this.props.deleteBlog(this.props.blogId);
        this.props.history.push("/");
    }

    public render() {
        const { blog, articles, canEdit } = this.props;
        const isLoading = blog === undefined;

        return <>
            {isLoading ?
                <>
                    <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </>
                :
                <>

                    {canEdit &&
                        <>
                            <div className="row mt-1 justify-content-end">
                                <div className="col-sm-1">
                                    <Link to={`/blog/edit`}>
                                        <button type="button" className="btn btn-primary">Edit</button>
                                    </Link>
                                </div>

                                <div className="col-sm-1">
                                    <button type="button" className="btn btn-danger" onClick={this.deleteBlog}>Delete</button>
                                </div>
                            </div>
                        </>
                    }

                    <div className="row mt-3">
                        <div className="col-md-12">
                            <h1>{blog!.title}</h1>
                            <p>{blog!.about}</p>
                        </div>
                    </div>

                    <div className="row mt-3">
                        <div className="col-sm-1">
                            <h3 className="font-weight-light">Articles:</h3>
                        </div>
                    </div>

                    <div className="row mt-3 overflow-auto">
                        <div className="col-lg-12">
                            <div className="list-group">
                                {articles?.map((a) =>
                                    <Link className="list-group-item list-group-item-action" key={`article-${a.id}`} to={`/article/${a.id}`}>{a.title}</Link>,
                                )}
                                <Link to={`/article/add`}>
                                    <button type="button" className="btn btn-primary btn-lg btn-block mt-3">Add Article</button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </>
            }
        </>;
    }
}

const mapStateToProps = (states: RootState, ownProps: OwnProps): StateProps => {
    return {
        articles: states.article.articles,
        blog: states.blog.selectedBlog,
        canEdit: states.blog.selectedBlog?.owner.id === states.user.currentUser?.id,
    };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, any>, ownProps: OwnProps): DispatchProps => {
    return {
        loadBlog: async (blogId) => {
            await dispatch(thunkSelectBlog(blogId));
            await dispatch(thunkLoadArticles(blogId));
        },
        deleteBlog: async (blogId) => {
            await dispatch(thunkDeleteBlog(blogId));
        },
    };
};

export const FCBlog = connect(
    mapStateToProps,
    mapDispatchToProps,
)(withRouter(BlogComponent));
