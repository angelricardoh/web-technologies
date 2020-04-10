import Switch from "react-switch";
import React from "react";

export default function SwitchSource(props) {
    const pathname = window.location.pathname;
    let shouldSwitchBeDisplayed = 'flex'
    if (pathname.includes('search') || pathname.includes('favorites') || pathname.includes('detail')) {
        shouldSwitchBeDisplayed = 'none'
    }
    return (
        <div style={{display:shouldSwitchBeDisplayed}}>
            <span>NYTimes</span>
            <Switch onChange={props.handleChange}
                    checked={props.checked}
                    uncheckedIcon={false}
                    checkedIcon={false}
                    onColor='#0199FB'
            />
            <span>Guardian</span>
        </div>
    )
}