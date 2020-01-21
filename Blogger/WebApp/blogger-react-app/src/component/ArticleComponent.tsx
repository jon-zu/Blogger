import {
    Field,
    Form,
    Formik,
    FormikHelpers,
} from "formik";
import React from "react";
import { connect } from "react-redux";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import { ThunkDispatch } from "redux-thunk";
import * as v from "../api/views";
import { BlogThunkDispatch, RootState } from "../store";
import { thunkDeleteArticle, thunkSelectArticle } from "../store/article";
import { thunkCreateComment, thunkLoadComments } from "../store/comment";
import { CommentComponent } from "./CommentComponent";

interface OwnProps {
    articleId: number;
}

type Props = StateProps & OwnProps & DispatchProps & RouteComponentProps;

export class ArticleComponent extends React.Component<Props> {
    constructor(props: Props) {
        super(props);

        this.state = {};
        this.deleteArticle = this.deleteArticle.bind(this);
        this.handleAddComment = this.handleAddComment.bind(this);
    }

    public async componentDidMount() {
        await this.props.loadArticle(this.props.articleId);
    }

    public async deleteArticle() {
        await this.props.deleteArticle(this.props.articleId);
        this.props.history.push("/");
    }

    public async handleAddComment(value: v.CommentCreateView, actions: FormikHelpers<v.CommentCreateView>) {
        await this.props.addComment(value);
        actions.resetForm();
    }

    public displayTime(date: Date) {
        const now = new Date(Date.now());
        const d = new Date(date);
        let expired: number = now.getTime() - d.getTime();

        expired /= 1000;
        if (expired < 60) {
            return `${Math.floor(expired)} seconds`;
        }

        expired /= 60;
        if (expired < 60) {
            return `${Math.floor(expired)} minutes`;
        }

        expired /= 60;
        if (expired < 24) {
            return `${Math.floor(expired)}} hours`;
        }

        expired /= 24;
        return `${Math.floor(expired)}} days`;
    }

    public render() {
        const initalCommentValues: v.CommentCreateView = {
            articleId: this.props.articleId,
            content: "...",
        };

        const { article, comments, canEdit } = this.props;
        const isLoading = article === undefined;

        const loader = <>
            <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </>;

        const edit = () => <>
            <div className="row mt-1 justify-content-end">
                <div className="col-sm-1">
                    <Link to={`/article/edit`}>
                        <button type="button" className="btn btn-primary">Edit</button>
                    </Link>
                </div>

                <div className="col-sm-1">
                    <button type="button" className="btn btn-danger" onClick={this.deleteArticle}>Delete</button>
                </div>
            </div>
        </>;

        const page = () => <>
            {canEdit && edit()}

            <div className="row mt-3">
                <div className="col-md-12">
                    <h1>{article!.title}</h1>
                    <p>{article!.content}</p>
                </div>
            </div>

            <div className="row mt-3">
                <div className="col-sm-1">
                    <h3 className="font-weight-light">Comments:</h3>
                </div>
            </div>

            <div className="row mt-3 overflow-auto">
                {comments?.map((c) => <CommentComponent comment={c} key={`comment-${c.id}`} />)}
                <div className="col-md-8">
                    <Formik
                        initialValues={initalCommentValues}
                        onSubmit={this.handleAddComment}
                    >
                        {(formProps) => (
                            <Form>
                                <div className="form-group">
                                    <Field type="text" name="content" className="form-control" />
                                </div>
                                <button type="submit" className="btn btn-primary" disabled={formProps.isSubmitting}>
                                    Post
                                </button>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </>;

        return isLoading ? loader : page();
    }
}

const mapStateToProps = (states: RootState) => {
    return {
        article: states.article.selectedArticle,
        canEdit: states.article.selectedArticle?.owner.id === states.user.currentUser?.id,
        comments: states.comment.comments,
        user: states.user.currentUser!,
    };
};

const mapDispatchToProps = (dispatch: BlogThunkDispatch) => {
    return {
        addComment: (create: v.CommentCreateView) =>
            dispatch(thunkCreateComment(create)),
        deleteArticle: (articleId: number) =>
            dispatch(thunkDeleteArticle(articleId)),
        loadArticle: async (articleId: number) => {
            await dispatch(thunkSelectArticle(articleId));
            await dispatch(thunkLoadComments(articleId));
        },
    };
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

export const FCArticle = connect(
    mapStateToProps,
    mapDispatchToProps,
)(withRouter(ArticleComponent));
