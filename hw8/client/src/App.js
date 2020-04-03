import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import Header from "./Header";
import CardGridContainer from "./CardGridContainer";

const source = function() {
  let storedSource = localStorage.getItem("source");
  if (storedSource === "nytimes") {
    return storedSource;
  } else {
    // default
    return "guardian";
  }
};

const IndexPage = () => {
  return <CardGridContainer page="home" source={source} />;
};

const WorldPage = () => {
  return <CardGridContainer page="world" source={source} />;
};

const PoliticsPage = () => {
  return <CardGridContainer page="politics" source={source} />;
};

const BusinessPage = () => {
  return <CardGridContainer page="business" source={source} />;
};

const TechnologyPage = () => {
  return <CardGridContainer page="technology" source={source} />;
};

const SportsPage = () => {
  return <CardGridContainer page="sports" />;
};

const App = () => {
  return (
    <section className="App">
      <Header />
      <Router>
        <Switch>
          <Route exact path="/" component={IndexPage} />
          <Route exact path="/world" component={WorldPage} />
          <Route exact path="/politics" component={PoliticsPage} />
          <Route exact path="/business" component={BusinessPage} />
          <Route exact path="/technology" component={TechnologyPage} />
          <Route exact path="/sports" component={SportsPage} />
        </Switch>
      </Router>
    </section>
  );
};

export default App;
