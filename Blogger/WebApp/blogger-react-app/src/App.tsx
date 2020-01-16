import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, RouteComponentProps, Switch } from "react-router-dom";
import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import { BlogClient } from "./api/client";
import "./App.css";
import { FCArticle } from "./component/ArticleComponent";
import { FCBlog } from "./component/BlogComponent";
import { FCNav } from "./component/NavComponent";
import { FCArticleForm } from "./container/ArticleFormContainer";
import { FCBlogForm } from "./container/BlogFormContainer";
import { rootReducer } from "./store";

const store = createStore(
  rootReducer,
  applyMiddleware(thunk.withExtraArgument(new BlogClient("https://localhost:5001"))),
);

const EmptyPage: React.FC = () => {
  return (
    <h1>Nothing!!!</h1>
  );
};

export interface IdMatchParams {
  id: string;
}

export interface IdMatchProps extends RouteComponentProps<IdMatchParams> {
}

export interface NoMatchParams {}

export interface NoMatchProps extends RouteComponentProps<NoMatchParams> {
}

const NoMatch = (props: NoMatchProps) => (
  <div>
    <h3>No match for <code>{props.location.pathname}</code></h3>
  </div>
);

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <header>
            <FCNav />
          </header>
          <div id="route-container">
            <div className="container">

              <Switch>
                <Route path="/" exact={true} component={EmptyPage} />

                <Route
                  path="/blog/:id(\d+)"
                  render={(props: IdMatchProps) =>
                  <FCBlog
                    blogId={+props.match.params.id} key={props.match.params.id} />}
                />
                <Route path="/blog/add" render={(_props) => <FCBlogForm isUpdatingBlog={false} />} />
                <Route path="/blog/edit" render={(_props) => <FCBlogForm isUpdatingBlog={true} />} />

                <Route
                  path="/article/:id(\d+)"
                  render={(props: IdMatchProps) =>
                  <FCArticle articleId={+props.match.params.id} key={props.match.params.id} />}
                />
                <Route path="/article/add" render={() => <FCArticleForm isUpdatingArticle={false} />} />
                <Route path="/article/edit" render={() => <FCArticleForm isUpdatingArticle={true} />} />

                <Route component={NoMatch} />
              </Switch>
            </div>
          </div>
        </div>
      </Router>
    </Provider>
  );
};

export default App;
