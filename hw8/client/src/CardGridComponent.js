import React from "react";
import CardComponent from "./CardComponent";

function CardGridComponent(props) {
    const cards = props.data.articles.map((article) => {
            return (
                <CardComponent
                    key={article.id}
                    id={article.id}
                    articleIndex={article.index}
                    title={article.title}
                    image={article.image}
                    section={article.section}
                    date={article.date}
                    description={article.description}
                    page={props.data.page}
                    source={props.data.source}
                    handleClickShare={props.handleClickShare}
                />
            )
        }
    )

    return <div key="card-grid-component">{cards}</div>;
}

export default CardGridComponent;
