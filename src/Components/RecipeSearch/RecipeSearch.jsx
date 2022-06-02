import React from "react";
import { useState } from "react";
import { useSpinner } from "../../contexts/AuthContext";
import API from "../../api/API";

import "./recipeSearch.css";

function RecipeSearch({ setFetchedRecipies }) {
  const [term, setTerm] = useState("");
  const { setIsSpinning, isSpinning } = useSpinner();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSpinning || !term) return;
    try {
      setIsSpinning(true);
      const { data } = await API.get(
        `?query=${term}&addRecipeInformation=true&number=20`
      );
      setFetchedRecipies({
        results: data.results,
        term: term,
        total: data.totalResults,
        offset: data.offset,
      });
    } catch (err) {
      console.log(err.message);
    } finally {
      setTerm("");
      setIsSpinning(false);
    }
  };

  return (
    <div className="searchBar">
      <form onSubmit={handleSubmit}>
        <input value={term} onChange={(e) => setTerm(e.target.value)} />
        <button type="submit">Search</button>
      </form>
    </div>
  );
}

export default RecipeSearch;
