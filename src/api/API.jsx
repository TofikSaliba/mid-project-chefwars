import axios from "axios";

const KEY = "8773019a149c4baa9613ba27b13a12d1";

export default axios.create({
  baseURL: "https://api.spoonacular.com/recipes/complexSearch",
  headers: {
    "Content-Type": "application/json",
  },
  params: {
    apiKey: KEY,
  },
});

// import axios from "axios";

// const KEY = "60d6fa915213ba8e9c9b75a4910dc455";

// export default axios.create({
//   baseURL: "https://api.edamam.com/api/recipes/v2",
//   headers: {
//     "Content-Type": "application/json",
//   },
//   params: {
//     app_key: KEY,
//   },
// });
