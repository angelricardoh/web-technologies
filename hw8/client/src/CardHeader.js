import Card from "react-bootstrap/Card";
import React from "react";
import {MdShare} from 'react-icons/md'
import {FaTrash} from 'react-icons/fa'

export default function CardHeader(props) {
    let removeBookmarkButton = null
    if (props.data.page === 'favorites') {
        removeBookmarkButton = <FaTrash
                onClick={props.handleRemoveBookmark}
                size='16px'/>
    }

    return (
        <div className='card-row-title-container'>
            <Card.Title className='card-row-title share-button-div'>
                {props.data.title}
                <span className="article-actions-div">
                    <MdShare
                        articleid={props.data.id}
                        onClick={props.handleClickShare}
                        size='20px'/>
                    {removeBookmarkButton}
                </span>
            </Card.Title>
        </div>
    )
}