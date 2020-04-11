import React, { Component } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import Header from "./Header";
import { source } from './Constants'
import AppComponent from "./AppComponent";

export default class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
      source: source(),
      page: null
    }

    this.handleSwitchChange = this.handleSwitchChange.bind(this)
    this.handleSearchChange = this.handleSearchChange.bind(this)
    this.handleBookmarkClick = this.handleBookmarkClick.bind(this)
    this.handlePageChange = this.handlePageChange.bind(this)
  }

  handleSwitchChange(checked) {
    if (checked) {
      localStorage.setItem('source', 'guardian')
      this.setState({source: 'guardian'})
    } else {
      localStorage.setItem('source', 'nytimes')
      this.setState({source: 'nytimes'})
    }
  }

  handleSearchChange(searchPath) {
    this.setState({page: searchPath})
  }

  handleBookmarkClick() {
    this.setState({page: '/favorites'})
  }

  handlePageChange(newPage) {
    this.setState({page: newPage})
  }

  render() {
    return (
        <section key='app'>
          <Router>
            <Header
                handleSwitchChange={this.handleSwitchChange}
                handleSearchChange={this.handleSearchChange}
                handleBookmarkClick={this.handleBookmarkClick}
                page={this.state.page}/>
            <AppComponent
                source={this.state.source}
                page={this.state.page}
                onPageChange={this.handlePageChange}/>
          </Router>
        </section>
    );
  }
};