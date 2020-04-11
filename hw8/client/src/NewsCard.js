import {Component} from "react";

export default class NewsCard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            redirect: null
        }
        this.handleClickDetail = this.handleClickDetail.bind(this)
    }

    handleClickDetail() {
        this.setState({redirect: "/detail?articleId=" + this.props.data.id})
    }


}
