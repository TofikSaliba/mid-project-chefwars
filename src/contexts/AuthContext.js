import React, { useState, useContext, useEffect } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  getAdditionalUserInfo,
} from "firebase/auth";
import { auth } from "../services/firebase";

import { db } from "../services/firebase";
import { getDoc, setDoc, doc } from "firebase/firestore";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const useSpinner = () => {
  const { isSpinning, setIsSpinning } = useContext(AuthContext);
  return { isSpinning, setIsSpinning };
};

export const useHamburgerMenu = () => {
  const { hamburgerMenu, setHamburgerMenu } = useContext(AuthContext);
  return { hamburgerMenu, setHamburgerMenu };
};

export const useDropProfile = () => {
  const { dropProfile, setDropProfile } = useContext(AuthContext);
  return { dropProfile, setDropProfile };
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserInfo, setCurrentUserInfo] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [hamburgerMenu, setHamburgerMenu] = useState(false);
  const [dropProfile, setDropProfile] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        checkUserExists(user);
      } else {
        setCurrentUser(null);
      }
    });

    return unsubscribe;
  }, []);

  const checkUserExists = async (user) => {
    try {
      const userRef = doc(db, "users", user.uid);
      const recipeData = await getDoc(userRef);
      if (recipeData.exists()) {
        setCurrentUser(recipeData.data());
      } else {
        const userObj = {
          id: user.uid,
          displayName: user.displayName,
          email: user.email,
          img: user.photoURL,
          points: 50,
        };
        await setDoc(userRef, userObj);
        setCurrentUser(userObj);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setIsSpinning(true);
      const provider = new GoogleAuthProvider();
      const user = await signInWithPopup(auth, provider);
      setCurrentUserInfo(getAdditionalUserInfo(user));
    } catch (err) {
      console.log(err.message);
    } finally {
      setTimeout(() => {
        setIsSpinning(false);
      }, 1000);
    }
  };

  const signOutGoogle = async () => {
    try {
      await signOut(auth);
      setCurrentUserInfo(null);
    } catch (err) {
      console.log(err.message);
    }
  };

  const value = {
    currentUser,
    setCurrentUser,
    currentUserInfo,
    signInWithGoogle,
    signOutGoogle,
    isSpinning,
    setIsSpinning,
    hamburgerMenu,
    setHamburgerMenu,
    dropProfile,
    setDropProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
