import axios from "axios";

// const KEY = "8773019a149c4baa9613ba27b13a12d1";

// export default axios.create({
//   baseURL: "https://api.spoonacular.com/recipes/complexSearch",
//   headers: {
//     "Content-Type": "application/json",
//   },
//   params: {
//     apiKey: KEY,
//   },
// });

export default axios.create({
  baseURL: "https://www.themealdb.com/api/json/v1/1",
  headers: {
    "Content-Type": "application/json",
  },
});
