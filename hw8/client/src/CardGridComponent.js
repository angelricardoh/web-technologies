import React from "react";
import CardComponent from "./CardComponent";
import CompactCardComponent from "./CompactCardComponent";

function CardGridComponent(props) {
    let title = null
    let noresults = null
    let titleStyle = { marginLeft: '30px'}

    if (props.data.page === 'search'){
        if (props.data.articles.length === 0) {
            noresults = <h5 style={{textAlign:'center'}}>No Results</h5>
        } else {
            title = <h3 style={titleStyle}>Results</h3>
        }
    } else if (props.data.page === 'favorites') {
        if (props.data.articles.length === 0) {
            noresults = <h5 style={{textAlign:'center'}}>You have no saved articles</h5>
        } else {
            title = <h3 style={titleStyle}>Favorites</h3>
        }
    }

    const cards = props.data.articles.map((article) => {
        let card = null
        let articleData = article
        articleData.page = props.data.page
        // articleData.source = props.data.source
        console.log("CardGridComponent + props.data.page")
        console.log(props.data.page)
        if (props.data.page === 'search' || props.data.page === 'favorites') {
            card = <CompactCardComponent
                key={article.id}
                data={articleData}
                handleClickShare={props.handleClickShare}
                handleRemoveBookmark={props.handleRemoveBookmark}
            />
        } else {
            card = <CardComponent
                key={article.id}
                data={articleData}
                handleClickShare={props.handleClickShare}
            />
        }
            return card
        }
    )

    return <div key="card-grid-component">
        {title}
        {noresults}
        {cards}
    </div>;
}

export default CardGridComponent;
