import { useEffect, useState } from "react";
import { useSpinner, useAuth } from "../../contexts/AuthContext";
import { db } from "../../services/firebase";
import { getDoc, setDoc, doc, updateDoc, arrayUnion } from "firebase/firestore";

import "./profile.css";

function Profile({ match }) {
  const [user, setUser] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const { currentUser } = useAuth();
  const { setIsSpinning } = useSpinner();

  useEffect(() => {
    const getData = async () => {
      try {
        setIsSpinning(true);
        const userRef = doc(db, "users", match.params.id);
        const userData = await getDoc(userRef);
        if (userData.exists()) {
          setUser(userData.data());
        } else {
          setNotFound(true);
        }
      } catch (err) {
        console.log(err.message);
      } finally {
        setIsSpinning(false);
      }
    };
    getData();
  }, []);

  const getUserJSX = () => {
    if (!user) return;
    return (
      <div className="UserInfo">
        <h2>{user.displayName}</h2>
        <img src={user.img} alt={user.displayName} />
        {currentUser.location && <div>Location: {currentUser.location}</div>}
        {currentUser.age && <div>Age: {currentUser.age}</div>}
        {currentUser.bio && <p>Bio: {currentUser.bio}</p>}
      </div>
    );
  };

  if (notFound) return <div>User Not Found!</div>;

  return <div className="profileContainer">{getUserJSX()}</div>;
}

export default Profile;
