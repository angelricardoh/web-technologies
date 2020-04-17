import React from "react"
import Card from "react-bootstrap/Card"
import Badge from "react-bootstrap/Badge"
import { Text } from "react-native"
import NewsCard from './NewsCard'
import {Redirect} from "react-router-dom"
import CardHeader from './CardHeader'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'


export default class CardComponent extends NewsCard {
  render() {
    if (this.state.redirect !== null) {
      return <Redirect push to={this.state.redirect}/>
    }

    return (
        <Col md="auto" className="my-3">
          <Row
              className="mx-auto card-row"
              onClick={this.handleClickDetail}>
              <Col className="my-auto align-items-center" md={3} sm={12}>
                  <img
                      className='image-border'
                      alt='news'
                      src={this.props.data.image}/>
              </Col>
              <Col className='card-row-body px-0' md={9} sm={12}>
                <Card.Body >
                    <CardHeader
                        data={this.props.data}
                        handleClickShare={this.handleClickShare}
                    />
                    <Text
                        style={{
                          textAlign: 'justify',
                          textJustify: 'inter-word',
                          lineHeight: '24px',
                          textDecoration: 'none',
                          fontSize: '16px',
                          textOverflow: 'ellipsis'
                        }}
                        numberOfLines={3}>
                        {this.props.data.description}
                    </Text>
                    <br></br>
                    <Card.Text
                        className="card-date"
                        style={{float: "left"}}>
                        {this.props.data.date}
                    </Card.Text>
                    <Badge
                        style={{float: "right"}}
                        variant={this.props.data.section}>
                      {this.props.data.section.toUpperCase()}
                    </Badge>
                </Card.Body>
              </Col>
          </Row>
        </Col>
    );
  }
}
