import React from 'react';
import { ThunkDispatch } from 'redux-thunk';
import { RootState } from '../store';
import { connect } from 'react-redux'
import * as v from '../api/views';
import { thunkSelectArticle, thunkDeleteArticle } from '../store/article';
import { thunkLoadComments, thunkCreateComment } from '../store/comment';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import {
    Formik,
    FormikHelpers,
    Form,
    Field,
} from 'formik';

interface OwnProps {
    articleId: number
}

interface DispatchProps {
    loadArticle: (articleId: number) => Promise<void>
    deleteArticle: (articleId: number) => Promise<void>
    addComment: (create: v.CommentCreateView) => Promise<void>
}

interface StateProps {
    article: v.ArticleView | undefined,
    comments: v.CommentView[],
    user: v.UserView,
    canEdit: boolean
}

type Props = StateProps & OwnProps & DispatchProps & RouteComponentProps

type State = {
};

export class ArticleComponent extends React.Component<Props, State> {
    constructor(props: Props) {
        console.log("article: " + props.articleId);
        super(props);

        this.state = {};
        this.deleteArticle = this.deleteArticle.bind(this);
        this.handleAddComment = this.handleAddComment.bind(this);
    }

    async componentDidMount() {
        await this.props.loadArticle(this.props.articleId);
    }

    async deleteArticle() {
        await this.props.deleteArticle(this.props.articleId);
        this.props.history.push("/");
    }

    async handleAddComment(value: v.CommentCreateView, actions: FormikHelpers<v.CommentCreateView>) {
        await this.props.addComment(value);
        actions.resetForm();
    }

    displayTime(date: Date) {
        var now = new Date(Date.now());
        var d = new Date(date);
        var expired: number = now.getTime() - d.getTime();

        expired /= 1000;
        if(expired < 60) {
            return `${Math.floor(expired)} seconds`;
        }

        expired /= 60
        if(expired < 60) {
            return `${Math.floor(expired)} minutes`;
        }

        expired /= 60
        if(expired < 24) {
            return `${Math.floor(expired)}} hours`;
        }

        expired /= 24;
        return `${Math.floor(expired)}} days`;
    }

    render() {
        const initalCommentValues: v.CommentCreateView = {
            content: "...",
            articleId: this.props.articleId
        };

        var { article, comments, canEdit } = this.props;
        const isLoading = article === undefined;

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
                                <Link to={`/article/edit`}>
                                    <button type="button" className="btn btn-primary">Edit</button>
                                </Link>

                                <button type="button" className="btn btn-danger ml-1" onClick={this.deleteArticle}>Delete</button>
                            </div>
                        </>
                    }

                    <div className="row mt-3">
                        <div className="col-md-12">
                            <h1>{article!.title}</h1>
                            <p>{article!.content}</p>
                        </div>
                    </div>

                    <div className="row mt-3">
                        <h3 className="font-weight-light">Comments:</h3>
                    </div>


                    <div className="row mt-3 overflow-auto">
                        {comments?.map(c =>
                            <div className="col-md-8" key={`comment-${c.id}`}>
                                <div className="media g-mb-30 media-comment">
                                    <div className="media-body u-shadow-v18 g-bg-secondary g-pa-30">
                                        <div className="g-mb-15">
                                            <h5 className="h5 g-color-gray-dark-v1 mb-0">{c.owner.name}</h5>
                                            <span className="g-color-gray-dark-v4 g-font-size-12">{this.displayTime(c.createdAt)}</span>
                                        </div>

                                        <p>{c.content}</p>
                                    </div>
                                </div>
                            </div>)}
                        <div className="col-md-8">
                            <Formik initialValues={initalCommentValues}
                                onSubmit={this.handleAddComment}>{(props) =>
                                    <Form>
                                        <div className="form-group">
                                            <Field name="content" className="form-control" />
                                        </div>

                                        <button type="submit" className="btn btn-primary" disabled={props.isSubmitting}>
                                            Post
                                    </button>
                                    </Form>
                                }
                            </Formik>
                        </div>
                    </div>
                </>
            }
        </>
    }
}

const mapStateToProps = (states: RootState): StateProps => {
    return {
        comments: states.comment.comments,
        article: states.article.selectedArticle,
        user: states.user.currentUser!,
        canEdit: states.article.selectedArticle?.owner.id === states.user.currentUser?.id
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, any>): DispatchProps => {
    return {
        loadArticle: async (articleId) => {
            await dispatch(thunkSelectArticle(articleId));
            await dispatch(thunkLoadComments(articleId))
        },
        deleteArticle: async (articleId) => {
            await dispatch(thunkDeleteArticle(articleId));
        },
        addComment: async (create) => {
            await dispatch(thunkCreateComment(create));
        }
    }
}

export const FCArticle = connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(ArticleComponent))