import { useEffect, useState } from "react";
import { useSpinner, useAuth } from "../../contexts/AuthContext";
import { db } from "../../services/firebase";
import {
  getDoc,
  getDocs,
  deleteDoc,
  doc,
  collection,
} from "firebase/firestore";
import { NavLink } from "react-router-dom";
import RecipeCard from "../../Components/RecipeCard/RecipeCard";
import { FaRegTrashAlt } from "react-icons/fa";
import { MdModeEditOutline } from "react-icons/md";

import "./profile.css";

export const getRank = (user) => {
  if (user.points < 150) {
    return "Junior Chef";
  } else if (user.points > 149 && user.points < 500) {
    return "Station Chef";
  } else if (user.points > 499 && user.points < 2000) {
    return "Deputy Chef";
  } else if (user.points > 1999 && user.points < 5000) {
    return "Head Chef";
  } else if (user.points > 4999) {
    return "Master Chef";
  }
};

function Profile({ match }) {
  const [user, setUser] = useState(null);
  const [userRecipies, setUserRecipies] = useState([]);
  const [deletePop, setDeletePop] = useState([false, null, null]);
  const [notFound, setNotFound] = useState(false);

  const { currentUser } = useAuth();
  const { isSpinning, setIsSpinning } = useSpinner();

  useEffect(() => {
    const getData = async () => {
      try {
        setIsSpinning(true);
        const userRef = doc(db, "users", match.params.id);
        const userData = await getDoc(userRef);
        if (userData.exists()) {
          setUser(userData.data());
          setNotFound(false);
        } else {
          setNotFound(true);
        }
      } catch (err) {
        console.log(err.message);
      } finally {
        setIsSpinning(false);
      }
    };
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match.params.id]);

  useEffect(() => {
    const getData = async () => {
      try {
        setIsSpinning(true);
        const data = await getDocs(collection(db, "usersRecipies"));
        const userRecipies = [];
        data.forEach((doc) => {
          if (doc.data().userID === match.params.id) {
            userRecipies.push(doc.data());
          }
        });
        setUserRecipies(userRecipies);
      } catch (err) {
        console.log(err.message);
      } finally {
        setIsSpinning(false);
      }
    };
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match.params.id]);

  const getUserJSX = () => {
    if (!user) return;
    return (
      <div className="UserInfo">
        <h2>{user.displayName}</h2>
        <h4>
          Rank: <span>{getRank(user)}</span>, Pts:
          <span>{user.points}</span>
        </h4>

        <img src={user.img} alt={user.displayName} />
        {user.location && <div>Location: {user.location}</div>}
        {user.age && <div>Age: {user.age}</div>}
        {user.bio && <p>Bio: {user.bio}</p>}
        {user.id === currentUser.id && (
          <div className="editOption">
            <NavLink to="/EditProfile">
              Edit <MdModeEditOutline />
            </NavLink>
          </div>
        )}
      </div>
    );
  };

  const getKitchenHeader = () => {
    const elseKitchen = `${user.displayName.split(" ")[0]}'s Kitchen`;
    if (!currentUser) return elseKitchen;
    return currentUser.id === user.id ? "My Kitchen" : elseKitchen;
  };

  const getUserRecipies = () => {
    return userRecipies.map((recipe, idx) => {
      return (
        <RecipeCard
          key={recipe.id}
          img={recipe.img}
          name={recipe.name}
          type={`${recipe.area}, ${recipe.category}`}
          navLink={`/Profile/${match.params.id}/user/${recipe.id}`}
        >
          {currentUser && user && currentUser.id === user.id && (
            <>
              <FaRegTrashAlt
                onClick={() => deleteRecipe(idx, recipe.id)}
                className="react-icon"
                color="rgb(235, 201, 110)"
              />
              <NavLink to={`/Add-Edit-Recipe/${recipe.id}`}>
                <MdModeEditOutline
                  color="rgb(235, 201, 110)"
                  className="react-icon"
                />
              </NavLink>
            </>
          )}
        </RecipeCard>
      );
    });
  };

  const deleteRecipe = (idx, id) => {
    setDeletePop([true, idx, id]);
    document.body.style.overflow = "hidden";
  };

  const confirmDelete = async () => {
    try {
      setDeletePop((prev) => [false, prev[1], prev[2]]);
      setIsSpinning(true);
      await deleteDoc(doc(db, "usersRecipies", deletePop[2]));
      const newRecipies = [...userRecipies];
      newRecipies.splice(deletePop[1], 1);
      setUserRecipies(newRecipies);
    } catch (err) {
      console.log(err);
    } finally {
      setDeletePop([false, null, null]);
      setIsSpinning(false);
      document.body.style.overflow = "scroll";
    }
  };

  if (notFound) return <div>User Not Found!</div>;

  return (
    <div className="profileContainer">
      {getUserJSX()}
      <div className="myKitchen">
        <h1>{user && getKitchenHeader()}</h1>
        {currentUser && user && currentUser.id === user.id && (
          <NavLink to="/Add-Edit-Recipe">
            <button>Add Recipe</button>
          </NavLink>
        )}
        <div className="userRecipeContainer">
          {!isSpinning && getUserRecipies()}
        </div>
      </div>
      {deletePop[0] && (
        <div className="confirmDelete">
          <div className="innerConfrim">
            <h2>Are You Sure?</h2>
            <div>
              <button
                onClick={() => {
                  setDeletePop([false, null, null]);
                  document.body.style.overflow = "scroll";
                }}
              >
                cancel
              </button>
              <button onClick={confirmDelete}>confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
