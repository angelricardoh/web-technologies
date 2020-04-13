import React, {Component} from "react"
import 'bootstrap/dist/css/bootstrap.min.css'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import AsyncSelect from 'react-select/async'
import {bingAutosuggestKey} from './Constants'
import { FaBookmark, FaRegBookmark } from "react-icons/fa"
import SwitchSource from "./SwitchSource";
import { isGuardianChecked } from "./Constants";
import './Header.css'
import { Link } from "react-router-dom";
import { withRouter } from 'react-router-dom'
import { section } from './Constants'

let bookmarkButtonSize = "24px";

class Header extends Component {

    constructor(props) {
        super(props)

        this.state = {
            checked: isGuardianChecked(),
            selectValue: null,
            section: section(this.props.location)
        }
        this.handleSwitchChange = this.handleSwitchChange.bind(this)
        this.handleSearchChange = this.handleSearchChange.bind(this)
        this.handleSectionChange = this.handleSectionChange.bind(this)
        this.handleItemSelectChange = this.handleItemSelectChange.bind(this)
        this.handleBookmarkClick = this.handleBookmarkClick.bind(this)
    }

    componentDidMount() {
        this.unlisten = this.props.history.listen((location, action) => {
            if (!location.pathname.includes('search')) {
                this.setState({selectValue: null})
            }
            if (location.pathname.includes('detail')) {
                this.setState({section: 'detail'})
            }
            console.log("current section")
            console.log(this.state.section)
        });
    }

    componentWillUnmount() {
        this.unlisten();
    }

    handleSwitchChange(checked) {
        this.setState({ checked: checked })
        this.props.handleSwitchChange(checked)
    }

    handleSearchChange(value, { action }) {
        if (action === 'set-value') {
            const selectedSearch = this.ref.select.select.state.focusedOption.value
            let searchPath = "/search?source=" + this.props.source +
                "&search=" + selectedSearch
            this.props.history.push(searchPath)
            this.setState({section: 'search'})
        }
    }

    handleSectionChange() {
        this.setState({section: 'sections'})
    }

    handleItemSelectChange(option) {
        this.setState({selectValue: option});
    }

    handleBookmarkClick() {
        this.props.history.push('/favorites')
        this.setState({section: 'favorites'})
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
        let bookmarkTabButton = null
        if (this.state.section === 'favorites') {
            bookmarkTabButton = <FaBookmark onClick={this.handleBookmarkClick}
                        size={bookmarkButtonSize}
                        style={{ marginRight: "16px" }}
                        data-tip="Bookmark"
            />
        } else {
            bookmarkTabButton = <FaRegBookmark
                onClick={this.handleBookmarkClick}
                size={bookmarkButtonSize}
                style={{ marginRight: "16px" }}
                data-tip="Bookmark"
            />
        }
        return (
            <header>
                <Navbar variant="dark">
                    <AsyncSelect
                            ref={ref => this.ref = ref}
                            value={this.state.selectValue}
                            placeholder='Enter keyword ..'
                            width='200px'
                            className='search-select'
                            cacheOptions
                            onInputChange={this.handleSearchChange}
                            loadOptions={this.getAutosuggestionResults}
                            onChange={(option) => this.handleItemSelectChange(option)}
                    />
                    <Nav className="mr-auto" defaultActiveKey='/'>
                        <Nav.Link as={Link} to='/' onClick={this.handleSectionChange}>Home</Nav.Link>
                        <Nav.Link as={Link} to="/world" onClick={this.handleSectionChange}>World</Nav.Link>
                        <Nav.Link as={Link} to="/politics" onClick={this.handleSectionChange}>Politics</Nav.Link>
                        <Nav.Link as={Link} to="/business" onClick={this.handleSectionChange}>Business</Nav.Link>
                        <Nav.Link as={Link} to="/technology" onClick={this.handleSectionChange}>Technology</Nav.Link>
                        <Nav.Link as={Link} to="/sports" onClick={this.handleSectionChange}>Sports</Nav.Link>
                    </Nav>
                    {bookmarkTabButton}
                    <SwitchSource section={this.state.section}
                                  handleChange={this.handleSwitchChange}
                                  checked={this.state.checked}/>
                </Navbar>
            </header>
        )
    }
}

export default withRouter(Header)