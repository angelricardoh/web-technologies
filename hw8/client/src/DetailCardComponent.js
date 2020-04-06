import React from "react";
// import { Text } from "react-native";
// import { sections } from "./Constants";

export default function DetailCardComponent(props) {
    return (
        <div className="card promoting-card">
            {/*Card content*/}
            <div className="card-body">
                <p>{props.title}</p>
                <div className="collapse-content">
                    {/*Text*/}
                    <p className="card-text collapse" id="collapseContent">Recently, we added several exotic new dishes to
                        our restaurant menu. They come from countries such as Mexico, Argentina, and Spain. Come to us,
                        have some delicious wine and enjoy our juicy meals from around the world.</p>
                </div>

            </div>
        </div>
    );
}

