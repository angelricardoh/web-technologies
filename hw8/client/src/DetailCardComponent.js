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

let bookmarkButtonSize = "2.0rem";
let socialNetworksButtonSize = "2.5rem";

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
          onClick={this.handleBookmarkClick}
          size={bookmarkButtonSize}
          style={{ marginLeft: "5rem",
            color:'#DB0030' }}
          data-tip="Bookmark"
      />
    } else {
      bookmarkButton = <FaRegBookmark
          onClick={this.handleBookmarkClick}
          size={bookmarkButtonSize}
          style={{ marginLeft: "5rem",
            color:'#DB0030' }}
          data-tip="Bookmark"
      />
    }

    return (
      <Card>
        <Card.Body variant="primary" style={{ textAlign: "left" }}>
          <h3 style={{ fontStyle:'italic' }}>{this.props.detail.title}</h3>
          <h5 style={{ display: 'inline', marginLeft: "2rem"}}>{this.props.detail.date}</h5>
          <div style={{
            float: "right",
            paddingBottom:'1rem',
            display: 'inline'
          }}>
            <FacebookShareButton
              url={this.props.detail.shareUrl}
              quote={"#" + sharePhrase}
              data-tip="Facebook"
            >
              <FacebookIcon size={socialNetworksButtonSize} round={true} />
            </FacebookShareButton>
            <ReactTooltip />

            <TwitterShareButton
              url={this.props.detail.shareUrl}
              hashtags={[sharePhrase]}
              data-tip="Twitter"
            >
              <TwitterIcon size={socialNetworksButtonSize} round={true} />
            </TwitterShareButton>
            <ReactTooltip />

            <EmailShareButton
              url={this.props.detail.shareUrl}
              subject={"#" + sharePhrase}
              data-tip="Email"
            >
              <EmailIcon size={socialNetworksButtonSize} round={true} />
            </EmailShareButton>
            <ReactTooltip />
              {bookmarkButton}
            <ReactTooltip />
          </div>
          <img className="detail-card-image"
               alt="detail"
               src={this.props.detail.image} />
          <br />
          <br />
          <ReadMore description={this.props.detail.description} />
        </Card.Body>
        <ToastContainer autoClose={3000}
                        transition={Zoom}
                        position={toast.POSITION.TOP_CENTER}
                        hideProgressBar={true}
                        bodyClassName='light-toast'/>
      </Card>
    );
  }
}
