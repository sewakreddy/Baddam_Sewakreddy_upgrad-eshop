export const doLogin = async (email, password) =>
  new Promise(async (resolve, reject) => {
    const response = await fetch("http://localhost:8080/api/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: email, password: password }),
    });
    if (response.ok) {
      const data = response;
      const authToken = response.headers.get("x-auth-token");
      resolve({
        email: data.email,
        id: data.id,
        role: data.roles,
        authToken: authToken,
      });
    } else if (response.status === 401) {
      reject(new Error("Unauthorized access. Please check your credentials."));
    } else {
      reject(new Error("Something went wrong"));
    }
    // .then((response) => {
    //   console.log(response);
    //   if (response.ok) {
    //     const data = response;
    //     const authToken = response.headers.get("x-auth-token");
    //     resolve({
    //       email: data.email,
    //       id: data.id,
    //       role: data.roles,
    //       authToken: authToken,
    //     });
    //   } else if (response.status === 401) {
    //     reject(
    //       new Error("Unauthorized access. Please check your credentials.")
    //     );
    //   } else {
    //     reject(new Error("Something went wrong"));
    //   }
    // })
    // .catch((error) => {
    //   console.error(error);
    // });
  });
