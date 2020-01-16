import React from 'react';
import * as v from '../api/views';
import {
    Formik,
    FormikHelpers,
    Form,
    Field,
} from 'formik';
import { ThunkDispatch } from 'redux-thunk';
import { RootState } from '../store';
import { thunkLogin, thunkLoginCheck } from '../store/user';
import { connect } from 'react-redux'
import { thunkLoadBlogs } from '../store/blog';
import { Link } from "react-router-dom";

interface LoginFormValues {
    username: string,
    password: string
}

interface OwnProps {
}

interface DispatchProps {
    login: (username: string, password: string) => Promise<void>
    login_check: () => Promise<void>
    refresh_blogs: () => Promise<void>
}

interface StateProps {
    user: v.UserView | undefined
    blogs: v.BlogView[]
}

type Props = StateProps & OwnProps & DispatchProps

type State = {
};

export class NavComponent extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {

        };
        this.handleLoginClick = this.handleLoginClick.bind(this);
    }

    async componentDidMount() {
        await this.props.login_check();
        await this.props.refresh_blogs();
    }

    async handleLoginClick(value: LoginFormValues, actions: FormikHelpers<LoginFormValues>) {
        await this.props.login(value.username, value.password);
    }

    render() {
        const initialValues: LoginFormValues = { username: "user", password: "User123!" };
        var { blogs, user } = this.props;
        var isLoggedIn = user != undefined;

        return <>
            {isLoggedIn ?
                <>
                    <nav className="navbar navbar-expand-lg navbar-light bg-light">
                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>

                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav">
                                <Link to="/" className="navbar-brand">Blogger</Link>
                                {blogs?.map(blog =>
                                    <li key={`blog-${blog.id}`} className="nav-item">
                                        <Link to={`/blog/${blog.id}`} className="nav-link">{blog.title}</Link>
                                    </li>)
                                }
                            </ul>

                            <ul className="navbar-nav ml-auto">
                                <Link to={`/blog/add`}><button className="btn btn-primary">Add Blog</button></Link>
                            </ul>
                        </div>
                    </nav>
                </>
                :
                <>
                    <Formik initialValues={initialValues}
                        onSubmit={this.handleLoginClick}>{(props) =>
                            <Form>
                                <label htmlFor="username">User Name</label>
                                <Field name="username" />

                                <label htmlFor="password">Password</label>
                                <Field type="password" name="password" />

                                <button type="submit" disabled={props.isSubmitting}>
                                    Submit
                                </button>
                            </Form>
                        }
                    </Formik>
                </>}
        </>
    }
}

const mapStateToProps = (states: RootState, ownProps: OwnProps): StateProps => {
    return {
        user: states.user.currentUser,
        blogs: states.blog.blogs
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, any>, ownProps: OwnProps): DispatchProps => {
    return {
        login: async (username, password) => {
            await dispatch(thunkLogin(username, password))
            await dispatch(thunkLoadBlogs())
        },
        refresh_blogs: async () => {
            await dispatch(thunkLoadBlogs())
        },
        login_check: async () => {
            await dispatch(thunkLoginCheck());
        }
    }
}

export const FCNav = connect(
    mapStateToProps,
    mapDispatchToProps
)(NavComponent)