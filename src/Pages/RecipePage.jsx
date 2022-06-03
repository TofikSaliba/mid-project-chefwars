import { useEffect, useState } from "react";
import { useSpinner } from "../contexts/AuthContext";
import API from "../api/API";

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
        console.log(meals[0]);
        setRecipe({
          id: meals[0].idMeal,
          name: meals[0].strMeal,
          area: meals[0].strArea,
          category: meals[0].strCategory,
          img: meals[0].strMealThumb,
          video: meals[0].strYoutube,
          ingredients: getIngredients(meals[0]),
          instructions: meals[0].strInstructions.replace(/[\r][\n]/gi, ""),
        });
      } catch (err) {
        console.log(err.message);
      } finally {
        setIsSpinning(false);
      }
    };
    getData();
  }, []);

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

  return <div>{!isSpinning && <img src={recipe.img} alt="sdf" />}</div>;
}

export default RecipePage;
