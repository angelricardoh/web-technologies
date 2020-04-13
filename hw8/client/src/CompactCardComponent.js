import React from "react";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import "./CardComponent.css";
import NewsCard from './NewsCard'
import {Redirect} from "react-router-dom";
import './CompactCardComponents.css'
import CardHeader from "./CardHeader";

export default class CompactCardComponent extends NewsCard {
    render() {
        if (this.state.redirect !== null) {
            return <Redirect push to={this.state.redirect}/>
        }

        let sourceBadge = null
        if (this.props.data.page === 'favorites') {
            sourceBadge =
                <Badge
                    style={{float: "right"}}
                    variant={this.props.data.source}>
                    {this.props.data.source.toUpperCase()}
                </Badge>
        }

        return (
            <Card onClick={this.handleClickDetail}
                  className='card-compact'
                  variant='compact'>
                <CardHeader
                    data={this.props.data}
                    handleClickShare={this.handleClickShare}
                    handleRemoveBookmark={this.handleRemoveBookmark}
                />
                <div className='image-container'>
                    <Card.Img variant="primary"
                              src={this.props.data.image}/>
                </div>
                <Card.Text style={{float: "left"}}>{this.props.data.date}</Card.Text>

                <Badge style={{float: "right"}}
                       variant={this.props.data.section}>
                    {this.props.data.section.toUpperCase()}
                </Badge>
                {sourceBadge}
            </Card>
        );
    }
}
