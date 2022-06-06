import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Header from "./Components/Header/Header";
import HomePage from "./Pages/HomePage";
import Recipies from "./Pages/Recipies/Recipies";
import About from "./Pages/About";
import Contact from "./Pages/Contact/Contact";
import Login from "./Pages/Login";
import Profile from "./Pages/Profile/Profile";
import EditProfile from "./Pages/editProfile/EditProfile";
import RecipePage from "./Pages/RecipePage/RecipePage";
import NotFound from "./Pages/NotFound";
import AddRecipe from "./Pages/AddRecipe/AddRecipe";
import PrivateRoute from "./Components/PrivateRoute/PrivateRoute";
import { useHamburgerMenu } from "./contexts/AuthContext";

import "./style.css";

function App() {
  const { setHamburgerMenu } = useHamburgerMenu();

  return (
    <>
      <Router>
        <Header />
        <div onClick={() => setHamburgerMenu(false)} className="mainContainer">
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route exact path="/Recipies/:letter" component={Recipies} />
            <Route path="/About" component={About} />
            <Route exact path="/Contact" component={Contact} />
            <Route exact path="/Profile/:id" component={Profile} />
            <PrivateRoute exact path="/EditProfile" component={EditProfile} />
            <PrivateRoute exact path="/AddRecipe" component={AddRecipe} />
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
