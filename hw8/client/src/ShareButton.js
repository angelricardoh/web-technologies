import React, {Component} from "react";

export default class ShareButton extends Component {
    render() {
        return (
            <button
                articleid={this.props.articleId}
                className="material-icons"
                onClick={this.props.onClick}>
                  share
            </button>
        )
    }
}