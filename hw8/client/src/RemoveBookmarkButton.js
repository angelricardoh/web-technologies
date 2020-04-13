import React, {Component} from "react";
import {FaTrash} from 'react-icons/fa'

export default class ShareButton extends Component {
    render() {
        return (
            <button>
                <FaTrash
                    onClick={this.props.handleRemoveBookmark}
                    size='16px'/>
            </button>
        )
    }
}