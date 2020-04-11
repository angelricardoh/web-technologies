import React, { Component } from "react";
import CardGridComponent from "./CardGridComponent";
import ShareModal from "./ShareModal";
import axios from "axios";
import { host } from "./Constants";
import { listBookmarks } from "./BookmarkManager";
import { css } from '@emotion/core'
import BounceLoader from 'react-spinners/BounceLoader'

export default class CardGridContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      articles: null,
      source: null,
      page: props.page,
      share: {
        show: false,
        articleIndex: null
      },
      loading: true
    };
    this.handleClickShare = this.handleClickShare.bind(this);
    this.handleCloseModalShare = this.handleCloseModalShare.bind(this);
  }

  componentDidMount() {
    let source = this.props.source;
    let page = this.props.page;
    let url = "";
    switch (page) {
      case 'search':
        let search = this.props.search;
        url = host + 'search?source=' + source + "&search" + search;
        break

      case 'favorites':
          let bookmarks = listBookmarks()
          this.setState({articles: bookmarks})
        return

      default:
        if (source === "nytimes") {
          url = host + "nytimes_news?section=" + page;
        } else {
          url = host + "guardian_news?section=" + page;
        }
        break
    }

    axios.get(url).then(response => {
      const { articles } = response.data;
      this.setState({ articles: articles, loading: false });
    });
  }

  handleClickShare(event) {
    event.preventDefault();
    event.stopPropagation();
    let articleIndex = event.target.getAttribute("articleindex");
    let shareStatus = { show: true, articleIndex: articleIndex };
    this.setState({ share: shareStatus });
  }

  handleCloseModalShare() {
    let shareStatus = { show: false, articleIndex: null };
    this.setState({ share: shareStatus });
  }

  render() {
    let content = null;
    let modal = null
    if (this.state.articles == null) {
      content = <h2>Loading ...</h2>
      // content = <BounceLoader
      //     // css={override}
      //     size={150}
      //     color={'#123abc'}
      //     loading={this.state.loading}/>
    } else if (this.state.articles.length === 0) {
      content = <h2>No results or bookmarks</h2>
    } else {
      content = (
        <CardGridComponent
          key={this.state.page}
          data={this.state}
          handleClickShare={this.handleClickShare}
        />
      );

      let articleIndex = this.state.share.articleIndex;
      if (
        articleIndex != null &&
        typeof this.state.articles[articleIndex] !== "undefined"
      ) {
        let title = this.state.articles[articleIndex].title;
        let shareUrl = this.state.articles[articleIndex].shareUrl;
        if (typeof title !== "undefined" && typeof shareUrl !== "undefined") {
          modal = (
            <ShareModal
              show={this.state.share.show}
              title={title}
              shareUrl={shareUrl}
              source={this.props.source}
              handleCloseModalShare={this.handleCloseModalShare}
            />
          );
        }
      }
    }

    return (
      <div>
        {content}
        {modal}
      </div>
    );
  }
}
