import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import * as React from "react";
import { useState, useContext, useEffect, useRef } from "react";
import {
  Box,
  IconButton,
  Stack,
  Typography,
  TextField,
  Button,
  Link,
  Paper,
  FormControl,
  Container,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../common/auth/AuthContext";
import Snackbar from "@mui/material/Snackbar";
import Alert from "../../common/Alert";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loginRequest, setLoginRequest] = useState({});
  const [formErrors, setFormErrors] = useState({});

  //To align the login errors as snackbars
  const [snackPosition, setSnackPosition] = useState({
    open: false,
    vertical: "top",
    horizontal: "right",
  });

  const { vertical, horizontal, open } = snackPosition;

  //To check if component is rendered for first time
  const isFirstRender = useRef(true);

  const navigate = useNavigate();

  //To set the login info in AuthContext so that all other components can use the login info
  const { setLoginInfo } = useContext(AuthContext);

  const lockIconStyle = {
    backgroundColor: "pink",
    borderRadius: "80%",
    padding: "8px",
  };

  //To handle when SIGN IN button is clicked and form is submitted
  const handleSubmit = (event) => {
    event.preventDefault();
    setFormErrors(null);

    //To check form validation errors
    let validationErrors = {};
    if (email === "") {
      validationErrors.email = "Email is required";
    }
    if (password === "") {
      validationErrors.password = "Password is required";
    }
    setFormErrors(validationErrors);

    //To set the LoginRequest object only when there are zero form validation errors
    if (Object.keys(validationErrors).length === 0) {
      setLoginRequest({ username: email, password: password });
    }
  };

  //To handle closing of snackbar by setting the open prop to false and setting back errors to null
  const handleClose = (reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackPosition({ ...snackPosition, open: false });
    setError(null);
  };

  //this effect is invoked whenever new loginRequest object is built
  useEffect(() => {
    const login = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/auth/signin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginRequest),
        });

        if (response.ok) {
          const data = await response.json();
          const authToken = response.headers.get("x-auth-token");
          setLoginInfo({
            role: data.roles[0],
            token: authToken,
            error: null,
          });

          //on successful response navigating to home
          navigate("/home");
        } else if (response.status === 401) {
          setSnackPosition({ ...snackPosition, open: true });
          const e = "Unauthorized access. Please check your credentials.";
          setError(e);
          setLoginInfo({ role: null, token: null, error: e });
        } else {
          const e = "Something went wrong! Please try later.";
          setError(e);
          setLoginInfo({ role: null, token: null, error: e });
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (!isFirstRender.current) {
      login();
    } else {
      isFirstRender.current = false;
    }
  }, [loginRequest]);

  return (
    <>
      <Container
        sx={{
          p: 2,
          marginTop: 20,
          maxWidth: 500,
          display: "flex",
          justifyContent: { xs: "center", md: "space-around" },
          alignContent: { xs: "center", md: "space-around" },
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <Stack sx={{ width: "50%" }} spacing={2}>
          <IconButton>
            <LockOutlinedIcon style={lockIconStyle} />
          </IconButton>
          <Typography variant="h5">Sign In</Typography>
          <FormControl>
            <Box
              sx={{ flexGrow: 1 }}
              component="form"
              marginBottom="10px"
              marginTop="15px"
            >
              <TextField
                required
                id="email"
                label="Email address"
                variant="outlined"
                type="text"
                fullWidth
                autoFocus={false}
                value={email}
                style={{ marginBottom: "10px" }}
                helperText={formErrors.email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                required
                id="password"
                label="Password"
                variant="outlined"
                type="password"
                fullWidth
                autoFocus={false}
                value={password}
                helperText={formErrors.password}
                style={{ marginTop: "10px", marginBottom: "20px" }}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button variant="contained" fullWidth onClick={handleSubmit}>
                SIGN IN
              </Button>
            </Box>
          </FormControl>

          <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
            <Link
              component="button"
              onClick={() => {
                navigate("/signUp");
              }}
            >
              <Typography variant="body1">
                Don't have an account? Sign Up
              </Typography>
            </Link>
          </Box>
        </Stack>
      </Container>

      {error ? (
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
          key={vertical + horizontal}
        >
          <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
            {error}
          </Alert>
        </Snackbar>
      ) : null}
      <Box display="flex" flexDirection="column" minHeight="10vh">
        <Paper elevation={0} style={{ padding: "16px", marginTop: "auto" }}>
          <Typography variant="body2" color="textSecondary" align="center">
            &copy; Upgrad 2024
          </Typography>
        </Paper>
      </Box>
    </>
  );
};

export default Login;
