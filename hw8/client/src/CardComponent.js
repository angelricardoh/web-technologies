import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { css } from "./CardComponent";

function CardComponent(props) {
  return (
    <Card style={{ display: "inline-block" }}>
      <Card.Img variant="primary" src={props.image} />
      <Card.Body variant="primary">
        <Card.Title>{props.title}</Card.Title>
        <Card.Text>{props.description}</Card.Text>
      </Card.Body>
    </Card>
  );
}

export default CardComponent;
