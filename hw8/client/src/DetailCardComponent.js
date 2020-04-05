import React from "react";
import ReadMore from './ReadMore'

export default function DetailCardComponent(props) {
    // TODO: function to check if current article is in favorites
    return (
        <div className="card promoting-card">
            {/*Card content*/}
            <div className="card-body">
                <p>{props.title}</p>
                <br></br>
                <p>{props.date}</p>
                <img className='detail-card-image' src={props.image}/>
                <div className="collapse-content">
                    <p className="card-text collapse" id="collapseContent">{props.description}</p>
                </div>
                <ReadMore/>
            </div>
        </div>
    );
}

