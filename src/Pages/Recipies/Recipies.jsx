import { useEffect, useState } from "react";
import RecipeCard from "../../Components/RecipeCard/RecipeCard";
import RecipeSearch from "../../Components/RecipeSearch/RecipeSearch";
import { useSpinner } from "../../contexts/AuthContext";

import "./recipies.css";

function Recipies() {
  const [fetchedRecipies, setFetchedRecipies] = useState([]);
  const { isSpinning } = useSpinner();

  useEffect(() => {
    console.log(fetchedRecipies);
  }, [fetchedRecipies]);

  const getRecipiesCards = () => {
    if (fetchedRecipies.length === 0) return;
    return fetchedRecipies.results.map((recipe) => {
      return (
        <RecipeCard
          key={recipe.id}
          id={recipe.id}
          img={recipe.image}
          name={recipe.title}
          type={recipe.dishTypes.join(", ")}
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
