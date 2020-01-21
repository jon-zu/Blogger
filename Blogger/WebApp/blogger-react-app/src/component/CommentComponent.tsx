import React from "react";
import * as v from "../api/views";

interface Props {
    comment: v.CommentView;
}

export class CommentComponent extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    public displayTime(date: Date) {
        const now = new Date(Date.now());
        const d = new Date(date);
        let expired: number = now.getTime() - d.getTime();

        expired /= 1000;
        if (expired < 60) {
            return `${Math.floor(expired)} seconds`;
        }

        expired /= 60;
        if (expired < 60) {
            return `${Math.floor(expired)} minutes`;
        }

        expired /= 60;
        if (expired < 24) {
            return `${Math.floor(expired)}} hours`;
        }

        expired /= 24;
        return `${Math.floor(expired)}} days`;
    }

    public render() {
        const { comment } = this.props;
        return <div className="col-md-8">
            <div className="media g-mb-30 media-comment">
                <div className="media-body u-shadow-v18 g-bg-secondary g-pa-30">
                    <div className="g-mb-15">
                        <h5 className="h5 g-color-gray-dark-v1 mb-0">
                            {comment.owner.name}
                        </h5>
                        <span className="g-color-gray-dark-v4 g-font-size-12">
                            {this.displayTime(comment.createdAt)}
                        </span>
                    </div>

                    <p>{comment.content}</p>
                </div>
            </div>
        </div>;
    }
}
