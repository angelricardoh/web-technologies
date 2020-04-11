import React, {Component} from "react";
import {Redirect} from 'react-router-dom'

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

    render() {
        if (this.state.redirect !== null) {
            return <Redirect push to={this.state.redirect}/>
        }
    }
}
