import { useEffect, useState } from "react";
import { db } from "../services/firebase";
import {
  getDoc,
  collection,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";

function About() {
  const [recipeInter, setRecipeInter] = useState([]);
  // const recipeInterRef = collection(db, "recipieInteracts");
  const recipeInterRef = doc(db, "recipieInteracts", "1245555555");

  const getData = async () => {
    try {
      const dataSnap = await getDoc(recipeInterRef);
      if (dataSnap.exists()) {
        console.log("yess", dataSnap.data());
      } else {
        console.log("noooooss");
      }
      // const arr = data.docs.map((doc) => {
      //   return { ...doc.data(), id: doc.id };
      // });
    } catch (err) {
      console.log(err.message);
    }
  };

  const create = async () => {
    try {
      const dataSnap = await getDoc(recipeInterRef);
      const comments = dataSnap.data().comments;
      comments.unshift("wohooo");
      const data = await updateDoc(recipeInterRef, {
        comments: comments,
      });
      console.log(data);
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div>
      <button onClick={getData}>getData</button>
      <button onClick={create}>create</button>
    </div>
  );
}

export default About;
