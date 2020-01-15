import React from 'react';
import * as api  from '../api/client';
import * as v from '../api/views';
import {
    Formik,
    FormikHelpers,
    FormikProps,
    Form,
    Field,
    FieldProps,
} from 'formik';

interface LoginFormValues {
    username: string,
    password: string
}

class Props {

};

class State {
    user: v.UserView | undefined
}

export class UserComponent extends React.Component<Props, State> {
    constructor() {
        var props = new Props;
        super(props);

        this.state = { user: undefined };
        this.handleClick = this.handleClick.bind(this);
    }

    async handleClick(value: LoginFormValues, actions: FormikHelpers<LoginFormValues>) {
        var client = new api.BlogClient("https://localhost:5001");
        await new Promise(resolve => setTimeout(resolve, 3000));
        await client.login({
            username: value.username,
            password: value.password
        });

        var user = await client.currentUser();
        this.setState({ user: user! })
    }


    render() {
        const initialValues: LoginFormValues = { username: "a", password: "b" };
        var user = this.state.user;
        var isLoggedIn = user != undefined;

        return <div>
            {isLoggedIn ?
                <>
                    <h1>{user!.id}</h1>
                    <h2>{user!.name}</h2>
                </>
                :
                <>
                    <Formik
                        initialValues={initialValues}
                        onSubmit={this.handleClick}
                        render={formikBag => (
                            <Form>
                                <label htmlFor="username">User Name</label>
                                <Field name="username" placeholder="a" />

                                <label htmlFor="password">Password</label>
                                <Field type="password" name="password" placeholder="b" />

                                <button type="submit" disabled={formikBag.isSubmitting}>
                                    Submit
                                </button>
                            </Form>
                        )}
                    />
                </>}
        </div>
    }
}