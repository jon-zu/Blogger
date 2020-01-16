import * as v from '../api/views';
import React from 'react';
import {
    Formik,
    Form,
    Field,
} from 'formik';
import { RootState } from '../store';
import { ThunkDispatch } from 'redux-thunk';
import { connect } from 'react-redux';
import { thunkCreateArticle, thunkUpdateArticle } from '../store/article';
import { withRouter, RouteComponentProps } from 'react-router-dom';

interface ArticleFormValues {
    title: string,
    content: string
}

interface OwnProps {
    isUpdatingArticle: boolean,
}

interface DispatchProps {
    updateArticle: (articleId: number, articleUpdate: v.ArticleCreateView) => Promise<void>
    addArticle: (articleAdd: v.ArticleCreateView) => Promise<void>
}

interface StateProps {
    article: v.ArticleView | undefined
    blog: v.BlogView | undefined
}

type Props = StateProps & OwnProps & DispatchProps & RouteComponentProps

type State = {
};

export class ArticleFormComponent extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {};
        this.handleClick = this.handleClick.bind(this);
    }

    async handleClick(value: ArticleFormValues) {
        if (this.props.isUpdatingArticle) {
            
            await this.props.updateArticle(this.props.article!.id, {
                content: value.content,
                title: value.title,
                blogId: 0
            });
        } else {
            await this.props.addArticle({
                content: value.content,
                title: value.title,
                blogId: this.props.blog!.id
            });
        }

        this.props.history.goBack();
    }


    render() {
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
                        <Field name="title" className="form-control" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="content">About</label>
                        <Field component="textarea" name="content" className="form-control"/>
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
        blog: states.blog.selectedBlog
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, any>): DispatchProps => {
    return {
        addArticle: async (add: v.ArticleCreateView) => {
            await dispatch(thunkCreateArticle(add));
        },
        updateArticle: async (articleId: number, update: v.ArticleCreateView) => {
            await dispatch(thunkUpdateArticle(articleId, update));
        }
    }
}

export const FCArticleForm = connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(ArticleFormComponent))