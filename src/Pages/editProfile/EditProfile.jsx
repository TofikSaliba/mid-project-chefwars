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
  const [location, setLocation] = useState("");
  const [age, setAge] = useState("");
  const [userBio, setUserBio] = useState("");
  const [redirect, setRedicrect] = useState(false);
  const { currentUser, setCurrentUser } = useAuth();

  useEffect(() => {
    setNewName(currentUser.displayName);
    setImageURL(currentUser.img);
    if (currentUser.location) {
      setLocation(currentUser.location);
    }
    if (currentUser.age) {
      setAge(currentUser.age);
    }
    if (currentUser.bio) {
      setUserBio(currentUser.bio);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const edits = {
      displayName: newName,
      img: imageURL,
      location: location,
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
    }
  };

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
          onChange={(e) => setLocation(e.target.value)}
          value={location}
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