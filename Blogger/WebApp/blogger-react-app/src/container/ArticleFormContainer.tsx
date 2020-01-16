import {
    Field,
    Form,
    Formik,
} from "formik";
import React from "react";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { ThunkDispatch } from "redux-thunk";
import * as v from "../api/views";
import { RootState } from "../store";
import { thunkCreateArticle, thunkUpdateArticle } from "../store/article";

interface ArticleFormValues {
    title: string;
    content: string;
}

interface OwnProps {
    isUpdatingArticle: boolean;
}

interface DispatchProps {
    updateArticle: (articleId: number, articleUpdate: v.ArticleCreateView) => Promise<void>;
    addArticle: (articleAdd: v.ArticleCreateView) => Promise<void>;
}

interface StateProps {
    article: v.ArticleView | undefined;
    blog: v.BlogView | undefined;
}

type Props = StateProps & OwnProps & DispatchProps & RouteComponentProps;

interface State {
}

export class ArticleFormComponent extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {};
        this.handleClick = this.handleClick.bind(this);
    }

    public async handleClick(value: ArticleFormValues) {
        if (this.props.isUpdatingArticle) {

            await this.props.updateArticle(this.props.article!.id, {
                blogId: 0,
                content: value.content,
                title: value.title,
            });
        } else {
            await this.props.addArticle({
                blogId: this.props.blog!.id,
                content: value.content,
                title: value.title,
            });
        }

        this.props.history.goBack();
    }

    public render() {
        const isEditing = this.props.isUpdatingArticle;

        const initialValues: ArticleFormValues = (isEditing ?
            { title: this.props.article!.title, content: this.props.article!.content }
            :
            { title: "An Article", content: "Lorem" }
        );

        return <Formik initialValues={initialValues}
            onSubmit={this.handleClick}>{(props) =>
                <Form>
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <Field type="text" name="title" className="form-control" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="content">About</label>
                        <Field type="text" component="textarea" name="content" className="form-control"/>
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={props.isSubmitting}>
                        {isEditing ? "Edit" : "Add"}
                    </button>
                </Form>
            }
        </Formik>;
    }
}

const mapStateToProps = (states: RootState): StateProps => {
    return {
        article: states.article.selectedArticle,
        blog: states.blog.selectedBlog,
    };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, any>): DispatchProps => {
    return {
        addArticle: async (add: v.ArticleCreateView) => {
            await dispatch(thunkCreateArticle(add));
        },
        updateArticle: async (articleId: number, update: v.ArticleCreateView) => {
            await dispatch(thunkUpdateArticle(articleId, update));
        },
    };
};

export const FCArticleForm = connect(
    mapStateToProps,
    mapDispatchToProps,
)(withRouter(ArticleFormComponent));
