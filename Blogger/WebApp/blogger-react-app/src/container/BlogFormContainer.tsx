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
import { thunkCreateBlog, thunkUpdateBlog } from '../store/blog';
import { withRouter, RouteComponentProps } from 'react-router-dom';


interface OwnProps {
    isUpdatingBlog: boolean
}

interface DispatchProps {
    updateBlog: (blogId: number, blogUpdate: v.BlogCreateView) => Promise<void>
    addBlog: (blogAdd: v.BlogCreateView) => Promise<void>
}

interface StateProps {
    blog: v.BlogView | undefined
}

type Props = StateProps & OwnProps & DispatchProps & RouteComponentProps

type State = {
};

export class BlogFormComponent extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {};
        this.handleClick = this.handleClick.bind(this);
    }

    async handleClick(value: v.BlogCreateView) {
        if (this.props.isUpdatingBlog) {
            await this.props.updateBlog(this.props.blog!.id, value);
        } else {
            await this.props.addBlog(value);
        }

        this.props.history.goBack();
    }


    render() {
        const isEditing = this.props.isUpdatingBlog;

        const initialValues: v.BlogCreateView = (isEditing ?
            { title: this.props.blog!.title, about: this.props.blog!.about }
            :
            { title: "A Blog", about: "About some stuff" }
        );

        return <Formik initialValues={initialValues}
            onSubmit={this.handleClick}>{(props) =>
                <Form>
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <Field name="title" className="form-control" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="about">About</label>
                        <Field name="about" className="form-control"/>
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
        blog: states.blog.selectedBlog
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, any>): DispatchProps => {
    return {
        addBlog: async (add: v.BlogCreateView) => {
            await dispatch(thunkCreateBlog(add));
        },
        updateBlog: async (blogId: number, update: v.BlogCreateView) => {
            await dispatch(thunkUpdateBlog(blogId, update));
        }
    }
}

export const FCBlogForm = connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(BlogFormComponent))