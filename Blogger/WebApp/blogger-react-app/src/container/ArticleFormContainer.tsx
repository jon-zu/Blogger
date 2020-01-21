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
import { RootState, BlogThunkDispatch } from "../store";
import { thunkCreateArticle, thunkUpdateArticle } from "../store/article";

const initialArticleFormValues = {
    content: "B",
    title: "A",
};

type ArticleFormValues = typeof initialArticleFormValues;

interface OwnProps {
    isUpdatingArticle: boolean;
}
type Props = StateProps & OwnProps & DispatchProps & RouteComponentProps;

export class ArticleFormComponent extends React.Component<Props> {
    constructor(props: Props) {
        super(props);

        this.state = {};
        this.handleClick = this.handleClick.bind(this);
    }

    public async handleClick(value: ArticleFormValues) {
        const {isUpdatingArticle, article, blog} = this.props;

        const newArticle = {
            blogId: isUpdatingArticle ? 0 : blog!.id,
            content: value.content,
            title: value.title
        };


        if (isUpdatingArticle) {
            await this.props.updateArticle(article!.id, newArticle);
        } else {
            await this.props.addArticle(newArticle);
        }

        this.props.history.goBack();
    }

    public render() {
        const isEditing = this.props.isUpdatingArticle;

        const initialValues: ArticleFormValues = (isEditing ?
            { title: this.props.article!.title, content: this.props.article!.content }
            :
            initialArticleFormValues
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

const mapStateToProps = (states: RootState) => {
    return {
        article: states.article.selectedArticle,
        blog: states.blog.selectedBlog,
    };
};

const mapDispatchToProps = (dispatch: BlogThunkDispatch) => {
    return {
        addArticle: (add: v.ArticleCreateView) =>
            dispatch(thunkCreateArticle(add)),
        updateArticle: async (articleId: number, update: v.ArticleCreateView) =>
            dispatch(thunkUpdateArticle(articleId, update)),
    };
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

export const FCArticleForm = connect(
    mapStateToProps,
    mapDispatchToProps,
)(withRouter(ArticleFormComponent));
