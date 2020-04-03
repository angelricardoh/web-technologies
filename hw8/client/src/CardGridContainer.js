import React, { Component } from "react";
import CardGridComponent from "./CardGridComponent";
import { sections } from "./Constants";

class CardGridContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      articles: [],
      source: null,
      page: props.page
    };
  }

  componentDidMount() {
    let source = this.props.source;
    let page = this.props.page;
    let url = "";
    if (source === "nytimes") {
      url = "http://localhost:8080/nytimes_news";
    } else {
      // default
      url = "http://localhost:8080/guardian_news";
    }

    if (page in sections) {
      url += "?sectionName=" + page;
    }

    fetch(url)
      .then(response => response.json())
      .then(response => {
        const { articles } = response.data;
        this.setState({ articles: articles });
      });
  }

  render() {
    return (
      <div>
        {this.state.articles.length > 0 ? (
          <CardGridComponent data={this.state} />
        ) : (
          <h2>Loading...</h2>
        )}
      </div>
    );
  }
}

export default CardGridContainer;
