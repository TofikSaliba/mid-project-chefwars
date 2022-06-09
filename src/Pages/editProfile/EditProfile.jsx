import React from "react";
import { useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import { useAuth } from "../../contexts/AuthContext";

import "./editProfile.css";
import { Redirect } from "react-router-dom";

function EditProfile() {
  const [newName, setNewName] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [from, setFrom] = useState("");
  const [age, setAge] = useState("");
  const [userBio, setUserBio] = useState("");
  const [redirect, setRedicrect] = useState(false);
  const { currentUser, setCurrentUser, isSpinning, setIsSpinning } = useAuth();

  useEffect(() => {
    window.scrollTo({
      top: 0,
    });
    setNewName(currentUser.displayName);
    setImageURL(currentUser.img);
    if (currentUser.from) {
      setFrom(currentUser.from);
    }
    if (currentUser.age) {
      setAge(currentUser.age);
    }
    if (currentUser.bio) {
      setUserBio(currentUser.bio);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSpinning(true);
    const edits = {
      displayName: newName,
      img: imageURL,
      from: from,
      age: age,
      bio: userBio,
    };
    try {
      const userRef = doc(db, "users", currentUser.id);
      await updateDoc(userRef, edits);
      setCurrentUser((prev) => ({ ...prev, ...edits }));
      setRedicrect(true);
    } catch (err) {
      console.log(err.message);
    } finally {
      setIsSpinning(false);
    }
  };

  if (isSpinning) return;

  if (redirect) {
    return <Redirect to={`/Profile/${currentUser.id}`} />;
  }

  return (
    <div className="editContainer">
      <form onSubmit={handleSubmit} className="formContainer">
        <h2>Edit Profile Info</h2>
        <input
          onChange={(e) => setNewName(e.target.value)}
          value={newName}
          type="text"
          placeholder="Edit Name..."
          required
        />
        <input
          onChange={(e) => setImageURL(e.target.value)}
          value={imageURL}
          type="URL"
          placeholder="Edit Image URL"
          required
        />
        <input
          onChange={(e) => setFrom(e.target.value)}
          value={from}
          type="text"
          placeholder="where are you from?"
        />
        <input
          onChange={(e) => setAge(e.target.value)}
          value={age}
          type="number"
          placeholder="Age..."
        />
        <textarea
          onChange={(e) => setUserBio(e.target.value)}
          value={userBio}
          name="bio"
          id="bio"
          placeholder="Your bio here..."
        />
        <button type="submit">Save</button>
      </form>
    </div>
  );
}

export default EditProfile;
