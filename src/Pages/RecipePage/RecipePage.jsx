import { useEffect, useState } from "react";
import { useSpinner } from "../../contexts/AuthContext";
import API from "../../api/API";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../services/firebase";
import {
  getDoc,
  collection,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";

import "./recipePage.css";

function RecipePage({ match }) {
  const [recipe, setRecipe] = useState({});
  const [commentArea, setCommentArea] = useState("");
  const { currentUser } = useAuth();
  const { isSpinning, setIsSpinning } = useSpinner();
  const [comments, setComments] = useState([]);

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
      instructions: meals.strInstructions.replace(/[\n]/gi, "\n\n"),
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
        <div className="ingredients">
          {recipe.ingredients &&
            recipe.ingredients.map((ing) => {
              return (
                <div key={ing.name + ing.measure} className="ingredient">
                  {`${ing.name}: `}
                  <span>{ing.measure}</span>
                </div>
              );
            })}
        </div>
      </>
    );
  };

  const getVidJSX = () => {
    return (
      <>
        <iframe
          width="80%"
          height="100%"
          title={recipe.name}
          src={recipe.video && recipe.video.replace("watch?v=", "embed/")}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </>
    );
  };

  useEffect(() => {
    if (recipe.name) {
      const getData = async () => {
        try {
          const recipeInterRef = doc(db, "recipieInteracts", recipe.id);
          const recipeData = await getDoc(recipeInterRef);
          if (recipeData.exists()) {
            setComments(recipeData.data().comments);
          } else {
            console.log("noComments");
            setRecipeComments();
          }
        } catch (err) {
          console.log(err.message);
        }
      };
      getData();
    }
  }, [recipe]);

  const setRecipeComments = async () => {
    try {
      await setDoc(doc(db, "recipieInteracts", recipe.id), {
        comments: [],
        voting: { good: 0, bad: 0, voters: [] },
      });
    } catch (err) {
      console.log(err.message);
    }
  };

  const getCommentsJSX = () => {
    return comments.map((comment) => {
      return (
        <div key={comment.user}>
          <div>{comment.user}</div>
          <div>{comment.content}</div>
        </div>
      );
    });
  };

  const addComment = () => {
    console.log(commentArea);
    setCommentArea("");
  };

  return (
    <>
      {!isSpinning && (
        <>
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
          <div className="comments">
            <h2>Comment Section</h2>
            {!currentUser && (
              <div className="loginMsg">Login to be able to comment</div>
            )}
            {currentUser && (
              <>
                <textarea
                  onChange={(e) => setCommentArea(e.target.value)}
                  value={commentArea}
                  name="comment"
                  id="sendComment"
                />
                <button onClick={() => addComment()} type="submit">
                  Comment!
                </button>
              </>
            )}
            {getCommentsJSX()}
          </div>
        </>
      )}
    </>
  );
}

export default RecipePage;
