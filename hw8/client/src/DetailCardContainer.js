import React, { Component } from "react";
import { host } from "./Constants";
import axios from "axios";
import DetailCardComponent from "./DetailCardComponent";

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
    let url =
      host + "article_detail?source=" + source + "&articleId=" + articleId;

    console.log("fetch url " + url);

    axios.get(url).then(response => {
      const { detail } = response.data;
      console.log(detail);
      this.setState({ detail: detail });
    });
  }

  render() {
    let cardGridComponent = null;
    let modal = null;
    if (this.state.detail != null) {
      cardGridComponent = <DetailCardComponent detail={this.state.detail} />;
    } else {
      cardGridComponent = <h2>Loading...</h2>;
    }

    return (
      <div>
        {cardGridComponent}
        {modal}
      </div>
    );
  }
}
