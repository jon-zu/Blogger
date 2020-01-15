import React from 'react';
import { ThunkDispatch } from 'redux-thunk';
import { RootState } from '../store';
import { connect } from 'react-redux'
import * as v from '../api/views';
import { thunkSelectBlog } from '../store/blog';
import {Link, withRouter} from "react-router-dom";
import { thunkLoadArticles } from '../store/article';

interface OwnProps {
    blogId: number
}

interface DispatchProps {
    loadBlog: (blogId: number) => Promise<void>
}

interface StateProps {
    blog: v.BlogView | undefined,
    articles: v.ArticleView[]
}

type Props = StateProps & OwnProps & DispatchProps

type State = {
};

export class BlogComponent extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {};
    }

    async componentDidMount() {
        await this.props.loadBlog(this.props.blogId);
    }

    render() {
        var { blog, articles } = this.props;
        const isLoading = blog === undefined;

        return <div>
            {isLoading ?
                <>
                    <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </>
                :
                <>
                    <div>
                        <h1>{blog!.title}</h1>
                        <h2>{blog!.about}</h2>
                    </div>

                    <ul>
                    {articles?.map(a => 
                        <li key={`article-${a.id}`}>
                             <Link to={`/article/${a.id}`}>{a.title}</Link>
                        </li>
                    )}
                    </ul>
                </>
            }</div>
    }
}

const mapStateToProps = (states: RootState, ownProps: OwnProps): StateProps => {
    return {
        articles: states.article.articles,
        blog: states.blog.selectedBlog
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, any>, ownProps: OwnProps): DispatchProps => {
    return {
        loadBlog: async (blogId) => {
            await dispatch(thunkSelectBlog(blogId));
            await dispatch(thunkLoadArticles(blogId))
        }
    }
}

export const FCBlog = connect(
    mapStateToProps,
    mapDispatchToProps
)(BlogComponent)