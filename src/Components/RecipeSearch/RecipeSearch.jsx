import React, { useState } from "react";
import { useSpinner } from "../../contexts/AuthContext";
import Select from "../Select/Select";
import { db } from "../../services/firebase";
import { getDocs, collection } from "firebase/firestore";
import API from "../../api/API";

import "./recipeSearch.css";

function RecipeSearch({
  setFetchedRecipies,
  setUserRecipies,
  history,
  defaultSelect,
  searchRadio,
  setGroupToShow,
}) {
  const [selected, setSelected] = useState(defaultSelect);
  const [selectedToShow, setSelectedToShow] = useState("all");
  const [prevLetter, setPrevLetter] = useState("a");
  const [prevGroup, setPrevGroup] = useState("all");
  const { setIsSpinning, isSpinning } = useSpinner();
  const [searchType, setSearchType] = useState(searchRadio);
  const [term, setTerm] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      isSpinning ||
      (searchType && !term) ||
      (!searchType && selected === prevLetter && selectedToShow === prevGroup)
    )
      return;
    const search = searchType ? "s" : "f";
    const theTerm = searchType ? term : selected;
    setPrevLetter(selected);
    setPrevGroup(selectedToShow);
    try {
      setIsSpinning(true);
      if (selectedToShow === "all") {
        await getAPIRecipies(search, theTerm);
        await getUsersRecipies(search, theTerm.toLowerCase());
      } else if (selectedToShow === "web") {
        await getAPIRecipies(search, theTerm);
      } else {
        await getUsersRecipies(search, theTerm.toLowerCase());
      }
      setGroupToShow(selectedToShow);
      history.push(theTerm);
    } catch (err) {
      console.log(err.message);
    } finally {
      setTerm("");
      setIsSpinning(false);
    }
  };

  const getAPIRecipies = async (search, theTerm) => {
    try {
      const { data } = await API.get(`/search.php?${search}=${theTerm}`);
      setFetchedRecipies({
        results: data.meals ?? [],
        letter: theTerm,
      });
      if (selectedToShow === "web") {
        setUserRecipies({ results: [] });
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const getUsersRecipies = async (search, theTerm) => {
    try {
      const data = await getDocs(collection(db, "usersRecipies"));
      const userRecipies = [];
      data.forEach((doc) => {
        if (search === "s" && doc.data().name.toLowerCase().includes(theTerm)) {
          userRecipies.push(doc.data());
        } else if (
          search === "f" &&
          doc.data().name.toLowerCase().startsWith(theTerm)
        ) {
          userRecipies.push(doc.data());
        }
      });
      setUserRecipies({
        results: userRecipies,
        letter: theTerm,
      });
      if (selectedToShow === "user") {
        setFetchedRecipies({ results: [] });
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className="searchBar">
      <div className="radio">
        <span>Search by: </span>
        <div className="radioWraper">
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
      </div>
      <form onSubmit={handleSubmit}>
        <input
          onChange={(e) => setTerm(e.target.value)}
          value={term}
          type="text"
          disabled={!searchType}
          placeholder="Search Term..."
        />
        <Select
          id={"letterSelect"}
          onSelectChange={setSelected}
          optionsArr={"abcdefghijklmnopqrstuvwxyz".split("")}
          defaultVal={selected}
          disabled={searchType}
        />
        <Select
          id={"recipesToShow"}
          onSelectChange={setSelectedToShow}
          optionsArr={["all", "web recipies only", "user recipies only"]}
          defaultVal={selectedToShow}
          disabled={false}
        />
        <button type="submit" disabled={isSpinning}>
          Fetch
        </button>
      </form>
    </div>
  );
}

export default RecipeSearch;
