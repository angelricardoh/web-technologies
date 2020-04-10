import {Component} from "react";

export default class NewsCard extends Component {
    constructor(props) {
        super(props);

        this.handleClickDetail = this.handleClickDetail.bind(this)
    }

    handleClickDetail(event) {
        window.location = "/article?articleId=" + this.props.data.id;
    }
}