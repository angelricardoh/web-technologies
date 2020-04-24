import React from "react";
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
import ReactTooltip from "react-tooltip";
import { useMediaQuery } from 'react-responsive'

let socialNetworksButtonSize = "40px";

export default function ShareModal(props) {
  const isTabletOrMobile = useMediaQuery({ maxWidth: 1224 })

  let sourceHeader = null
  if (props.isFavorite) {
    sourceHeader = <h2>{props.source.toUpperCase()}</h2>
  }
  let title = null
  let shareLabel = null
  if (isTabletOrMobile) {
      title = <h5>{props.title}</h5>
      shareLabel = <h5 style={{textAlign: "center"}}>Share via</h5>
  } else {
      title = <h3>{props.title}</h3>
      shareLabel = <h4 style={{textAlign: "center"}}>Share via</h4>
  }

  return (
      <Modal
          show={props.show}
          onHide={props.handleCloseModalShare}
          animation={false}>
        <Modal.Header closeButton>
          <div style={{display: "inline-block"}}>
            {sourceHeader}
            {title}
          </div>
        </Modal.Header>
        <Modal.Body>
          {shareLabel}
          <br></br>
          <div
              style={{
                display: "flex",
                justifyContent: "space-around"
              }}
          >
            <FacebookShareButton
                url={props.shareUrl}
                hashtag={"#" + sharePhrase}
                data-tip="Facebook">
              <FacebookIcon
                  size={socialNetworksButtonSize}
                  round={true}/>
            </FacebookShareButton>
            <TwitterShareButton
                url={props.shareUrl}
                hashtags={[sharePhrase]}
                data-tip="Twitter">
              <TwitterIcon size={socialNetworksButtonSize}
                           round={true}/>
            </TwitterShareButton>
            <EmailShareButton
                url={props.shareUrl}
                subject={"#" + sharePhrase}
                data-tip="Email">
              <EmailIcon size={socialNetworksButtonSize} round={true}/>
            </EmailShareButton>
            <ReactTooltip className='tool-tip' effect='solid'/>
          </div>
        </Modal.Body>
      </Modal>
  );
}
