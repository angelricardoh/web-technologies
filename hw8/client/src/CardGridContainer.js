import React, { Component } from "react";
import CardGridComponent from "./CardGridComponent";
import ShareModal from "./ShareModal";
import axios from "axios";
import { host } from "./Constants";
import { listBookmarks } from "./BookmarkManager";
import Loader from './Loader'
import {removeBookmark} from "./BookmarkManager";
import {toast, ToastContainer, Zoom} from "react-toastify";
import ReactTooltip from "react-tooltip";


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
    this.handleClickShare = this.handleClickShare.bind(this)
    this.handleCloseModalShare = this.handleCloseModalShare.bind(this)
    this.handleRemoveBookmark = this.handleRemoveBookmark.bind(this)
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

    console.log("fetch url " + url);

    axios.get(url).then(response => {
      const { articles } = response.data;
      this.setState({ articles: articles});
    });
  }

  handleClickShare(articleId) {
    let shareStatus = { show: true, articleId: articleId };
    this.setState({ share: shareStatus });
  }

  handleCloseModalShare() {
    let shareStatus = { show: false, articleId: null };
    this.setState({ share: shareStatus });
  }

  handleRemoveBookmark(articleId) {
    let removedArticle = removeBookmark(articleId)
    toast('Removing - ' + removedArticle.title)
    let bookmarks = listBookmarks()
    this.setState({articles: bookmarks})
  }

  render() {
    let isFavorite = this.state.page === 'favorites' ? true : false
    let content = null;
    let modal = null
    if (this.state.articles == null) {
      content = <Loader />
    } else {
      content = (
        <CardGridComponent
          key={this.state.page}
          data={this.state}
          handleClickShare={this.handleClickShare}
          handleRemoveBookmark={this.handleRemoveBookmark}
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
        <ToastContainer autoClose={3000}
                        transition={Zoom}
                        position={toast.POSITION.TOP_CENTER}
                        hideProgressBar={true}
                        bodyClassName='light-toast'/>
        <ReactTooltip className='tool-tip' effect='solid'/>
      </div>
    );
  }
}
