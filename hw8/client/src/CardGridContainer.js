import React, { Component } from "react";
import CardGridComponent from "./CardGridComponent";
import { sections } from "./Constants";
// TODO: Remove in production
import guardian_news from './guardian_news.json'
import nytimes_news from './nytimes_news.json'

export default class CardGridContainer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      articles: [],
      source: null,
      page: props.page
    };
  }

  // Mock data
  componentDidMount() {
    let source = this.props.source;
    let page = this.props.page;
    let response = null
    if (source === "nytimes") {
      response = guardian_news
    } else {
      response = nytimes_news
    }

    const { articles } = response.data
    this.setState({ articles: articles })
  }

  // componentDidMount() {
  //   let source = this.props.source;
  //   let page = this.props.page;
  //   let url = "";
  //   if (source === "nytimes") {
  //     url = "http://localhost:8080/nytimes_news"
  //   } else {
  //     url = "http://localhost:8080/guardian_news"
  //   }
  //
  //   if (page in sections) {
  //     url += "?sectionName=" + page
  //   }
  //
  //   fetch(url)
  //     .then(response => response.json())
  //     .then(response => {
  //       const { articles } = response.data
  //       this.setState({ articles: articles })
  //     });
  // }

  render() {
    return (
      <div>
        {this.state.articles.length > 0 ? (
          <CardGridComponent key={this.state.page} data={this.state} />
        ) : (
          <h2>Loading...</h2>
        )}
      </div>
    );
  }
}