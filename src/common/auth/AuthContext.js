import React, { createContext } from "react";
import { useAuthentication } from "./useAuthentication";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { user, error, authToken, login, logOut } = useAuthentication();

  return (
    <AuthContext.Provider value={{ user, error, authToken, login, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};
