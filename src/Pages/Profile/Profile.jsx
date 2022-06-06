import { useEffect, useState } from "react";
import { useSpinner, useAuth } from "../../contexts/AuthContext";
import { db } from "../../services/firebase";
import {
  getDoc,
  getDocs,
  deleteDoc,
  setDoc,
  doc,
  collection,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { NavLink } from "react-router-dom";
import RecipeCard from "../../Components/RecipeCard/RecipeCard";
import { FaRegTrashAlt } from "react-icons/fa";
import { MdModeEditOutline } from "react-icons/md";

import "./profile.css";

function Profile({ match }) {
  const [user, setUser] = useState(null);
  const [userRecipies, setUserRecipies] = useState([]);
  const [deletePop, setDeletePop] = useState([false, null, null]);
  const [notFound, setNotFound] = useState(false);

  const { currentUser } = useAuth();
  const { setIsSpinning } = useSpinner();

  useEffect(() => {
    const getData = async () => {
      try {
        setIsSpinning(true);
        const userRef = doc(db, "users", match.params.id);
        const userData = await getDoc(userRef);
        if (userData.exists()) {
          setUser(userData.data());
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
  }, [match.params.id]);

  const getUserJSX = () => {
    if (!user) return;
    return (
      <div className="UserInfo">
        <h2>{user.displayName}</h2>
        <img src={user.img} alt={user.displayName} />
        {user.location && <div>Location: {user.location}</div>}
        {user.age && <div>Age: {user.age}</div>}
        {user.bio && <p>Bio: {user.bio}</p>}
      </div>
    );
  };

  if (notFound) return <div>User Not Found!</div>;

  const getKitchenHeader = () => {
    const elseKitchen = `${user.displayName.split(" ")[0]}'s Kitchen`;
    if (!currentUser) return elseKitchen;
    return currentUser.id === user.id ? "My Kitchen" : elseKitchen;
  };

  const getUserRecipies = () => {
    return userRecipies.map((recipe, idx) => {
      return (
        <RecipeCard
          key={recipe.recipeID}
          id={recipe.recipeID}
          img={recipe.img}
          name={recipe.name}
          type={`${recipe.area}, ${recipe.category}`}
          letter={recipe.name[0]}
          from="user"
        >
          {currentUser && user && currentUser.id === user.id && (
            <>
              <FaRegTrashAlt
                onClick={() => deleteRecipe(idx, recipe.recipeID)}
                className="react-icon"
              />
              <NavLink to={`/Add-Edit-Recipe/${recipe.recipeID}`}>
                <MdModeEditOutline color="black" className="react-icon" />
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
      await deleteDoc(doc(db, "usersRecipies", deletePop[2]));
      const newRecipies = [...userRecipies];
      newRecipies.splice(deletePop[1], 1);
      setUserRecipies(newRecipies);
    } catch (err) {
      console.log(err);
    } finally {
      setDeletePop([false, null, null]);
      document.body.style.overflow = "scroll";
    }
  };

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
        <div className="userRecipeContainer">{getUserRecipies()}</div>
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
