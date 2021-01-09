import React, { useContext, useState, useEffect } from "react";
import { auth } from "../database/firebase";

const AuthContext = React.createContext();

/**
 * Hook
 */
export function useAuth() {
  return useContext(AuthContext);
}

/**
 * AuthProvider
 * @param {*} param0
 */
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  /**
   * Let users sign up (new user)
   * @param {*} email
   * @param {*} password
   */
  function signup(email, password) {
    return auth.createUserWithEmailAndPassword(email, password);
  }

  /**
   * Login
   */
  function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password);
  }

  /**
   * Logout
   */
  function logout() {
    return auth.signOut();
  }

  /**
   * Send an email with reset link
   * @param {} email
   */
  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email);
  }

  /**
   * Update Email
   * @param {*} email
   */
  function updateEmail(email) {
    return currentUser.updateEmail(email);
  }

  /**
   * Password reset
   * @param {*} password
   */
  function updatePassword(password) {
    return currentUser.updatePassword(password);
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    signup,
    logout,
    resetPassword,
    updateEmail,
    updatePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
