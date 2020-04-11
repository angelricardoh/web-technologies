import React from 'react';
import commentBox from 'commentbox.io';
import { commentsboxioProjectID } from "./Constants";

export default class PageWithComments extends React.Component {
    componentDidMount() {
        this.removeCommentBox = commentBox(commentsboxioProjectID, { defaultBoxId: this.props.articleId });
    }

    componentWillUnmount() {

        this.removeCommentBox()
    }

    render() {

        return (
            <div className="commentbox" />
        )
    }
}