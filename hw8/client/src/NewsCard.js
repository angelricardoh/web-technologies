import {Component} from "react";

export default class NewsCard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            redirect: null
        }
        this.handleClickDetail = this.handleClickDetail.bind(this)
        this.handleClickShare = this.handleClickShare.bind(this)
    }

    handleClickDetail() {
        this.setState({redirect: "/detail?articleId=" + this.props.data.id})
    }

    handleClickShare(event) {
        event.preventDefault();
        event.stopPropagation();
        let articleId = event.target.getAttribute("articleid");
        console.log('articleId')
        console.log(articleId)
        this.props.handleClickShare(articleId)
    }
}
