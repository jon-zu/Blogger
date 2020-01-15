import React from 'react';
import { ThunkDispatch } from 'redux-thunk';
import { RootState } from '../store';
import { connect } from 'react-redux'
import * as v from '../api/views';
import { thunkSelectArticle } from '../store/article';
import { thunkLoadComments } from '../store/comment';

interface OwnProps {
    articleId: number
}

interface DispatchProps {
    loadArticle: (articleId: number) => Promise<void>
}

interface StateProps {
    article: v.ArticleView | undefined,
    comments: v.CommentView[]
}

type Props = StateProps & OwnProps & DispatchProps

type State = {
};

export class ArticleComponent extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {};
    }

    async componentDidMount() {
        await this.props.loadArticle(this.props.articleId);
    }

    render() {
        var { article, comments } = this.props;
        const isLoading = article === undefined;

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
                        <h1>{article!.title}</h1>
                        <h2>{article!.about}</h2>
                        <h3>{article!.content}</h3>
                    </div>

                    <ul>
                    {comments?.map(a => 
                        <li key={`comment-${a.id}`}>
                             <h1>{a.content}</h1>
                        </li>
                    )}
                    </ul>
                </>
            }</div>
    }
}

const mapStateToProps = (states: RootState, ownProps: OwnProps): StateProps => {
    return {
        comments: states.comment.comments,
        article: states.article.selectedArticle
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, any>, ownProps: OwnProps): DispatchProps => {
    return {
        loadArticle: async (articleId) => {
            await dispatch(thunkSelectArticle(articleId));
            await dispatch(thunkLoadComments(articleId))
        }
    }
}

export const FCArticle = connect(
    mapStateToProps,
    mapDispatchToProps
)(ArticleComponent)