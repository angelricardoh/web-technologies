import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import Header from "./Header";
import CardGridContainer from "./CardGridContainer";

const source = function() {
  let storedSource = localStorage.getItem("source");
  if (storedSource === 'nytimes') {
    return storedSource;
  } else {  // default case
    return 'guardian';
  }
};

const isGuardianChecked = function() {
  return source() === 'guardian' ? true : false
}

export default class App extends Component {

  constructor() {
    super()

    this.state = {
      source: source(),
      isGuardianChecked: isGuardianChecked()
    }
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(checked) {
    console.log(checked)
    if (checked) {
      localStorage.setItem('source', 'guardian')
      this.setState({source: 'guardian', isGuardianChecked: true})
    } else {
      localStorage.setItem('source', 'nytimes')
      this.setState({source: 'nytimes', isGuardianChecked: false})
    }
  }

  render() {
    return (
        <section className="App">
          <Header isGuardianChecked={this.state.isGuardianChecked} handleChange={this.handleChange}/>
          <Router>
            <Switch>
              <Route exact
                     path="/"
                     component={() => <CardGridContainer key='home' page='home' source={this.state.source} />}
              />
              <Route exact
                     path="/world"
                     component={() => <CardGridContainer key='world' page='world' source={this.state.source} />}
              />
              <Route exact
                     path="/politics"
                     component={() => <CardGridContainer key='politics' page='politics' source={this.state.source} />}
              />
              <Route exact
                     path="/business"
                     component={() => <CardGridContainer key='business' page='business' source={this.state.source} />}
              />
              <Route exact
                     path="/technology"
                     component={() => <CardGridContainer key='technology' page='technology' source={this.state.source} />}
              />
              <Route exact
                     path="/sports"
                     component={() => <CardGridContainer key='sports' page='sports' source={this.state.source} />}
              />
            </Switch>
          </Router>
        </section>
    );
  }
};