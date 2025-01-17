import React, { Component } from "react";
import { Route, Switch, withRouter, Redirect } from "react-router-dom";
import "./App.css";
import CardGridContainer from "./CardGridContainer";
import DetailCardContainer from './DetailCardContainer'

class AppComponent extends Component {
    render() {
        return (
                <Switch>
                    <Route exact
                           path="/home"
                           component={() => <CardGridContainer key='home' page='home' source={this.props.source} />}
                    />
                    <Route exact
                           path="/world"
                           component={() => <CardGridContainer key='world' page='world' source={this.props.source} />}
                    />
                    <Route exact
                           path="/politics"
                           component={() => <CardGridContainer key='politics' page='politics' source={this.props.source} />}
                    />
                    <Route exact
                           path="/business"
                           component={() => <CardGridContainer key='business' page='business' source={this.props.source} />}
                    />
                    <Route exact
                           path="/technology"
                           component={() => <CardGridContainer key='technology' page='technology' source={this.props.source} />}
                    />
                    <Route exact
                           path="/sports"
                           component={() =>
                               <CardGridContainer key='sports' page='sports' source={this.props.source} />}
                    />
                    <Route exact
                           path="/detail"
                           component={({ match, location }) =>
                           {
                               console.log('detail')
                               let searchParams = new URLSearchParams(location.search)
                               let articleId = searchParams.get('articleId')
                               return (
                                   <DetailCardContainer source={this.props.source}
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
                               let search = searchParams.get('search')
                               return (
                                   <CardGridContainer key='search'
                                                      source={this.props.source}
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
                                                      source={this.props.source}
                                                      page='favorites'
                                   />
                               );
                           }}
                    />
                    <Redirect from="/" to="/home" />
                </Switch>
        );
    }
};

export default withRouter(AppComponent)