import React from "react";
import { NavLink } from "react-router-dom";

import "./recipeCard.css";

function RecipeCard({ name, img, navLink, type, children }) {
  return (
    <div className="recipeCard">
      <NavLink className="recipeCardLink" to={navLink}>
        <img src={img} alt={name} />
        <div className="recipeName">{name}</div>

        <div className="detail">
          <span className="label">Type: </span>
          <span>&nbsp;{type}</span>
        </div>
      </NavLink>
      <div className="recipeCardChildren">{children}</div>
    </div>
  );
}

export default RecipeCard;
