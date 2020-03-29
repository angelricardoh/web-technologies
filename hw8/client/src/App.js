import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from "react-router-dom";
import "./App.css";
import Header from './Header'
import CardContainer from './CardContainer'

const IndexPage = () => {
    // fetch( serverHost + '/guardian_news')
    //     .then(response => response.json())
    //     .then(response => {
    //         console.log(response)
    //         const articles = response.data
    //         console.log(response.data)
    //         return <CardContainer articles={articles}/>
    //     })
    return <CardContainer source='guardian'/>
};

const WorldPage = () => {
  return <CardContainer />
};

const PoliticsPage = () => {
  return <CardContainer />
};

const BusinessPage = () => {
  return <CardContainer />
};

const TechnologyPage = () => {
  return <CardContainer />
};

const SportsPage = () => {
  return <CardContainer />
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
