import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { css } from "./CardComponent";
import Badge from "react-bootstrap/Badge";
import { Text } from "react-native";

function CardComponent(props) {
  return (
    <Card style={{ display: "inline-block" }}>
      <Card.Img variant="primary" src={props.image} />
      <Card.Body variant="primary">
        <Card.Title>{props.title}</Card.Title>
        <Text numberOfLines={3}>{props.description}</Text>
          <br></br>
        <Card.Text style={{float: "left"}}>{props.date}</Card.Text>
        <Badge variant="light" style={{float: "right"}}>Light</Badge>
      </Card.Body>
    </Card>
  );
}

export default CardComponent;
