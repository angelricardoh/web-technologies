import React from "react";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import { Text } from "react-native";
import { sections } from "./Constants";
import { Link} from "react-router-dom";

function CardComponent(props) {
  const page = props.page;
  let sectionBadge = null;
  let sourceBadge = null;
  if (!sections.includes(page)) {
    sectionBadge = (
      <Badge
        style={{ float: "right" }}
        variant={props.section}>
        {props.section.toUpperCase()}
      </Badge>
    );
  }
  if (page === "search" || page === "favorites") {
    sourceBadge = (
      <Badge
        style={{ float: "right" }}
        variant={props.source}>
        {props.source.toUpperCase()}
      </Badge>
    );
  }

  return (
      // <Link to={'/article?articleId=' + props.id}>
        <Card style={{display: "inline-block"}}>
          <Card.Img variant="primary" src={props.image}/>
          <Card.Body variant="primary">
            <Card.Title>
              {props.title}
              <span
                  articleindex={props.articleIndex}
                  className="material-icons"
                  onClick={props.handleClickShare}>
            share
          </span>
            </Card.Title>
            <Text numberOfLines={3}>{props.description}</Text>
            <br></br>
            <Card.Text style={{float: "left"}}>{props.date}</Card.Text>
            {sourceBadge}
            {sectionBadge}
          </Card.Body>
        </Card>
      // </Link>
  );
}

export default CardComponent;
