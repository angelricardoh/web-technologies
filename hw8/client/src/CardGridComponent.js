import React from "react";
import CardComponent from "./CardComponent";
import CompactCardComponent from "./CompactCardComponent";

function CardGridComponent(props) {
    const cards = props.data.articles.map((article) => {
        let card = null
        let articleData = article
        articleData.page = props.data.page
        // articleData.source = props.data.source
        if (props.data.page === 'search' || props.data.page === 'favorites') {
            card = <CompactCardComponent
                key={article.id}
                data={articleData}
                handleClickShare={props.handleClickShare}
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

    return <div key="card-grid-component">{cards}</div>;
}

export default CardGridComponent;
