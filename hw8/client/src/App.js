import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import Header from "./Header";
import CardGridContainer from "./CardGridContainer";

const IndexPage = () => {
  // fetch( serverHost + '/guardian_news')
  //     .then(response => response.json())
  //     .then(response => {
  //         console.log(response)
  //         const articles = response.data
  //         console.log(response.data)
  //         return <CardGridContainer articles={articles}/>
  //     })
  return <CardGridContainer source="guardian" />;
};

const WorldPage = () => {
  return <CardGridContainer />;
};

const PoliticsPage = () => {
  return <CardGridContainer />;
};

const BusinessPage = () => {
  return <CardGridContainer />;
};

const TechnologyPage = () => {
  return <CardGridContainer />;
};

const SportsPage = () => {
  return <CardGridContainer />;
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
