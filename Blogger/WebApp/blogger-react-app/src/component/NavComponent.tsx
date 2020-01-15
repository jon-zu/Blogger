import React from 'react';
import * as api from '../api/client';
import * as v from '../api/views';
import {
    Formik,
    FormikHelpers,
    Form,
    Field,
} from 'formik';
import { ThunkDispatch } from 'redux-thunk';
import { RootState } from '../store';
import { thunkLogin } from '../store/user';
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
        await this.props.refresh_blogs();
    }

    async handleLoginClick(value: LoginFormValues, actions: FormikHelpers<LoginFormValues>) {
        await this.props.login(value.username, value.password);
    }

    render() {
        const initialValues: LoginFormValues = { username: "user", password: "User123!" };
        var { blogs, user } = this.props;
        var isLoggedIn = user != undefined;

        return <div>
            {isLoggedIn ?
                <>
                    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>

                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav mr-auto">
                                <a className="navbar-brand" href="#">Blogger</a>
                                <li key="home" className="nav-item active">
                                    <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
                                </li>
                                {blogs?.map(blog => 
                                    <li key={`blog-${blog.id}`} className="nav-item">
                                        <Link to={`/blog/${blog.id}`}>{blog.title}</Link>
                                    </li>)
                                }
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
        </div>
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
            console.log("login");
            await dispatch(thunkLoadBlogs())
            console.log("blog");
            console.log('Login completed [UI]')
        },
        refresh_blogs: async () => {
            await dispatch(thunkLoadBlogs())
            console.log("loading blogs...")
        }
    }
}

export const FCNav = connect(
    mapStateToProps,
    mapDispatchToProps
)(NavComponent)