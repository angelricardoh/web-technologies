import React from "react";
import CardComponent from "./CardComponent";

function CardGridComponent(props) {
  const cards = [];

  for (const index in props.articles) {
    let currentArticle = props.articles[index];
    cards.push(
      <CardComponent
        title={currentArticle.title}
        image={currentArticle.image}
        section={currentArticle.section}
        date={currentArticle.date}
        description={currentArticle.description}
      />
    );
    cards.push(<br></br>);
  }

  return <div>{cards}</div>;
}

export default CardGridComponent;
