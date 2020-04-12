import React from "react";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import { Text } from "react-native";
import NewsCard from './NewsCard'
import {Redirect} from "react-router-dom";
import ShareButton from './ShareButton'

export default class CardComponent extends NewsCard {
  render() {
    if (this.state.redirect !== null) {
      return <Redirect push to={this.state.redirect}/>
    }

    return (
      <Card
          className='card'
          onClick={this.handleClickDetail}
          style={{ display: "inline-block" }}>
        <Card.Img
            variant="primary"
            src={this.props.data.image} />
        <Card.Body
            variant="primary">
          <Card.Title>
            {this.props.data.title}
            <ShareButton articleId={this.props.data.id}
                         onClick={this.handleClickShare}/>
          </Card.Title>
          <Text
              numberOfLines={3}>{this.props.data.description}</Text>
          <br></br>
          <Card.Text
              style={{ float: "left" }}>{this.props.data.date}</Card.Text>
          <Badge
              style={{float: "right"}}
              variant={this.props.data.section}>
            {this.props.data.section.toUpperCase()}
          </Badge>
        </Card.Body>
      </Card>
    );
  }
}
