import React from 'react';
import { ThunkDispatch } from 'redux-thunk';
import { RootState } from '../store';
import { connect } from 'react-redux'
import * as v from '../api/views';
import { thunkSelectBlog, thunkDeleteBlog } from '../store/blog';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom'
import { thunkLoadArticles } from '../store/article';

interface OwnProps {
    blogId: number
}

interface DispatchProps {
    loadBlog: (blogId: number) => Promise<void>
    deleteBlog: (blogId: number) => Promise<void>
}

interface StateProps {
    blog: v.BlogView | undefined,
    articles: v.ArticleView[],
    canEdit: boolean
}

type Props = StateProps & OwnProps & DispatchProps & RouteComponentProps

type State = {
};

export class BlogComponent extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {};

        this.deleteBlog = this.deleteBlog.bind(this);
    }

    async componentDidMount() {
        await this.props.loadBlog(+this.props.blogId);
    }

    async deleteBlog() {
        await this.props.deleteBlog(this.props.blogId);
        this.props.history.push("/");
    }

    render() {
        var { blog, articles, canEdit } = this.props;
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
                                <Link to={`/blog/edit`}>
                                    <button type="button" className="btn btn-primary">Edit</button>
                                </Link>

                                <button type="button" className="btn btn-danger ml-1" onClick={this.deleteBlog}>Delete</button>
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
                        <h3 className="font-weight-light">Articles:</h3>
                    </div>

                    <div className="row mt-3 overflow-auto">
                        <div className="col align-self-center">
                            <div className="list-group">
                                {articles?.map(a =>
                                    <Link className="list-group-item list-group-item-action" key={`article-${a.id}`} to={`/article/${a.id}`}>{a.title}</Link>
                                )}
                                <Link to={`/article/add`}>
                                    <button type="button" className="btn btn-primary btn-lg btn-block mt-3">Add Article</button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </>
            }
        </>
    }
}

const mapStateToProps = (states: RootState, ownProps: OwnProps): StateProps => {
    return {
        articles: states.article.articles,
        blog: states.blog.selectedBlog,
        canEdit: states.blog.selectedBlog?.owner.id === states.user.currentUser?.id
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, any>, ownProps: OwnProps): DispatchProps => {
    return {
        loadBlog: async (blogId) => {
            await dispatch(thunkSelectBlog(blogId));
            await dispatch(thunkLoadArticles(blogId))
        },
        deleteBlog: async (blogId) => {
            await dispatch(thunkDeleteBlog(blogId));
        }
    }
}

export const FCBlog = connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(BlogComponent))