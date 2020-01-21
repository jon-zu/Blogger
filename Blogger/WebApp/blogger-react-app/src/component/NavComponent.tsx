import {
    Field,
    Form,
    Formik,
    FormikHelpers,
} from "formik";
import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { ThunkDispatch } from "redux-thunk";
import * as v from "../api/views";
import { RootState, BlogThunkDispatch } from "../store";
import { thunkLoadBlogs } from "../store/blog";
import { thunkLogin, thunkLoginCheck } from "../store/user";


const initialLoginFormValues = {
    password: "User123!",
    username: "user",
};

type LoginFormValues = typeof initialLoginFormValues;

type Props = StateProps & DispatchProps;

export class NavComponent extends React.Component<Props> {
    constructor(props: Props) {
        super(props);

        this.state = {

        };
        this.handleLoginClick = this.handleLoginClick.bind(this);
    }

    public async componentDidMount() {
        await this.props.login_check();
        await this.props.refresh_blogs();
    }

    public async handleLoginClick(value: LoginFormValues, actions: FormikHelpers<LoginFormValues>) {
        await this.props.login(value.username, value.password);
    }

    public render() {
        const { blogs, user } = this.props;
        const isLoggedIn = user !== undefined;

        // tslint:disable-next-line: jsx-no-multiline-js
        const loginForm = () => <Formik
            initialValues={initialLoginFormValues}
            onSubmit={this.handleLoginClick}
        // tslint:disable-next-line: jsx-no-multiline-js
        >{(props) =>
            <Form>
                <div className="form-group">
                    <label htmlFor="username">User Name</label>
                    <Field type="text" name="username" className="form-control" />

                    <label htmlFor="password">Password</label>
                    <Field type="password" name="password" className="form-control" />
                </div>

                <button type="submit" className="btn btn-primary" disabled={props.isSubmitting}>
                    Submit
                </button>
            </Form>
            }
        </Formik>;


        const nav = () => <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon" />
                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav">
                            <Link to="/" className="navbar-brand">Blogger</Link>
                            {blogs?.map((blog) =>
                                <li key={`blog-${blog.id}`} className="nav-item">
                                    <Link to={`/blog/${blog.id}`} className="nav-link">{blog.title}</Link>
                                </li>)
                            }
                        </ul>

                        <ul className="navbar-nav ml-auto">
                            <Link to={`/blog/add`}>
                                <button type="button" className="btn btn-primary">Add Blog</button>
                            </Link>
                        </ul>
                    </div>
                </div>
            </nav>
        </>

        return isLoggedIn ? nav() : loginForm();
    }
}

const mapStateToProps = (states: RootState) => {
    return {
        blogs: states.blog.blogs,
        user: states.user.currentUser,
    };
};

const mapDispatchToProps = (dispatch: BlogThunkDispatch) => {
    return {
        login: async (username: string, password: string) => {
            await dispatch(thunkLogin(username, password));
            await dispatch(thunkLoadBlogs());
        },
        login_check: () => dispatch(thunkLoginCheck()),
        refresh_blogs: () => dispatch(thunkLoadBlogs()),
    };
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

export const FCNav = connect(
    mapStateToProps,
    mapDispatchToProps,
)(NavComponent);
