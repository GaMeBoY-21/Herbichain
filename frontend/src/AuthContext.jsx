// src/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "./firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
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

  // Signup with email/password and role
  const signup = async (email, password, role) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const user = cred.user;

    // Save role in Firestore
    await setDoc(doc(db, "users", user.uid), {
      email,
      role,
      createdAt: serverTimestamp(),
    });

    setCurrentUser(user);
    setRole(role);
  };

  // Login
  const login = async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const user = cred.user;

    // Fetch role from Firestore
    const snap = await getDoc(doc(db, "users", user.uid));
    if (snap.exists()) {
      setRole(snap.data().role || null);
    } else {
      setRole(null);
    }

    setCurrentUser(user);
  };

  const resetPassword = (email) => sendPasswordResetEmail(auth, email);

  const logout = () => signOut(auth);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user || null);

      if (user) {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          setRole(snap.data().role || null);
        } else {
          setRole(null);
        }
      } else {
        setRole(null);
      }

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
      {!loading ? children : <div style={{ padding: 20 }}>Loading...</div>}
    </AuthContext.Provider>
  );
}
