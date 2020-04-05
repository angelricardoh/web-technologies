import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import {
  EmailShareButton,
  FacebookShareButton,
  TwitterShareButton,
  FacebookIcon,
  TwitterIcon,
  EmailIcon
} from "react-share";
import { sharePhrase } from "./Constants";
let socialNetworksButtonSize = "2.5rem";

export default function ShareModal(props) {
  return (
    <Modal
      show={props.show}
      onHide={props.handleCloseModalShare}
      animation={false}
    >
      <Modal.Header closeButton>
        <div style={{ display: "inline-block" }}>
          <h2>{props.source.toUpperCase()}</h2>
          <h3>{props.title}</h3>
        </div>
      </Modal.Header>
      <Modal.Body>
        <h4 style={{ textAlign: "center" }}>Share via</h4>
        <br></br>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around"
          }}
        >
          <FacebookShareButton url={props.shareUrl} quote={"#" + sharePhrase}>
            <FacebookIcon size={socialNetworksButtonSize} round={true} />
          </FacebookShareButton>
          <TwitterShareButton url={props.shareUrl} hashtags={[sharePhrase]}>
            <TwitterIcon size={socialNetworksButtonSize} round={true} />
          </TwitterShareButton>
          <EmailShareButton url={props.shareUrl} subject={"#" + sharePhrase}>
            <EmailIcon size={socialNetworksButtonSize} round={true} />
          </EmailShareButton>
        </div>
      </Modal.Body>
    </Modal>
  );
}
