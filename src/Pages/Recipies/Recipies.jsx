import { useEffect, useState } from "react";
import RecipeCard from "../../Components/RecipeCard/RecipeCard";
import RecipeSearch from "../../Components/RecipeSearch/RecipeSearch";
import { useSpinner } from "../../contexts/AuthContext";
import axios from "axios";
import API from "../../api/API";

import "./recipies.css";

function Recipies({ match }) {
  const [fetchedRecipies, setFetchedRecipies] = useState(null);
  const { isSpinning, setIsSpinning } = useSpinner();

  useEffect(() => {
    const getData = async () => {
      try {
        setIsSpinning(true);
        const { data } = await axios.get(
          `https://www.themealdb.com/api/json/v1/1/search.php?f=${match.params.letter}`
        );
        setFetchedRecipies({
          results: data.meals,
          letter: match.params.letter,
        });
      } catch (err) {
        console.log(err.message);
      } finally {
        setIsSpinning(false);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    console.log(fetchedRecipies);
  }, [fetchedRecipies]);

  const getRecipiesCards = () => {
    if (!fetchedRecipies) return;
    return fetchedRecipies.results.map((recipe) => {
      return (
        <RecipeCard
          key={recipe.idMeal}
          id={recipe.idMeal}
          img={recipe.strMealThumb}
          name={recipe.strMeal}
          type={`${recipe.strArea}, ${recipe.strCategory}`}
          letter={fetchedRecipies.letter}
        />
      );
    });
  };

  if (isSpinning) {
    return (
      <>
        <RecipeSearch setFetchedRecipies={setFetchedRecipies} />
        <div className="lds-roller">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </>
    );
  }

  return (
    <>
      <RecipeSearch setFetchedRecipies={setFetchedRecipies} />
      <div className="recipiesCardContainer">{getRecipiesCards()}</div>
    </>
  );
}

export default Recipies;
