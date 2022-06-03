import { useEffect, useState } from "react";
import RecipeCard from "../../Components/RecipeCard/RecipeCard";
import RecipeSearch from "../../Components/RecipeSearch/RecipeSearch";
import { useSpinner } from "../../contexts/AuthContext";
import API from "../../api/API";

import "./recipies.css";

function Recipies({ match, history }) {
  const [fetchedRecipies, setFetchedRecipies] = useState(null);
  const { isSpinning, setIsSpinning } = useSpinner();

  useEffect(() => {
    const searchFor = match.params.letter.length > 1 ? "s" : "f";
    const getData = async () => {
      try {
        setIsSpinning(true);
        const { data } = await API.get(
          `/search.php?${searchFor}=${match.params.letter}`
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

  // useEffect(() => {
  //   console.log(fetchedRecipies);
  // }, [fetchedRecipies]);

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
      <RecipeSearch
        setFetchedRecipies={setFetchedRecipies}
        history={history}
        defaultSelect={match.params.letter[0]}
        searchRadio={match.params.letter.length > 1}
      />
      <div className="recipiesCardContainer">{getRecipiesCards()}</div>
    </>
  );
}

export default Recipies;
