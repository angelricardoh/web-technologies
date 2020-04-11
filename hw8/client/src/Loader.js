import React from "react";
import BounceLoader from "react-spinners/BounceLoader";
import { css } from "@emotion/core";
import './CardGridContainer.css'

const override = css`
  display: block;
  margin: 0 auto;
`;

export default function Loader(props) {
    return (
        <div className='loader-container'>
            <div className='inner-loader-container' style={{alignItems: 'center', justifyContent: 'center'}}>
                <BounceLoader
                    css={override}
                    size={60}
                    color={'#123abc'}
                    loading={true}/>
                <h2>Loading</h2>
            </div>
        </div>
    )
}