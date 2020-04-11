import React, {Component, useReducer} from "react"
import 'bootstrap/dist/css/bootstrap.min.css'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import "./Header.css"
import AsyncSelect from 'react-select/async'
import {bingAutosuggestKey} from './Constants'
import { FaRegBookmark } from "react-icons/fa"
import SwitchSource from "./SwitchSource";
import { isGuardianChecked } from "./Constants";
import { useHistory } from "react-router-dom";
import { Redirect } from 'react-router'
let socialNetworksButtonSize = "2.5rem";

export default class Header extends Component {

    constructor(props) {
        super(props)

        this.state = {
            checked: isGuardianChecked(),
        }
        this.handleSearchChange = this.handleSearchChange.bind(this)
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return false
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
                <Navbar bg="primary" variant="dark">
                    <AsyncSelect
                            ref={ref => this.ref = ref}
                            placeholder='Enter keyword ..'
                            width='200px'
                            className='search-select'
                            cacheOptions
                            onInputChange={this.handleSearchChange}
                            loadOptions={this.getAutosuggestionResults}
                    />
                    <Nav className="mr-auto">
                        <Nav.Link href="/">Home</Nav.Link>
                        <Nav.Link href="/world">World</Nav.Link>
                        <Nav.Link href="/politics">Politics</Nav.Link>
                        <Nav.Link href="/business">Business</Nav.Link>
                        <Nav.Link href="/technology">Technology</Nav.Link>
                        <Nav.Link href="/sports">Sports</Nav.Link>
                    </Nav>
                    <FaRegBookmark
                        onClick={this.props.handleBookmarkClick}
                        size={socialNetworksButtonSize}
                        style={{ marginRight: "1rem" }}
                        data-tip="Bookmark"
                    />
                    <SwitchSource handleChange={this.props.handleSwitchChange}
                                  checked={this.state.checked}/>
                </Navbar>
            </header>
        )
    }
}
