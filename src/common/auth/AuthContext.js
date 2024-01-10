import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loginInfo, setLoginInfo] = useState({});

  const logOut = () => {
    setLoginInfo({ role: null, token: null, error: null });
  };

  return (
    <AuthContext.Provider value={{ loginInfo, setLoginInfo, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};
