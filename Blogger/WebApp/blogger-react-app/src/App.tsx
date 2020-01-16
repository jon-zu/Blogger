import React from 'react';
import './App.css';
import { FCNav } from './component/NavComponent';
import { rootReducer } from './store';
import { BlogClient } from './api/client';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route, RouteComponentProps, Switch } from 'react-router-dom'
import { FCBlog } from './component/BlogComponent';
import { FCArticle } from './component/ArticleComponent';
import { FCBlogForm } from './container/BlogFormContainer';
import { FCArticleForm } from './container/ArticleFormContainer';


const store = createStore(
  rootReducer,
  applyMiddleware(thunk.withExtraArgument(new BlogClient("https://localhost:5001"))),
);

const EmptyPage: React.FC = () => {
  return (
    <h1>Nothing!!!</h1>
  );
}


export interface IdMatchParams {
  id: string;
}

export interface IdMatchProps extends RouteComponentProps<IdMatchParams> {
}

export interface NoMatchParams {
}

export interface NoMatchProps extends RouteComponentProps<NoMatchParams> {
}


const NoMatch = (props: NoMatchProps) => (
  <div>
    <h3>No match for <code>{props.location.pathname}</code></h3>
  </div>
)

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <header>
            <FCNav></FCNav>
          </header>
          <div id="route-container">
            <div className="container">

              <Switch>
                <Route path="/" exact component={EmptyPage} />
                <Route path="/blog/:id(\d+)" render={(props: IdMatchProps) => <FCBlog blogId={+props.match.params.id} key={props.match.params.id} />} />
                <Route path="/blog/add" render={_props => <FCBlogForm isUpdatingBlog={false} />} />
                <Route path="/blog/edit" render={_props => <FCBlogForm isUpdatingBlog={true} />} />

                ///article/1
                ///article/1
                <Route path="/article/:id(\d+)" render={(props: IdMatchProps) => <FCArticle articleId={+props.match.params.id} key={props.match.params.id} />} />
                <Route path="/article/add" render={_props => <FCArticleForm isUpdatingArticle={false} />} />
                <Route path="/article/edit" render={_props => <FCArticleForm isUpdatingArticle={true} />} />

                <Route component={NoMatch} />
              </Switch>
            </div>
          </div>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
