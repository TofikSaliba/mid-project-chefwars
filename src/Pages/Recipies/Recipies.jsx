import { useEffect, useState } from "react";
import RecipeCard from "../../Components/RecipeCard/RecipeCard";
import RecipeSearch from "../../Components/RecipeSearch/RecipeSearch";
import { db } from "../../services/firebase";
import { getDocs, collection } from "firebase/firestore";
import { useSpinner } from "../../contexts/AuthContext";
import API from "../../api/API";

import "./recipies.css";

function Recipies({ match, history }) {
  const [fetchedRecipies, setFetchedRecipies] = useState({ results: [] });
  const [userRecipies, setUserRecipies] = useState({ results: [] });
  const [groupToShow, setGroupToShow] = useState("all");
  const { isSpinning, setIsSpinning } = useSpinner();

  useEffect(() => {
    window.scrollTo({
      top: 0,
    });
    const searchFor = match.params.letter.length > 1 ? "s" : "f";
    const getData = async () => {
      try {
        setIsSpinning(true);
        const { data } = await API.get(
          `/search.php?${searchFor}=${match.params.letter}`
        );
        setFetchedRecipies({
          results: data.meals ?? [],
          letter: match.params.letter,
        });
        await getUserRecipe();
      } catch (err) {
        console.log(err.message);
      } finally {
        setIsSpinning(false);
      }
    };
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getUserRecipe = async () => {
    const searchFor = match.params.letter.length > 1 ? "s" : "f";
    try {
      const data = await getDocs(collection(db, "usersRecipies"));
      const userR = [];
      data.forEach((doc) => {
        if (
          searchFor === "s" &&
          doc
            .data()
            .name.toLowerCase()
            .includes(match.params.letter.toLowerCase())
        ) {
          userR.push(doc.data());
        } else if (
          searchFor === "f" &&
          doc
            .data()
            .name.toLowerCase()
            .startsWith(match.params.letter.toLowerCase())
        ) {
          userR.push(doc.data());
        }
      });
      setUserRecipies({
        results: userR,
        letter: match.params.letter,
      });
    } catch (err) {
      console.log(err.message);
    }
  };

  const checkGetRecipiesCards = () => {
    if (!fetchedRecipies.results && !userRecipies.results) return;

    if (
      !fetchedRecipies.results &&
      (groupToShow === "all" || groupToShow === "web")
    )
      return;
    if (groupToShow === "all" || groupToShow === "web") {
      const APIRecipies = fetchedRecipies.results.map((rec) => {
        return {
          name: rec.strMeal,
          img: rec.strMealThumb,
          area: rec.strArea,
          category: rec.strCategory,
          id: rec.idMeal,
        };
      });

      if (groupToShow === "all") {
        return getRecipiesCards(APIRecipies.concat(userRecipies.results));
      } else {
        return getRecipiesCards(APIRecipies);
      }
    } else {
      return getRecipiesCards(userRecipies.results);
    }
  };

  const getRecipiesCards = (recipiesArr) => {
    return recipiesArr.map((recipe) => {
      const link = recipe.userID
        ? `/Recipies/${userRecipies.letter}/user/${recipe.id}`
        : `/Recipies/${fetchedRecipies.letter}/web/${recipe.id}`;
      return (
        <RecipeCard
          key={recipe.id}
          img={recipe.img}
          name={recipe.name}
          type={`${recipe.area}, ${recipe.category}`}
          navLink={link}
        />
      );
    });
  };

  const noRecipies = () => {
    if (!fetchedRecipies || !userRecipies) return false;
    if (!fetchedRecipies.results.length && !userRecipies.results.length) {
      return true;
    }
    return false;
  };

  if (isSpinning) {
    return (
      <>
        <RecipeSearch
          setFetchedRecipies={setFetchedRecipies}
          setUserRecipies={setUserRecipies}
          setGroupToShow={setGroupToShow}
        />
      </>
    );
  }

  return (
    <>
      <RecipeSearch
        setFetchedRecipies={setFetchedRecipies}
        setUserRecipies={setUserRecipies}
        setGroupToShow={setGroupToShow}
        history={history}
        defaultSelect={match.params.letter[0]}
        searchRadio={match.params.letter.length > 1}
      />
      {noRecipies() && <div className="noRecipies">No Recipies Found</div>}
      <div className="recipiesCardContainer">{checkGetRecipiesCards()}</div>
    </>
  );
}

export default Recipies;
