import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Header from "./Components/Header/Header";
import HomePage from "./Pages/HomePage";
import Recipies from "./Pages/Recipies/Recipies";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import Login from "./Pages/Login";
import Profile from "./Pages/Profile";
import RecipePage from "./Pages/RecipePage/RecipePage";
import NotFound from "./Pages/NotFound";

import "./style.css";

function App() {
  return (
    <>
      <Router>
        <Header />
        <div className="mainContainer">
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route exact path="/Recipies/:letter" component={Recipies} />
            <Route exact path="/About" component={About} />
            <Route exact path="/Contact" component={Contact} />
            <Route exact path="/Profile" component={Profile} />
            <Route exact path="/Login" component={Login} />
            <Route exact path="/Recipies/:letter/:id?" component={RecipePage} />
            <Route path="*" component={NotFound} />
          </Switch>
        </div>
      </Router>
    </>
  );
}

export default App;
