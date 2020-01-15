import React from 'react';
import './App.css';
import { FCNav } from './component/NavComponent';
import { rootReducer } from './store';
import { BlogClient } from './api/client';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route, RouteComponentProps } from 'react-router-dom'
import { FCBlog } from './component/BlogComponent';
import { FCArticle } from './component/ArticleComponent';


const store = createStore(
  rootReducer,
  applyMiddleware(thunk.withExtraArgument(new BlogClient("https://localhost:5001"))),
);

const EmptyPage: React.FC = () => {
  return (
    <h1>Nothing!!!</h1>
  );
}


interface IdMatchParams {
  id: string;
}

interface IdMatchProps extends RouteComponentProps<IdMatchParams> {
}

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <FCNav></FCNav>
          <div id="route-container">
              <Route path="/" exact component={EmptyPage} />
              <Route path="/blog/:id" render={(props: IdMatchProps) => <FCBlog blogId={+props.match.params.id} />}/>
              <Route path="/article/:id" render={(props: IdMatchProps) => <FCArticle articleId={+props.match.params.id} />}/>
            </div>
        </div>
      </Router>
    </Provider>
  );
}

//<Route path="/blog/:blogId"><FCBlog blogId={1}/></Route>
export default App;
