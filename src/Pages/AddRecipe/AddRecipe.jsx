import React from "react";
import { useEffect, useState } from "react";
import { MdOutlineAddCircle } from "react-icons/md";
import { MdRemoveCircleOutline } from "react-icons/md";
import { db } from "../../services/firebase";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";
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
  const { currentUser } = useAuth();

  useEffect(() => {
    console.log(match);
  }, []);

  const handleInputs = (value, key) => {
    const updatedLeft = { ...leftInput, [key]: value };
    setLeftInput(updatedLeft);
  };

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
    const recipeObj = {
      ...leftInput,
      instructions: instructions,
      ingredients: ingredients,
      userID: currentUser.id,
      recipeID: ((Math.random() * 99999999 + 90000) | 0).toString(),
    };
    try {
      await setDoc(doc(db, "usersRecipies", recipeObj.recipeID), recipeObj);
      // const data = await getDocs(collection(db, "usersRecipies"));
      // console.log(data);
      // //! -----------------------------------
      // data.forEach((doc) => {
      //   // doc.data() is never undefined for query doc snapshots
      //   console.log(doc.id, " => ", doc.data());
      // });
      setDone(true);
    } catch (err) {
      console.log(err.message);
    }
  };

  if (done) return <Redirect to={`/Profile/${currentUser.id}`} />;

  return (
    <div className="addRecipeContainer">
      <h1>Add A Recipe</h1>
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
          <button type="submit">Add</button>
        </div>
      </form>
    </div>
  );
}

export default AddRecipe;
