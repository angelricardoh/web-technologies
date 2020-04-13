import React from "react"
import Card from "react-bootstrap/Card"
import Badge from "react-bootstrap/Badge"
import { Text } from "react-native"
import NewsCard from './NewsCard'
import {Redirect} from "react-router-dom"
import ShareButton from './ShareButton'
import Truncate from 'react-truncate'

export default class CardComponent extends NewsCard {
  render() {
    if (this.state.redirect !== null) {
      return <Redirect push to={this.state.redirect}/>
    }

    return (
        <div className='card-container'>
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
              <div className='card-row-title-container'>
                <Card.Title className='card-row-title'>
                  {this.props.data.title}
                </Card.Title>
                <ShareButton
                    className='share-button'
                    articleId={this.props.data.id}
                    onClick={this.handleClickShare}/>
              </div>
              <Text
                  style={{textAlign: 'justify',
                    textJustify: 'inter-word',
                    lineHeight:'24px',
                    textDecoration:'none',
                    fontSize:'16px',
                    textOverflow: 'ellipsis'}}
                  numberOfLines={3}>{this.props.data.description}</Text>
              <br></br>
              <Card.Text style={{float: "left"}}>{this.props.data.date}</Card.Text>
              <Badge
                  style={{float: "right"}}
                  variant={this.props.data.section}>
                {this.props.data.section.toUpperCase()}
              </Badge>
            </Card.Body>
          </Card>
        </div>
    );
  }
}
