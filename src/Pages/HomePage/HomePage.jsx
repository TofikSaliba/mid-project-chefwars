import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { db } from "../../services/firebase";
import { getDocs, collection } from "firebase/firestore";
import { useAuth } from "../../contexts/AuthContext";
import { getRank } from "../Profile/Profile";
import RecipeCard from "../../Components/RecipeCard/RecipeCard";
import API from "../../api/API";
import "./homePage.css";

function HomePage() {
  const [users, setUsers] = useState([]);
  const [recipieDay, setRecipieDay] = useState(null);
  const { currentUser, setIsSpinning, isSpinning } = useAuth();

  useEffect(() => {
    const getData = async () => {
      try {
        setIsSpinning(true);
        const data = await getDocs(collection(db, "users"));
        const users = [];
        data.forEach((doc) => {
          users.push(doc.data());
        });
        setUsers(users.sort((a, b) => b.points - a.points));
      } catch (err) {
        console.log(err.message);
      } finally {
        setIsSpinning(false);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    const getData = async () => {
      try {
        setIsSpinning(true);
        const {
          data: { meals },
        } = await API.get(`/lookup.php?i=53050`);
        setRecipieDay(meals[0]);
      } catch (err) {
        console.log(err.message);
      } finally {
        setIsSpinning(false);
      }
    };
    getData();
  }, []);

  const getTopUsers = () => {
    const topThree = users.slice(0, 3);
    return topThree.map((user, idx) => {
      return (
        <div key={user.id} className="user">
          <span className="name">{`${idx + 1}. ${user.displayName}`}</span>
          <span className="title">{getRank(user)}</span>
          <span className="points">{user.points}</span>
        </div>
      );
    });
  };

  const getRecipeOfDay = () => {
    if (!recipieDay) return;
    return (
      <RecipeCard
        key={recipieDay.idMeal}
        img={recipieDay.strMealThumb}
        name={recipieDay.strMeal}
        type={`${recipieDay.strArea}, ${recipieDay.strCategory}`}
        navLink={`/Recipies/${recipieDay.strMeal[0]}/web/${recipieDay.idMeal}`}
      />
    );
  };

  if (isSpinning) return;

  return (
    <>
      <div className="welcomeInto">
        <h1>Welcome To ChefWars!</h1>
        <p>
          Do you love cooking and food ? ChefWars is the right place for you,
          checkout various recipies from the web, or others added by our users,
          as can you!
        </p>
        <NavLink to="/About">
          <button>Read More</button>
        </NavLink>
      </div>
      <div className="dayAndUsers">
        <div className="recipeOfTheDay">
          <h2>Recipe Of The Day</h2>
          {getRecipeOfDay()}
        </div>
        <div className="topAndLoginContainer">
          <div className="topUsers">
            <h2>Our Top Users</h2>
            <div className="headers">
              <span className="name">Name</span>
              <span className="title">Title</span>
              <span className="points">Points</span>
            </div>
            {getTopUsers()}
          </div>
          {!currentUser && (
            <div className="joinUs">
              <p>
                Create your own recipies, with the ability to post a video, get
                likes and reputation points for it and climb up the ladder of
                Chefwars! What are you waiting for ?
              </p>
              <NavLink to="/Login">
                <button>Login now!</button>
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default HomePage;
