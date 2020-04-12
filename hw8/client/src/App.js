import React, { Component } from "react";
import "./App.css";
import Header from "./Header";
import { source } from './Constants'
import AppComponent from "./AppComponent";

export default class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
      source: source(),
    }

    this.handleSwitchChange = this.handleSwitchChange.bind(this)
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

  render() {
    return (
        <section key='app'>
            <Header
                handleSwitchChange={this.handleSwitchChange}/>
            <AppComponent source={this.state.source}/>
        </section>
    );
  }
};