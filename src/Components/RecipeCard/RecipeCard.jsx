import React from "react";
import { NavLink } from "react-router-dom";

import "./recipeCard.css";

function RecipeCard({ name, img, id, type, letter, from, children }) {
  return (
    <div className="recipeCard">
      <div className="recipeName">{name}</div>
      <img src={img} alt={name} />

      <div className="detail">
        <span className="label">Type: </span>
        <span>&nbsp;{type}</span>
      </div>

      <div className="cardBtns">
        <NavLink to={`/Recipies/${letter}/${from}/${id}`}>
          <button>More detail</button>
        </NavLink>
      </div>
      <div className="recipeCardChildren">{children}</div>
    </div>
  );
}

export default RecipeCard;
