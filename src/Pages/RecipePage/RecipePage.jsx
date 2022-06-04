import { useEffect, useState } from "react";
import { useSpinner } from "../../contexts/AuthContext";
import API from "../../api/API";

import "./recipePage.css";

function RecipePage({ match }) {
  const [recipe, setRecipe] = useState({});
  const { isSpinning, setIsSpinning } = useSpinner();

  useEffect(() => {
    const getData = async () => {
      try {
        setIsSpinning(true);
        const {
          data: { meals },
        } = await API.get(`/lookup.php?i=${match.params.id}`);
        setTheRecipeInfo(meals[0]);
      } catch (err) {
        console.log(err.message);
      } finally {
        setIsSpinning(false);
      }
    };
    getData();
  }, []);

  const setTheRecipeInfo = (meals) => {
    setRecipe({
      id: meals.idMeal,
      name: meals.strMeal,
      area: meals.strArea,
      category: meals.strCategory,
      img: meals.strMealThumb,
      video: meals.strYoutube,
      ingredients: getIngredients(meals),
      instructions: meals.strInstructions.replace(/[\r][\n]/gi, ""),
    });
  };

  const getIngredients = (recipe) => {
    let i = 1;
    const resultArr = [];
    while (true) {
      if (recipe[`strIngredient${i}`]) {
        resultArr.push({
          name: recipe[`strIngredient${i}`],
          measure: recipe[`strMeasure${i}`],
        });
      } else {
        break;
      }
      i++;
    }
    return resultArr;
  };

  useEffect(() => {
    console.log(recipe);
  }, [recipe]);

  const getRecipeMainData = () => {
    return (
      <>
        <h2>{recipe.name}</h2>
        <img src={recipe.img} alt="sdf" />
        <div>{`${recipe.area}, ${recipe.category}`}</div>
        <h2>Ingredients</h2>
        {recipe.ingredients &&
          recipe.ingredients.map((ing) => {
            return (
              <div
                key={ing.name + ing.measure}
                className="ingredients"
              >{`${ing.name}: ${ing.measure}`}</div>
            );
          })}
      </>
    );
  };

  const getVidJSX = () => {
    return (
      <>
        <iframe
          width="80%"
          height="40%"
          title={recipe.name}
          src={recipe.video && recipe.video.replace("watch?v=", "embed/")}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </>
    );
  };

  return (
    <>
      {!isSpinning && (
        <div className="recipeContainer">
          <div className="leftContainer">{getRecipeMainData()}</div>
          <div className="midContainer">
            {getVidJSX()}
            <h2>Instructions</h2>
            <p className="instructions">{recipe.instructions}</p>
          </div>
          <div className="rightContainer">
            <img src={recipe.img} alt="sdf" />
          </div>
        </div>
      )}
    </>
  );
}

export default RecipePage;
