import React, { useState, useContext, useEffect } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  getAdditionalUserInfo,
} from "firebase/auth";
import { auth } from "../services/firebase";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserInfo, setCurrentUserInfo] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const user = await signInWithPopup(auth, provider);
      setCurrentUserInfo(getAdditionalUserInfo(user));
    } catch (err) {
      console.log(err.message);
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
    currentUserInfo,
    signInWithGoogle,
    signOutGoogle,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
