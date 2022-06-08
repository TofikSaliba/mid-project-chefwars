import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Lottie from "lottie-react";
import foodSpinner from "./lottie/food-animation.json";
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
// sadf
import {
  useHamburgerMenu,
  useDropProfile,
  useSpinner,
} from "./contexts/AuthContext";

import "./style.css";

function App() {
  const { hamburgerMenu, setHamburgerMenu } = useHamburgerMenu();
  const { dropProfile, setDropProfile } = useDropProfile();
  const { isSpinning } = useSpinner();

  const handlePopUpClose = () => {
    if (hamburgerMenu) setHamburgerMenu(false);
    if (!dropProfile) setDropProfile(true);
  };

  return (
    <>
      <Router>
        {isSpinning && (
          <div id="lottieSpinnerDiv">
            <Lottie
              className="lottieSpinner"
              animationData={foodSpinner}
              loop
            />
          </div>
        )}
        <Header />
        <div onClick={handlePopUpClose} className="mainContainer">
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route exact path="/Recipies/:letter" component={Recipies} />
            <Route path="/About" component={About} />
            <Route exact path="/Contact" component={Contact} />
            <Route exact path="/Profile/:id" component={Profile} />
            <Route
              exact
              path="/Profile/:id/:from/:recipeId"
              component={RecipePage}
            />
            <PrivateRoute exact path="/EditProfile" component={EditProfile} />
            <PrivateRoute
              exact
              path="/Add-Edit-Recipe/:editing?"
              component={AddRecipe}
            />
            <Route exact path="/Login" component={Login} />
            <Route
              exact
              path="/Recipies/:letter/:from/:recipeId"
              component={RecipePage}
            />
            <Route path="*" component={NotFound} />
          </Switch>
        </div>
      </Router>
    </>
  );
}

export default App;
