import React, { Component } from "react";
import { host } from "./Constants";
import axios from "axios";
import DetailCardComponent from "./DetailCardComponent";
import PageWithComments from "./PageWithComments";
import Loader from './Loader'

export default class DetailCardContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      detail: null
    };
  }

  componentDidMount() {
    let source = this.props.source;
    let articleId = this.props.articleId;
    let url = host + "article_detail?source=" + source + "&articleId=" + articleId;

    console.log("fetch url " + url);

    axios.get(url).then(response => {
      const { detail } = response.data;
      detail.id = articleId
      console.log(detail);
      this.setState({ detail: detail });
    });
  }

  render() {
    let content = null
    let commentBox = null
    let modal = null;
    if (this.state.detail != null) {
      content = <DetailCardComponent detail={this.state.detail} />
      commentBox = <PageWithComments articleId={this.state.detail.id}/>
    } else {
      content = <Loader />
    }

    return (
      <div>
        {content}
        {commentBox}
        {modal}
      </div>
    );
  }
}
