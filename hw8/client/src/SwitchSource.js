import Switch from "react-switch";
import React from "react";
import { useLocation } from 'react-router-dom'

export default function SwitchSource(props) {
    const location = useLocation()
    const pathname = location.pathname
    let shouldSwitchBeDisplayed = 'flex'
    if (pathname.includes('search') || pathname.includes('favorites') || pathname.includes('detail')) {
        shouldSwitchBeDisplayed = 'none'
    } else {
        shouldSwitchBeDisplayed = 'flex'
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