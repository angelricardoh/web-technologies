import React from "react";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import "./CardComponent.css";
import NewsCard from './NewsCard'
import {Redirect} from "react-router-dom";
import ShareButton from "./ShareButton";
import RemoveBookmarkButton from "./RemoveBookmarkButton";
import './CompactCardComponents.css'

export default class CompactCardComponent extends NewsCard {
    render() {
        if (this.state.redirect !== null) {
            return <Redirect push to={this.state.redirect}/>
        }

        let sourceBadge, removeFavoritesCan = null
        if (this.props.data.page === 'favorites') {
            sourceBadge =
                <Badge style={{float: "right"}}
                       variant={this.props.data.source}>
                    {this.props.data.source.toUpperCase()}
                </Badge>

            removeFavoritesCan = <RemoveBookmarkButton handleRemoveBookmark={this.handleRemoveBookmark}/>
        }

        return (
            <Card onClick={this.handleClickDetail}
                  className='card-compact'
                  variant='compact'>
                <Card.Text style={{fontWeight:'bold'}}>{this.props.data.title}
                    <span>
                            <ShareButton articleId={this.props.data.id}
                                         onClick={this.handleClickShare}/>
                        {removeFavoritesCan}
                    </span>
                </Card.Text>
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
