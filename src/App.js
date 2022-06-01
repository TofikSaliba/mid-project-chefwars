// import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Header from "./Components/Header/Header";
import HomePage from "./Pages/HomePage";
import Recipies from "./Pages/Recipies";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import Login from "./Pages/Login";
import Profile from "./Pages/Profile";
import RecipePage from "./Pages/RecipePage";
import NotFound from "./Pages/NotFound";
// import API from "./api/API";

import "./style.css";

function App() {
  // const [data, setData] = useState([]);

  // useEffect(() => {
  //   const getData = async () => {
  //     const data = await API.get(
  //       "?query=pasta&addRecipeInformation=true"
  //     );
  //     console.log(data);
  //     // setData(data);
  //   };

  //   getData();
  // }, []);

  return (
    <>
      <Router>
        <Header />
        <div className="mainContainer">
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route exact path="/Recipies" component={Recipies} />
            <Route exact path="/About" component={About} />
            <Route exact path="/Contact" component={Contact} />
            <Route exact path="/Profile" component={Profile} />
            <Route exact path="/Login" component={Login} />
            <Route exact path="/Recipies/:id" component={RecipePage} />
            <Route path="*" component={NotFound} />
          </Switch>
        </div>
      </Router>
    </>
  );
}

export default App;
