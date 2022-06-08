import React from "react";
import { useEffect, useState } from "react";
import { MdOutlineAddCircle } from "react-icons/md";
import { MdRemoveCircleOutline } from "react-icons/md";
import { db } from "../../services/firebase";
import { getDoc, setDoc, doc } from "firebase/firestore";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

import "./addRecipe.css";
import { Redirect } from "react-router-dom";

const leftInputsData = [
  { name: "name", type: "text", holder: "Recipe Name", required: true },
  { name: "img", type: "URL", holder: "Recipe Image", required: true },
  { name: "category", type: "text", holder: "Category", required: true },
  { name: "area", type: "text", holder: "Origin  (optional)", required: false },
  { name: "video", type: "URL", holder: "Video  (optional)", required: false },
];

function AddRecipe({ match }) {
  const [leftInput, setLeftInput] = useState({
    name: "",
    img: "",
    category: "",
    area: "",
    video: "",
  });
  const [instructions, setInstructions] = useState("");
  const [ingredients, setIngredients] = useState([
    { name: "", measure: "" },
    { name: "", measure: "" },
  ]);
  const [done, setDone] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const { currentUser, setIsSpinning } = useAuth();

  const handleInputs = (value, key) => {
    const updatedLeft = { ...leftInput, [key]: value };
    setLeftInput(updatedLeft);
  };

  useEffect(() => {
    if (match.params.editing) {
      const getData = async () => {
        try {
          setIsSpinning(true);
          const recipeRef = doc(db, "usersRecipies", match.params.editing);
          const userData = await getDoc(recipeRef);
          if (userData.exists()) {
            const recipe = userData.data();
            setLeftInput({
              name: recipe.name,
              img: recipe.img,
              category: recipe.category,
              area: recipe.area,
              video: recipe.video,
            });
            setInstructions(recipe.instructions);
            setIngredients(recipe.ingredients);
          } else {
            setNotFound(true);
          }
        } catch (err) {
          console.log(err.message);
        } finally {
          setIsSpinning(false);
        }
      };
      getData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getLeftInputs = () => {
    return leftInputsData.map(({ name, type, holder, required }, idx) => {
      return (
        <input
          key={idx}
          onChange={(e) => handleInputs(e.target.value, name)}
          value={leftInput[name]}
          type={type}
          placeholder={holder}
          required={required}
        />
      );
    });
  };

  const handleInputsRight = (value, key, idx) => {
    const newIngredients = [...ingredients];
    newIngredients[idx][key] = value;
    setIngredients(newIngredients);
  };

  const removeInput = (idx) => {
    if (ingredients.length === 2) return;
    const removed = [...ingredients];
    removed.splice(idx, 1);
    setIngredients(removed);
  };

  const addInput = () => {
    if (ingredients.length > 14) return;
    const added = [...ingredients, { name: "", measure: "" }];
    setIngredients(added);
  };

  const getRightInputs = () => {
    return ingredients.map((ingr, idx) => {
      return (
        <div className="ingInput" key={idx}>
          <input
            onChange={(e) => handleInputsRight(e.target.value, "name", idx)}
            value={ingr.name}
            type="text"
            placeholder="Ingredient"
            required
          />
          <input
            onChange={(e) => handleInputsRight(e.target.value, "measure", idx)}
            value={ingr.measure}
            type="text"
            placeholder="Measure"
            required
          />
          <span onClick={() => removeInput(idx)} className="addRemove">
            <MdRemoveCircleOutline />
          </span>
          <span onClick={() => addInput()} className="addRemove">
            <MdOutlineAddCircle />
          </span>
        </div>
      );
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const params = match.params.editing;
    const recipeId = params
      ? params
      : ((Math.random() * 99999999 + 90000) | 0).toString();
    const recipeObj = {
      ...leftInput,
      instructions: instructions,
      ingredients: ingredients,
      userID: currentUser.id,
      id: recipeId,
    };
    try {
      await setDoc(doc(db, "usersRecipies", recipeObj.id), recipeObj);
      setDone(true);
    } catch (err) {
      console.log(err.message);
    }
  };

  if (notFound)
    return (
      <div> Error - the recipe you are tring to edit does not exist !</div>
    );

  if (done) return <Redirect to={`/Profile/${currentUser.id}`} />;

  return (
    <div className="addRecipeContainer">
      <h1>{match.params.editing ? "Edit" : "Add"} Recipe</h1>
      <form onSubmit={handleSubmit}>
        <div className="formUpper">
          <div className="addLeft">
            {getLeftInputs()}
            <h2>Instructions</h2>
            <textarea
              onChange={(e) => setInstructions(e.target.value)}
              value={instructions}
              name="instructions"
              id="instructions"
              placeholder="Instructions..."
              required
            />
          </div>
          <div className="addRight">
            <h2>Ingredients</h2>
            {getRightInputs()}
          </div>
        </div>
        <div className="formBtns">
          <NavLink to={`/Profile/${currentUser.id}`}>
            <button type="button">Cancel</button>
          </NavLink>
          <button type="submit">{match.params.editing ? "Save" : "Add"}</button>
        </div>
      </form>
    </div>
  );
}

export default AddRecipe;
