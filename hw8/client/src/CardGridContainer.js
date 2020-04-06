import React, { Component } from "react"
import CardGridComponent from "./CardGridComponent"
import axios from 'axios'
import {host} from './Constants'
import Modal from 'react-bootstrap/Modal'
import {
  EmailShareButton,
  FacebookShareButton,
  TwitterShareButton,

  FacebookIcon,
  TwitterIcon,
  EmailIcon
} from "react-share";

const shareQuote = 'CSCI_571_NewsApp'

export default class CardGridContainer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      articles: [],
      source: null,
      page: props.page,
      share: {
        showShareModal: false,
        articleIndex: null
      }
    }
    this.handleClickShare = this.handleClickShare.bind(this)
    this.handleCloseModalShare = this.handleCloseModalShare.bind(this)
  }

  componentDidMount() {
    let source = this.props.source
    let page = this.props.page
    let url = ''
    if (source === 'nytimes') {
      url = host + 'nytimes_news?section=' + page
    } else {
      url = host + 'guardian_news?section=' + page
    }

    console.log('fetch url ' + url)

    axios.get(url)
        .then(response => {
          const {articles} = response.data
          this.setState({articles: articles})
        })
  }

  handleClickShare(event) {
    let articleIndex = event.target.getAttribute('articleindex')
    let shareStatus = {showShareModal: true, articleIndex: articleIndex}
    this.setState({share: shareStatus})
  }

  handleClickDetail(event) {
    let articleIndex = event.target.getAttribute('articleindex')
    console.log(articleIndex)

  }

  handleCloseModalShare() {
    let shareStatus = {showShareModal: false, articleIndex: null}
    this.setState({share: shareStatus})
  }

  render() {
    let cardGridComponent = null
    let modal = null
    let size = '2.5rem'
    if (this.state.articles.length > 0) {
      cardGridComponent =
          <CardGridComponent
          key={this.state.page}
          data={this.state}
          handleClickShare={this.handleClickShare}
      />

      let articleIndex = this.state.share.articleIndex
      if (articleIndex != null && typeof this.state.articles[articleIndex] !== 'undefined'){
        let title = this.state.articles[articleIndex].title
        let shareUrl = this.state.articles[articleIndex].shareUrl
        if (typeof title !== 'undefined' && typeof shareUrl !== 'undefined') {
          modal =
          <Modal show={this.state.share.showShareModal} onHide={this.handleCloseModalShare} animation={false}>
            <Modal.Header closeButton>
              <div style={{display:'inline-block'}}>
                <h2>{this.props.source.toUpperCase()}</h2>
                <h3>{title}</h3>
              </div>
            </Modal.Header>
            <Modal.Body>
              <h4 style={{textAlign: 'center'}}>Share via</h4>
              <br></br>
              <div style={{
                display: 'flex',
                justifyContent: 'space-around',
              }}>
                <FacebookShareButton url={shareUrl} quote={'#' + shareQuote}>
                  <FacebookIcon
                      size={size}
                      round={true}
                  />
                </FacebookShareButton>
                <TwitterShareButton url={shareUrl} hashtags={[shareQuote]}>
                  <TwitterIcon
                      size={size}
                      round={true}
                  />
                </TwitterShareButton>
                <EmailShareButton url={shareUrl} subject={'#' + shareQuote}>
                  <EmailIcon
                      size={size}
                      round={true}
                  />
                </EmailShareButton>
              </div>
            </Modal.Body>
          </Modal>
        }
      }
    } else {
      cardGridComponent = <h2>Loading...</h2>
    }

    return (
      <div>
        {cardGridComponent}
        {modal}
      </div>
    )
  }
}