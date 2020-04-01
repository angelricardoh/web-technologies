import React, { Component } from "react";
import CardGridComponent from "./CardGridComponent";

class CardGridContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      articles: []
    };
  }

  componentDidMount() {
      let sectionName = this.props.sectionName
      let url = ''
      if (sectionName) {
          url = 'http://localhost:8080/guardian_news?sectionName=' + sectionName
      } else {
          url = 'http://localhost:8080/guardian_news'
      }
      // let url = ''
      // if (sectionName) {
      //     url = new URL("http://localhost:8080/guardian_news"),
      //         params = {sectionName: sectionName}
      //     Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
      // } else {
      //     url = new URL("http://localhost:8080/guardian_news")
      // }

      fetch(url)
      .then(response => response.json())
      .then(response => {
        console.log(response.data);
        const { articles } = response.data;
        this.setState({ articles: articles });
        console.log(this.state.articles);
      });
    // TODO: When source is added to be read locally then replace this code with the one above
    // if (this.props.source === 'guardian')  {
    //     fetch('http://localhost:8080/guardian_news')
    //         .then(response => response.json())
    //         .then(response => {
    //             console.log(response)
    //             const articles = response.data
    //             this.setState({ articles: articles })
    //         })
    // } else {
    //     fetch('http://localhost:8080/guardian_news')
    //         .then(response => response.json())
    //         .then(response => {
    //             console.log(response)
    //             const articles = response.data
    //             this.setState({ articles: articles })
    //         })
    // }
  }

  render() {
    console.log(this.state.articles);
    return (
      <div>
        {this.state.articles.length > 0 ? (
          <CardGridComponent articles={this.state.articles} />
        ) : (
          <h2>Loading...</h2>
        )}
      </div>
    );
  }
}

export default CardGridContainer;
