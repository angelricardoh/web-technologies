import React from "react";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import "./CardComponent.css";
import NewsCard from './NewsCard'
import {Redirect} from "react-router-dom";

export default class CompactCardComponent extends NewsCard {
    render() {
        if (this.state.redirect !== null) {
            return <Redirect push to={this.state.redirect}/>
        }

        let sourceBadge = null
        if (this.props.data.page === 'favorites'){
            sourceBadge = (
                <Badge style={{ float: "right" }}
                       variant={this.props.data.source}>
                    {this.props.data.source.toUpperCase()}
                </Badge>
            );
        }
        return(
            <Card onClick={this.handleClickDetail}
                  style={{ width: '18rem',
                      display: "inline-block" }}
                  className='card-compact'
                  variant='compact'>
                    <Card.Text>{this.props.data.title}</Card.Text>
                    <span articleindex={this.props.data.index}
                          className="material-icons"
                          onClick={this.props.handleClickShare}>
                        share
                    </span>
                <Card.Img variant="primary"
                          src={this.props.data.image} />
                <Card.Text style={{ float: "left" }}>{this.props.data.date}</Card.Text>
                <Badge style={{float: "right"}}
                       variant={this.props.data.section}>
                    {this.props.data.section.toUpperCase()}
                </Badge>
                {sourceBadge}
            </Card>
        );
    }
}
