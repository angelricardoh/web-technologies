import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import { Text } from "react-native";
import { sections } from "./Constants";
import "./CardComponent.css";

export default class CardComponent extends Component {
  constructor(props) {
    super(props);

    this.handleClickDetail = this.handleClickDetail.bind(this);
  }

  handleClickDetail(event) {
    window.location = "/article?articleId=" + this.props.id;
  }

  render() {
    const page = this.props.page;
    let sectionBadge = null;
    let sourceBadge = null;
    if (!sections.includes(page)) {
      sectionBadge = (
        <Badge style={{ float: "right" }} variant={this.props.section}>
          {this.props.section.toUpperCase()}
        </Badge>
      );
    }
    if (page === "search" || page === "favorites") {
      sourceBadge = (
        <Badge style={{ float: "right" }} variant={this.props.source}>
          {this.props.source.toUpperCase()}
        </Badge>
      );
    }

    return (
      <Card
        onClick={this.handleClickDetail}
        style={{ display: "inline-block" }}
      >
        <Card.Img variant="primary" src={this.props.image} />
        <Card.Body variant="primary">
          <Card.Title>
            {this.props.title}
            <span
              articleindex={this.props.articleIndex}
              className="material-icons"
              onClick={this.props.handleClickShare}
            >
              share
            </span>
          </Card.Title>
          <Text numberOfLines={3}>{this.props.description}</Text>
          <br></br>
          <Card.Text style={{ float: "left" }}>{this.props.date}</Card.Text>
          {sourceBadge}
          {sectionBadge}
        </Card.Body>
      </Card>
    );
  }
}
