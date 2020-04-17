import Switch from "react-switch";
import React from "react";
import './SwitchSource.css'

export default function SwitchSource(props) {
    let displaySwitchValue = 'null'
    if (props.section === 'search' || props.section === 'favorites' || props.section === 'detail') {
        displaySwitchValue = 'none'
    } else {
        displaySwitchValue = 'flex'
    }
    return (
        <div style={{display:displaySwitchValue}}>
            <Switch className='switch-source'
                    onChange={props.handleChange}
                    checked={props.checked}
                    uncheckedIcon={false}
                    checkedIcon={false}
                    onColor='#0199FB'
            />
        </div>
    )
}