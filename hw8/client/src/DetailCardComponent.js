import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import ReadMore from "./ReadMore";
import "./DetailCardComponent.css";
import {
  EmailShareButton,
  FacebookShareButton,
  TwitterShareButton,
  FacebookIcon,
  TwitterIcon,
  EmailIcon
} from "react-share";
import { FaRegBookmark } from "react-icons/fa";
import { sharePhrase } from "./Constants";
import ReactTooltip from "react-tooltip";

let socialNetworksButtonSize = "2.5rem";

export default class DetailCardComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bookmarked: false
    };
  }

  render() {
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

            <FaRegBookmark
              size={socialNetworksButtonSize}
              style={{ marginLeft: "5rem" }}
              data-tip="Bookmark"
            />
            <ReactTooltip />
          </div>
          <img className="detail-card-image" src={this.props.detail.image} />
          <br />
          <br />
          <ReadMore description={this.props.detail.description} />
        </Card.Body>
      </Card>
    );
  }
}
