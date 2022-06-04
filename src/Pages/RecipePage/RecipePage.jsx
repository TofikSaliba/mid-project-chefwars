import { useEffect, useState } from "react";
import { useSpinner } from "../../contexts/AuthContext";
import API from "../../api/API";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../services/firebase";
import { getDoc, setDoc, doc, updateDoc, arrayUnion } from "firebase/firestore";

import "./recipePage.css";
import { NavLink } from "react-router-dom";

function RecipePage({ match }) {
  const [recipe, setRecipe] = useState({});
  const [commentArea, setCommentArea] = useState("");
  const [comments, setComments] = useState([]);
  const [votes, setVotes] = useState({});
  const [cantVote, setCantVote] = useState(false);
  const { currentUser } = useAuth();
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

  useEffect(() => {
    if (recipe.name) {
      const getData = async () => {
        try {
          const recipeInterRef = doc(db, "recipieInteracts", recipe.id);
          const recipeData = await getDoc(recipeInterRef);
          if (recipeData.exists()) {
            setComments(recipeData.data().comments.reverse());
            setVotes(recipeData.data().voting);
          } else {
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
      setVotes({ good: 0, bad: 0, voters: [] });
    } catch (err) {
      console.log(err.message);
    }
  };

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

  const getCommentsJSX = () => {
    return comments.map((comment) => {
      return (
        <div key={comment.userId + comment.content} className="singleComment">
          <div className="leftComment">
            <span>{comment.userName}</span>{" "}
            <img src={comment.userImg} alt={comment.userName} />
          </div>
          <div className="rightComment">
            <span className="time">{comment.time}</span>
            <p>{comment.content}</p>
          </div>
        </div>
      );
    });
  };

  const addComment = async () => {
    if (!commentArea) return;
    try {
      const recipeInterRef = doc(db, "recipieInteracts", recipe.id);
      const newComment = {
        content: commentArea,
        userId: currentUser.id,
        userImg: currentUser.img,
        userName: currentUser.displayName,
        time: new Date().toLocaleString(),
      };
      await updateDoc(recipeInterRef, {
        comments: arrayUnion(newComment),
      });
      setComments((prev) => {
        const old = [...prev];
        old.unshift(newComment);
        return old;
      });
    } catch (err) {
      console.log(err.message);
    }
    setCommentArea("");
  };

  const vote = async (key, vote) => {
    if (checkPerssion()) return;
    const recipeInterRef = doc(db, "recipieInteracts", recipe.id);
    const newVoters = [...votes.voters];
    newVoters.push({ user: currentUser.id, voteIs: vote });
    const newVote = {
      ...votes,
      [key]: votes[key] + 1,
      voters: newVoters,
    };
    await updateDoc(recipeInterRef, { voting: newVote });
    setVotes(newVote);
  };

  const checkPerssion = () => {
    const userVote = votes.voters.find((vote) => {
      return vote.user === currentUser.id;
    });
    if (!userVote) {
      return false;
    }
    setCantVote(true);
    setTimeout(() => {
      setCantVote(false);
    }, 2500);
    return true;
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
              <div className="stickyRight">
                <div>Vote to help others find whats good!</div>
                <div className="thumbsCont">
                  <div className="innerThumb">
                    {votes.bad}
                    <span
                      onClick={() => vote("bad", false)}
                      className="voteDown"
                    >
                      &#128078;
                    </span>
                  </div>
                  <div className="innerThumb">
                    {votes.good}
                    <span onClick={() => vote("good", true)} className="voteUp">
                      &#128077;
                    </span>
                  </div>
                </div>
                {cantVote && (
                  <div className="alreadyVoted">
                    You already voted for this recipe!
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="comments">
            <h2>Comment Section</h2>
            {!currentUser && (
              <div className="loginMsg">
                <NavLink to="/Login">Login</NavLink> to be able to comment
              </div>
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
