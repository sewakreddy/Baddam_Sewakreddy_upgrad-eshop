import React, { useState, createContext } from "react";
import { doLogin } from "../api/index";

const AuthCtx = createContext();

const useAuthentication = (history, location) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const login = (email, password) =>
    doLogin(email, password)
      .then((response) => {
        setUser(response);
        setError(null);
        console.log(response);
      })
      .catch((error) => {
        setError(error);
        console.log(error);
      });

  const logOut = () => {
    setUser(null);
    setError(null);
  };
  return {
    AuthCtx,
    AuthProvider: ({ children }) => (
      <AuthCtx.Provider value={{ error, user, login, logOut }}>
        {children}
      </AuthCtx.Provider>
    ),
  };
};

export default useAuthentication;
