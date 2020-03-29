import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from "react-router-dom";
import "./App.css";
import Header from './Header'

const IndexPage = () => {
  return <h3>Home container</h3>;
};

const WorldPage = () => {
  return <h3>World Page</h3>;
};

const PoliticsPage = () => {
  return <h3>Politics Page</h3>;
};

const BusinessPage = () => {
  return <h3>Business container</h3>;
};

const TechnologyPage = () => {
  return <h3>Technology container</h3>;
};

const SportsPage = () => {
  return <h3>Sports container</h3>;
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
