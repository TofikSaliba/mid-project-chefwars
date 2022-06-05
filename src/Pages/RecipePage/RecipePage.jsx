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
  const [commentsSpinner, setCommentsSpinner] = useState(false);
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
          height="50%"
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
        <div key={comment.id} className="singleComment">
          <div className="leftComment">
            <span>{comment.userName}</span>{" "}
            <img src={comment.userImg} alt={comment.userName} />
          </div>
          <div className="rightComment">
            <span className="time">{comment.time}</span>
            <p>{comment.content}</p>
            {currentUser && comment.userId === currentUser.id && (
              <div className="deleteBtn">
                <button onClick={() => deleteComment(comment.id)}>
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      );
    });
  };

  const deleteComment = async (id) => {
    const recipeInterRef = doc(db, "recipieInteracts", recipe.id);
    const recipeData = await getDoc(recipeInterRef);
    const newComments = [...recipeData.data().comments].filter((comment) => {
      return comment.id !== id;
    });
    await updateDoc(recipeInterRef, {
      comments: newComments,
    });
    setComments(newComments.reverse());
  };

  const addComment = async () => {
    if (!commentArea) return;
    setCommentsSpinner(true);
    try {
      const recipeInterRef = doc(db, "recipieInteracts", recipe.id);
      const newComment = {
        content: commentArea,
        userId: currentUser.id,
        userImg: currentUser.img,
        userName: currentUser.displayName,
        time: new Date().toLocaleString(),
        id: (Math.random() * 999999999) | 0,
      };
      await updateDoc(recipeInterRef, {
        comments: arrayUnion(newComment),
      });
      const recipeData = await getDoc(recipeInterRef);
      setComments(recipeData.data().comments.reverse());
    } catch (err) {
      console.log(err.message);
    } finally {
      setCommentsSpinner(false);
    }
    setCommentArea("");
  };

  const vote = async (key, vote) => {
    if (cantVote || checkPerssion()) return;
    const recipeInterRef = doc(db, "recipieInteracts", recipe.id);
    const recipeData = await getDoc(recipeInterRef);
    const fetchedVotes = recipeData.data().voting;
    const newVoters = [...fetchedVotes.voters];
    newVoters.push({ user: currentUser.id, voteIs: vote });
    const newVote = {
      ...fetchedVotes,
      [key]: fetchedVotes[key] + 1,
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

  const handleTextArea = ({ target }) => {
    if (target.value.length > 300) return;
    setCommentArea(target.value);
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
                  <div className="innerThumbBad">
                    {votes.bad}
                    {currentUser && (
                      <span
                        onClick={() => vote("bad", false)}
                        className="voteDown"
                      >
                        &#128078;
                      </span>
                    )}
                  </div>
                  <div className="innerThumbGood">
                    {votes.good}
                    {currentUser && (
                      <span
                        onClick={() => vote("good", true)}
                        className="voteUp"
                      >
                        &#128077;
                      </span>
                    )}
                  </div>
                </div>
                {!currentUser && (
                  <div>
                    Must <NavLink to="/Login">login</NavLink> to vote
                  </div>
                )}
                {cantVote && (
                  <div className="alreadyVoted">
                    You already voted for this recipe!
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="comments">
            <h2>Comments Section</h2>
            {!currentUser && (
              <div className="loginMsg">
                <NavLink to="/Login">Login</NavLink> to be able to comment
              </div>
            )}
            {currentUser && (
              <>
                <textarea
                  onChange={handleTextArea}
                  value={commentArea}
                  name="comment"
                  id="sendComment"
                />
                <button
                  onClick={() => addComment()}
                  type="submit"
                  disabled={commentsSpinner}
                >
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
