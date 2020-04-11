import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import CardGridContainer from "./CardGridContainer";
import DetailCardContainer from './DetailCardContainer'
import {withRouter} from 'react-router-dom'

class AppComponent extends Component {

    constructor(props) {
        super(props)

        this.state = {
            source: this.props.source,
        }
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

    componentDidUpdate(prevProps) {
        if (prevProps.page !== this.props.page) {
            this.props.history.push(this.props.page)
        }
    }

    render() {
        return (
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
                           component={() =>
                               <CardGridContainer key='sports' page='sports' source={this.state.source} />}
                    />
                    <Route exact
                           path="/detail"
                           component={({ match, location }) =>
                           {
                               let searchParams = new URLSearchParams(location.search)
                               let articleId = searchParams.get('articleId')
                               return (
                                   <DetailCardContainer source={this.state.source}
                                                        articleId={articleId}
                                   />
                               );
                           }}
                    />
                    <Route exact
                           path="/search"
                           component={({ match, location }) =>
                           {
                               let searchParams = new URLSearchParams(location.search)
                               console.log(searchParams)
                               let search = searchParams.get('search')
                               console.log(search)
                               return (
                                   <CardGridContainer key='search'
                                                      source={this.state.source}
                                                      page='search'
                                                      search={search}
                                   />
                               );
                           }}
                    />
                    <Route exact
                           path="/favorites"
                           component={({ match, location }) =>
                           {
                               return (
                                   <CardGridContainer key='favorites'
                                                      source={this.state.source}
                                                      page='favorites'
                                   />
                               );
                           }}
                    />
                </Switch>
        );
    }
};

export default withRouter(AppComponent)