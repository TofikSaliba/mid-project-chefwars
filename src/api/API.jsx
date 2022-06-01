import axios from "axios";

const KEY = "7c5e0a114d684c049ef0b11aaaa382a6";

export default axios.create({
  baseURL: "https://api.spoonacular.com/recipes/complexSearch",
  headers: {
    "Content-Type": "application/json",
  },
  params: {
    apiKey: KEY,
  },
});
