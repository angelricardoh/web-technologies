import React from 'react'

function CardComponent(props){

    return (
        <div className='cardComponent'>
            <h2>Card Component</h2>
            <h2>{props.source}</h2>
            <h2>{props.articles}</h2>
            {/*<img src={props.data.randomImage} alt='' />*/}
            {/*<h2 className='top'>{props.data.topText}</h2>*/}
            {/*<h2 className='bottom'>{props.data.bottomText}</h2>*/}
        </div>
    )
}

export default CardComponent