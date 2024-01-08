import { useState } from "react";

export const useAuthentication = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [authToken, setAuthToken] = useState(null);

  const login = async (email, password) => {
    try {
      const response = await fetch("http://localhost:8080/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: email, password: password }),
      });

      console.log(response);
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        const authToken = response.headers.get("x-auth-token");
        console.log("authToken " + authToken);

        setUser(data.roles);
        setAuthToken(authToken);
      } else if (response.status === 401) {
        console.log(response);
        setError(
          new Error("Unauthorized access. Please check your credentials.")
        );
        console.log(error);
      } else {
        setError(new Error("Something went wrong"));
      }
    } catch (error) {
      setError(error);
    }
  };

  const logOut = () => {
    setUser(null);
    setAuthToken(null);
    setError(null);
  };

  return { user, error, authToken, login, logOut };
};
