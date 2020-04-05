import React from "react";
import ReadMore from "./ReadMore";
import "./DetailCardComponent.css";

export default function DetailCardComponent(props) {
  // TODO: function to check if current article is in favorites
  return (
    <div className="card promoting-card">
      {/*Card content*/}
      <div className="card-body">
        <p>{props.title}</p>
        <p>{props.date}</p>
        <img className="detail-card-image" src={props.image} />
        <br />
        <br />
        <ReadMore description={props.description} />
      </div>
    </div>
  );
}
