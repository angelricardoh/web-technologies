import {Component} from "react";
import './NewsCard.css'

export default class NewsCard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            redirect: null
        }
        this.handleClickDetail = this.handleClickDetail.bind(this)
        this.handleClickShare = this.handleClickShare.bind(this)
        this.handleRemoveBookmark = this.handleRemoveBookmark.bind(this)
    }

    handleClickDetail() {
        this.setState({redirect: "/detail?articleId=" + this.props.data.id})
    }

    handleClickShare(event) {
        event.preventDefault();
        event.stopPropagation();
        let articleId = event.target.getAttribute("articleid");
        this.props.handleClickShare(articleId)
    }

    handleRemoveBookmark(event) {
        event.preventDefault();
        event.stopPropagation();
        this.props.handleRemoveBookmark(this.props.data.id)
    }
}
