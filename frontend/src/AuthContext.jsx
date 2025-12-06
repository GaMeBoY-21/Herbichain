// src/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "./firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";

import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ensure login stays across refresh (default Firebase behavior)
  useEffect(() => {
    setPersistence(auth, browserLocalPersistence);
  }, []);

  // Signup with role
  const signup = async (email, password, userRole) => {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCred.user;

    await setDoc(doc(db, "users", user.uid), {
      email,
      role: userRole,
      createdAt: serverTimestamp(),
    });

    setCurrentUser(user);
    setRole(userRole);
  };

  // Login
  const login = async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);

    const snap = await getDoc(doc(db, "users", cred.user.uid));
    if (snap.exists()) {
      setRole(snap.data().role);
    }

    setCurrentUser(cred.user);
  };

  const resetPassword = (email) => sendPasswordResetEmail(auth, email);
  const logout = () => signOut(auth);

  // Listen for authentication changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setCurrentUser(null);
        setRole(null);
        setLoading(false);
        return;
      }

      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) setRole(snap.data().role);

      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    role,
    signup,
    login,
    logout,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : <div className="muted">Loading...</div>}
    </AuthContext.Provider>
  );
}
