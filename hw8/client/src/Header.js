import React, {Component} from "react"
import 'bootstrap/dist/css/bootstrap.min.css'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
// import "./Header.css"
import AsyncSelect from 'react-select/async'
import {bingAutosuggestKey} from './Constants'
import { FaRegBookmark } from "react-icons/fa"
import SwitchSource from "./SwitchSource";
import { isGuardianChecked } from "./Constants";
import { css } from './Header.css'
// import {
//     Link
// } from "react-router-dom";
import { Link } from "react-router-dom";

let socialNetworksButtonSize = "2.5rem";

export default class Header extends Component {

    constructor(props) {
        super(props)

        this.state = {
            checked: isGuardianChecked(),
        }
        this.handleSwitchChange = this.handleSwitchChange.bind(this)
        this.handleSearchChange = this.handleSearchChange.bind(this)
    }

    handleSwitchChange(checked) {
        this.setState({ checked: checked })
        this.props.handleSwitchChange(checked)
    }

    handleSearchChange(value, { action }) {
        if (action === 'set-value') {
            // start search
            let searchPath = "/search?source=" + this.props.source +
                "&search=" + this.ref.select.select.state.focusedOption.value
            this.props.handleSearchChange(searchPath)
        }
    }

    getAutosuggestionResults = inputValue => {
        try {
            return fetch(
                `https://api.cognitive.microsoft.com/bing/v7.0/suggestions?mkt=fr-FR&q=` + inputValue,
                {
                    headers: {
                        "Ocp-Apim-Subscription-Key": bingAutosuggestKey
                    }
                }
            )
            .then(response => {
                return response.json()
            })
            .then(response => {
                let data = response
                const resultsRaw = data.suggestionGroups[0].searchSuggestions;
                const results = resultsRaw.map(result => ({value: result.displayText, label: result.displayText}));
                if (results.length === 0) {
                    return {value: 'nomatch', label: 'No Match'}
                }
                return results
                },
                error => {
                    throw error;
                }
            )
        } catch (error) {
            console.error(`Error fetching search ` + inputValue);
        }
    }

    render() {
        return (
            <header>
                <Navbar variant="dark">
                    <AsyncSelect
                            ref={ref => this.ref = ref}
                            placeholder='Enter keyword ..'
                            width='200px'
                            className='search-select'
                            cacheOptions
                            onInputChange={this.handleSearchChange}
                            loadOptions={this.getAutosuggestionResults}
                    />
                    <Nav className="mr-auto" defaultActiveKey='/'>
                        <Nav.Link as={Link} to='/'>Home</Nav.Link>
                        <Nav.Link as={Link} to="/world">World</Nav.Link>
                        <Nav.Link as={Link} to="/politics">Politics</Nav.Link>
                        <Nav.Link as={Link} to="/business">Business</Nav.Link>
                        <Nav.Link as={Link} to="/technology">Technology</Nav.Link>
                        <Nav.Link as={Link} to="/sports">Sports</Nav.Link>
                    </Nav>
                    <FaRegBookmark
                        onClick={this.props.handleBookmarkClick}
                        size={socialNetworksButtonSize}
                        style={{ marginRight: "1rem" }}
                        data-tip="Bookmark"
                    />
                    <SwitchSource handleChange={this.handleSwitchChange}
                                  checked={this.state.checked}/>
                </Navbar>
            </header>
        )
    }
}
