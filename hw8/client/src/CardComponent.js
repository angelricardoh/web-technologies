import React from "react"
import Card from "react-bootstrap/Card"
import Badge from "react-bootstrap/Badge"
import { Text } from "react-native"
import NewsCard from './NewsCard'
import {Redirect} from "react-router-dom"
import CardHeader from './CardHeader'

export default class CardComponent extends NewsCard {
  render() {
    if (this.state.redirect !== null) {
      return <Redirect push to={this.state.redirect}/>
    }

    return (
      <Card
          className='card-row'
          onClick={this.handleClickDetail}>
        <div className='image-container'>
          <Card.Img
              variant="primary"
              src={this.props.data.image}/>
        </div>
        <Card.Body
            variant="primary">
          <CardHeader
              data={this.props.data}
              handleClickShare={this.handleClickShare}
          />
          <Text
              style={{textAlign: 'justify',
                textJustify: 'inter-word',
                lineHeight:'24px',
                textDecoration:'none',
                fontSize:'16px',
                textOverflow: 'ellipsis'}}
              numberOfLines={3}>{this.props.data.description}</Text>
          <br></br>
          <Card.Text className="card-date" style={{float: "left"}}>{this.props.data.date}</Card.Text>
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
