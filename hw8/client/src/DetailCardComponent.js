import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import ReadMore from "./ReadMore";
import "./DetailCardComponent.css";
import {EmailShareButton, FacebookShareButton, TwitterShareButton, FacebookIcon, TwitterIcon, EmailIcon} from "react-share";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { sharePhrase } from "./Constants";
import ReactTooltip from "react-tooltip";
import {addBookmark, isBookmarked, removeBookmark} from "./BookmarkManager";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Zoom } from 'react-toastify';

let bookmarkButtonSize = "28px";
let socialNetworksButtonSize = "28px";

export default class DetailCardComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bookmarked: isBookmarked(this.props.detail)
    };
    this.handleBookmarkClick = this.handleBookmarkClick.bind(this)
  }

  handleBookmarkClick() {
    if (this.state.bookmarked) {
      removeBookmark(this.props.detail)
      toast('Removing - ' + this.props.detail.title)
    } else {
      addBookmark(this.props.detail)
      toast('Saving ' + this.props.detail.title)
    }
    this.setState({ bookmarked: !this.state.bookmarked })
  }

  render() {
    let bookmarkButton = null
    if (this.state.bookmarked) {
      bookmarkButton = <FaBookmark
          className="detail-bookmark-button"
          onClick={this.handleBookmarkClick}
          size={bookmarkButtonSize}
          data-tip="Bookmark"
      />
    } else {
      bookmarkButton = <FaRegBookmark
          className="detail-bookmark-button"
          onClick={this.handleBookmarkClick}
          size={bookmarkButtonSize}
          data-tip="Bookmark"
      />
    }

    return (
        <div className='card-detail-container'>
          <Card className='card-detail'>
            <Card.Body className="card-body" variant="primary" style={{textAlign: "left"}}>
              <h3 style={{fontStyle: 'italic'}}>{this.props.detail.title}</h3>
                <p className="card-detail-date">{this.props.detail.date}</p>
                <div className="detail-action-space">
                  <FacebookShareButton
                      url={this.props.detail.shareUrl}
                      hashtag={"#" + sharePhrase}
                      data-tip="Facebook">
                    <FacebookIcon size={socialNetworksButtonSize} round={true}/>
                  </FacebookShareButton>

                  <TwitterShareButton
                      url={this.props.detail.shareUrl}
                      hashtags={[sharePhrase]}
                      data-tip="Twitter">
                    <TwitterIcon size={socialNetworksButtonSize} round={true}/>
                  </TwitterShareButton>

                  <EmailShareButton
                      url={this.props.detail.shareUrl}
                      subject={"#" + sharePhrase}
                      data-tip="Email">
                    <EmailIcon size={socialNetworksButtonSize} round={true}/>
                  </EmailShareButton>

                  {bookmarkButton}
                  <ReactTooltip className='tool-tip' effect='solid'/>

                </div>

              <img className="detail-card-image"
                   alt="detail"
                   src={this.props.detail.image}/>
              <br/>
              <br/>
              <ReadMore description={this.props.detail.description}/>
            </Card.Body>
            <ToastContainer autoClose={3000}
                            transition={Zoom}
                            position={toast.POSITION.TOP_CENTER}
                            hideProgressBar={true}
                            bodyClassName='light-toast'/>
          </Card>
        </div>
    );
  }
}
