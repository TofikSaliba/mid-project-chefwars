import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth, useSpinner } from "../../contexts/AuthContext";
import API from "../../api/API";
import { db } from "../../services/firebase";
import { getDoc, setDoc, doc, updateDoc, arrayUnion } from "firebase/firestore";
import * as Fa from "react-icons/fa";

import "./recipePage.css";

function RecipePage({ match }) {
  const [recipe, setRecipe] = useState({});
  const [notFound, setNotFound] = useState(false);
  const [commentArea, setCommentArea] = useState("");
  const [comments, setComments] = useState([]);
  const [commentsSpinner, setCommentsSpinner] = useState(false);
  const [votes, setVotes] = useState({});
  const [voteThumbs, setVoteThumbs] = useState([false, false]);
  const [userPoints, setUserPoints] = useState(null);
  const { currentUser } = useAuth();
  const { isSpinning, setIsSpinning } = useSpinner();

  useEffect(() => {
    const getData = async () => {
      try {
        setIsSpinning(true);
        if (match.params.from === "web") {
          const {
            data: { meals },
          } = await API.get(`/lookup.php?i=${match.params.recipeId}`);
          setTheRecipeInfo(meals[0]);
        } else {
          const userRecipeRef = doc(db, "usersRecipies", match.params.recipeId);
          const recipeData = await getDoc(userRecipeRef);
          if (recipeData.exists()) {
            setRecipe(recipeData.data());
          } else {
            setNotFound(true);
          }
        }
      } catch (err) {
        setNotFound(true);
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
            getUserPoints();
            getCurrentUserVote(recipeData.data().voting);
          } else {
            setRecipeComments();
          }
        } catch (err) {
          console.log(err.message);
        }
      };
      getData();
    }
  }, [recipe, currentUser]);

  const getUserPoints = async () => {
    if (recipe.userID) {
      const userRef = doc(db, "users", recipe.userID);
      const userData = await getDoc(userRef);
      if (userData.exists()) {
        setUserPoints(userData.data().points);
      } else {
        throw new Error("User ID Not Found!");
      }
    }
  };

  const getCurrentUserVote = (votes) => {
    if (!currentUser) return;
    const userVote = votes.voters.find((vote) => {
      return vote.user === currentUser.id;
    });
    if (userVote) {
      const arr = userVote.voteIs ? [false, true] : [true, false];
      setVoteThumbs(arr);
    }
  };

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
            <NavLink to={`/Profile/${comment.userId}`}>
              <span>{comment.userName}</span>
            </NavLink>
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

  const vote = async (key) => {
    const recipeInterRef = doc(db, "recipieInteracts", recipe.id);
    const recipeData = await getDoc(recipeInterRef);
    const fetchedVotes = recipeData.data().voting;

    if ((key === "bad" && voteThumbs[0]) || (key === "good" && voteThumbs[1])) {
      cancelVote(key, fetchedVotes, recipeInterRef);
    } else if (
      (key === "bad" && voteThumbs[1]) ||
      (key === "good" && voteThumbs[0])
    ) {
      switchVote(key, fetchedVotes, recipeInterRef);
    } else {
      createNewVote(key, fetchedVotes, recipeInterRef);
    }
  };

  const cancelVote = async (key, fetchedVotes, recipeInterRef) => {
    try {
      const newVoters = fetchedVotes.voters.filter((userVote) => {
        return userVote.user !== currentUser.id;
      });
      const newVote = {
        ...fetchedVotes,
        [key]: fetchedVotes[key] - 1,
        voters: newVoters,
      };

      await updateDoc(recipeInterRef, { voting: newVote });
      setVotes(newVote);
      setVoteThumbs([false, false]);
      if (userPoints !== null) {
        const newPoints = key === "bad" ? userPoints + 5 : userPoints - 10;
        await updateDoc(doc(db, "users", recipe.userID), { points: newPoints });
        setUserPoints(newPoints);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const switchVote = async (key, fetchedVotes, recipeInterRef) => {
    try {
      let keys, newVoteBool;
      if (key === "bad") {
        keys = ["bad", "good"];
        newVoteBool = false;
      } else {
        keys = ["good", "bad"];
        newVoteBool = true;
      }
      const newVoters = fetchedVotes.voters.map((userVote) => {
        if (userVote.user === currentUser.id) {
          userVote.voteIs = newVoteBool;
        }
        return userVote;
      });

      const newVote = {
        [keys[0]]: fetchedVotes[keys[0]] + 1,
        [keys[1]]: fetchedVotes[keys[1]] - 1,
        voters: newVoters,
      };
      await updateDoc(recipeInterRef, { voting: newVote });
      setVotes(newVote);
      setVoteThumbs([!newVoteBool, newVoteBool]);

      if (userPoints !== null) {
        const newPoints = key === "bad" ? userPoints - 15 : userPoints + 15;
        await updateDoc(doc(db, "users", recipe.userID), { points: newPoints });
        setUserPoints(newPoints);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const createNewVote = async (key, fetchedVotes, recipeInterRef) => {
    try {
      const newVoters = [...fetchedVotes.voters];
      const vote = key === "bad" ? false : true;
      newVoters.push({ user: currentUser.id, voteIs: vote });
      const newVote = {
        ...fetchedVotes,
        [key]: fetchedVotes[key] + 1,
        voters: newVoters,
      };

      await updateDoc(recipeInterRef, { voting: newVote });
      setVotes(newVote);
      setVoteThumbs([!vote, vote]);
      if (userPoints !== null) {
        const newPoints = key === "bad" ? userPoints - 5 : userPoints + 10;
        await updateDoc(doc(db, "users", recipe.userID), { points: newPoints });
        setUserPoints(newPoints);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleTextArea = ({ target }) => {
    if (target.value.length > 300) return;
    setCommentArea(target.value);
  };

  if (notFound) return <div>Recipe Not Found!</div>;

  return (
    <>
      {!isSpinning && (
        <>
          <div className="recipeContainer">
            <div className="rightContainer">
              <div className="stickyRight">
                <div>Vote to help others find whats good!</div>
                <div className="thumbsCont">
                  <div className="innerThumbBad">
                    {votes.bad}
                    {currentUser && (
                      <div className="voteDownDiv" onClick={() => vote("bad")}>
                        {voteThumbs[0] ? (
                          <Fa.FaThumbsDown className="voteDown" />
                        ) : (
                          <Fa.FaRegThumbsDown className="voteDown" />
                        )}
                      </div>
                    )}
                  </div>
                  <div className="innerThumbGood">
                    {votes.good}
                    {currentUser && (
                      <div className="voteUpDiv" onClick={() => vote("good")}>
                        {" "}
                        {voteThumbs[1] ? (
                          <Fa.FaThumbsUp className="voteUp" />
                        ) : (
                          <Fa.FaRegThumbsUp className="voteUp" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
                {!currentUser && (
                  <div>
                    Must <NavLink to="/Login">login</NavLink> to vote
                  </div>
                )}
              </div>
            </div>
            <div className="leftContainer">{getRecipeMainData()}</div>
            <div className="midContainer">
              {getVidJSX()}
              <h2>Instructions</h2>
              <p className="instructions">{recipe.instructions}</p>
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
