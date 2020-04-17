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
                    variant={this.props.data.source}>
                    {this.props.data.source.toUpperCase()}
                </Badge>
        }

        return (
            <Col className="mx-0 my-3">
                <Row
                    className="card card-compact m-auto p-3"
                    onClick={this.handleClickDetail}>
                    <CardHeader
                        // className="px-1"
                        data={this.props.data}
                        handleClickShare={this.handleClickShare}
                        handleRemoveBookmark={this.handleRemoveBookmark}
                    />
                    <Row
                        className="px-1">
                        <img
                            alt="news"
                            className='image-border card-compact-image-border mx-auto'
                            src={this.props.data.image}/>
                    </Row>
                    <Row className="footer-container mx-auto">
                        <Card.Text
                            className="mt-auto"
                            style={{float: "left"}}>
                            {this.props.data.date}
                        </Card.Text>
                        <div className="badgeCol mt-auto">
                            <Badge
                                className='mx-1'
                                variant={this.props.data.section}>
                                {this.props.data.section.toUpperCase()}
                            </Badge>
                            {sourceBadge}
                        </div>
                    </Row>
                </Row>
            </Col>
        );
    }
}
