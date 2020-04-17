import React from "react";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import "./CardComponent.css";
import NewsCard from './NewsCard'
import {Redirect} from "react-router-dom";
import './CompactCardComponents.css'
import CardHeader from "./CardHeader";
import Col from 'react-bootstrap/Col'
import Row from "react-bootstrap/Row";

export default class CompactCardComponent extends NewsCard {
    render() {
        if (this.state.redirect !== null) {
            return <Redirect push to={this.state.redirect}/>
        }

        let sourceBadge = null
        if (this.props.data.page === 'favorites') {
            sourceBadge =
                <Badge
                    style={{float: "right", marginRight:'10px'}}
                    variant={this.props.data.source}>
                    {this.props.data.source.toUpperCase()}
                </Badge>
        }

        return (
            <Col className="mx-auto my-3">
                <Row
                    className="card card-compact"
                    onClick={this.handleClickDetail}>
                    <CardHeader
                        data={this.props.data}
                        handleClickShare={this.handleClickShare}
                        handleRemoveBookmark={this.handleRemoveBookmark}
                    />
                    <Row>
                        <img
                            className='image-border'
                            src={this.props.data.image}/>
                    </Row>
                    <Row>
                        <Col>
                            <Card.Text
                                style={{float: "left"}}>
                                {this.props.data.date}
                            </Card.Text>
                        </Col>
                        <Col>
                            <Badge
                                style={{float: "right"}}
                                variant={this.props.data.section}>
                                {this.props.data.section.toUpperCase()}
                            </Badge>
                        </Col>
                        <Col>
                            {sourceBadge}
                        </Col>
                    </Row>
                </Row>
            </Col>
        );
    }
}
