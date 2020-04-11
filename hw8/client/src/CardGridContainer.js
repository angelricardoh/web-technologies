import React, { Component } from "react";
import CardGridComponent from "./CardGridComponent";
import ShareModal from "./ShareModal";
import axios from "axios";
import { host } from "./Constants";
import { listBookmarks } from "./BookmarkManager";
import Loader from './Loader'

export default class CardGridContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      articles: null,
      source: null,
      page: props.page,
      share: {
        show: false,
        articleId: null
      },
    };
    this.handleClickShare = this.handleClickShare.bind(this);
    this.handleCloseModalShare = this.handleCloseModalShare.bind(this);
  }

  // shouldComponentUpdate(nextProps, nextState, nextContext) {
  //   if (this.props.source === nextProps.source) {
  //     return false
  //   }
  //   return true
  // }

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
      this.setState({ articles: articles});
    });
  }

  componentWillUnmount() {
    console.log('componentWillUnmount cardgridcontainer')
  }

  handleClickShare(articleId) {
    let shareStatus = { show: true, articleId: articleId };
    this.setState({ share: shareStatus });
  }

  handleCloseModalShare() {
    let shareStatus = { show: false, articleId: null };
    this.setState({ share: shareStatus });
  }

  render() {
    let isFavorite = this.state.page === 'favorites' ? true : false
    let content = null;
    let modal = null
    if (this.state.articles == null) {
      content = <Loader />
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

      let articleId = this.state.share.articleId;
      if (articleId !== null) {
        // eslint-disable-next-line no-unused-vars
        for (const index in this.state.articles) {
          let currentArticle = this.state.articles[index]
          if (currentArticle.id === articleId) {
            modal = (
                <ShareModal
                    isFavorite={isFavorite}
                    show={this.state.share.show}
                    title={currentArticle.title}
                    shareUrl={currentArticle.shareUrl}
                    source={this.props.source}
                    handleCloseModalShare={this.handleCloseModalShare}
                />
            );
            break
          }
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
