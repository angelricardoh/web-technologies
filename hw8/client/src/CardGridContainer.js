import React, { Component } from "react"
import CardGridComponent from "./CardGridComponent"
import axios from 'axios'
import {host} from './Constants'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
// TODO: Remove in production
// import guardian_news from './guardian_news.json'
// import nytimes_news from './nytimes_news.json'


export default class CardGridContainer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      articles: [],
      source: null,
      page: props.page,
      showShareModal: false
    }
    this.handleClickShare = this.handleClickShare.bind(this)
    this.handleCloseModalShare = this.handleCloseModalShare.bind(this)
  }

  // Mock data
  // componentDidMount() {
  //   let source = this.props.source;
  //   let page = this.props.page;
  //   let response = null
  //   if (source === "nytimes") {
  //     response = nytimes_news
  //   } else {
  //     response = guardian_news
  //   }
  //
  //   const { articles } = response.data
  //   this.setState({ articles: articles })
  // }

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

  handleClickShare() {
    this.setState({showShareModal: true})
  }

  handleCloseModalShare() {
    this.setState({showShareModal: false})
  }

  render() {
    return (
      <div>
        {this.state.articles.length > 0 ? (
          <CardGridComponent
              key={this.state.page}
              data={this.state}
              handleClickShare={this.handleClickShare}
          />
        ) : (
          <h2>Loading...</h2>
        )}
        <Modal show={this.state.showShareModal} onHide={this.handleCloseModalShare} animation={false}>
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleCloseModalShare}>
              Close
            </Button>
            <Button variant="primary" onClick={this.handleCloseModalShare}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}