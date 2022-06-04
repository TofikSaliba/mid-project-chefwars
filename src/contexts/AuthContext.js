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

export const useSpinner = () => {
  const { isSpinning, setIsSpinning } = useContext(AuthContext);
  return { isSpinning, setIsSpinning };
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserInfo, setCurrentUserInfo] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser({
          id: user.uid,
          displayName: user.displayName,
          email: user.email,
          img: user.photoURL,
        });
      } else {
        setCurrentUser(null);
      }
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
    isSpinning,
    setIsSpinning,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
