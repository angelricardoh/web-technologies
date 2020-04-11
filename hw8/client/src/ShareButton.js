import React, {Component} from "react";
// import Button from 'react'

export default class ShareButton extends Component {
    render() {
        return (
            <span
                articleid={this.props.articleId}
                className="material-icons"
                onClick={this.props.onClick}>
                  share
            </span>
        )
    }
}