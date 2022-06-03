import React, { useState, useEffect } from "react";
import { useSpinner } from "../../contexts/AuthContext";
import Select from "../Select/Select";
import API from "../../api/API";

import "./recipeSearch.css";

function RecipeSearch({
  setFetchedRecipies,
  history,
  defaultSelect,
  searchRadio,
}) {
  const [selected, setSelected] = useState(defaultSelect);
  const { setIsSpinning, isSpinning } = useSpinner();
  const [searchType, setSearchType] = useState(searchRadio);
  const [term, setTerm] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSpinning || (!selected && !term)) return;
    const search = searchType ? "s" : "f";
    const theTerm = searchType ? term : selected;
    console.log(search);
    try {
      setIsSpinning(true);
      const { data } = await API.get(`/search.php?${search}=${theTerm}`);
      setFetchedRecipies({
        results: data.meals,
        letter: theTerm,
      });
      history.push(theTerm);
    } catch (err) {
      console.log(err.message);
    } finally {
      setSelected("");
      setTerm("");
      setIsSpinning(false);
    }
  };

  return (
    <div className="searchBar">
      <div className="radio">
        <span>Search by: </span>
        <div>
          <label htmlFor="term">Term </label>
          <input
            onChange={(e) => setSearchType(true)}
            id="term"
            type="radio"
            name="type"
            defaultChecked={searchRadio}
          />
        </div>
        <div>
          <label htmlFor="first"> Recipe first letter </label>
          <input
            onChange={(e) => setSearchType(false)}
            id="first"
            type="radio"
            name="type"
            defaultChecked={!searchRadio}
          />
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          onChange={(e) => setTerm(e.target.value)}
          value={term}
          type="text"
          disabled={!searchType}
        />
        <Select
          onSelectChange={setSelected}
          optionsArr={"abcdefghijklmnopqrstuvwxyz".split("")}
          defaultVal={selected}
          disabled={searchType}
        />
        <button type="submit" disabled={isSpinning}>
          Fetch
        </button>
      </form>
    </div>
  );
}

export default RecipeSearch;
