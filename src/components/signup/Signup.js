import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useState, useEffect } from "react";
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
} from "@mui/material";
import Alert from "@mui/material/Alert";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userRequest, setUserRequest] = useState(null);
  const [signUpResponse, setSignUpResponse] = useState(null);
  const [error, setError] = useState(null);

  const lockIconStyle = {
    backgroundColor: "pink",
    borderRadius: "80%",
    padding: "8px",
  };

  const signUpUser = (e) => {
    e.preventDefault();
    let user = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      contactNumber: contact,
    };
    setUserRequest(user);
  };

  useEffect(() => {
    const handlePostRequest = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userRequest),
        });

        const data = await response.json();
        setSignUpResponse(data);
      } catch (error) {
        setError(error);
        console.error("Error:", error);
      }
    };

    if (userRequest) {
      handlePostRequest();
    }
  }, [userRequest]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
          height: "45%",
        }}
      >
        <Stack sx={{ width: "50%" }} spacing={2}>
          <IconButton>
            <LockOutlinedIcon style={lockIconStyle} />
          </IconButton>
          <Typography variant="h5">Sign Up</Typography>
          <FormControl>
            <Box
              sx={{ flexGrow: 1 }}
              component="form"
              marginBottom="10px"
              marginTop="15px"
            >
              <TextField
                required
                id="firstName"
                label="First Name"
                variant="outlined"
                type="text"
                fullWidth
                autoFocus={false}
                value={firstName}
                style={{ marginBottom: "10px" }}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <TextField
                required
                id="lastName"
                label="Last Name"
                variant="outlined"
                type="text"
                fullWidth
                autoFocus={false}
                value={lastName}
                style={{ marginBottom: "10px" }}
                onChange={(e) => setLastName(e.target.value)}
              />
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
                style={{ marginBottom: "10px" }}
                onChange={(e) => setPassword(e.target.value)}
              />
              <TextField
                required
                id="confirmPassword"
                label="Confirm Password"
                variant="outlined"
                type="password"
                fullWidth
                autoFocus={false}
                value={confirmPassword}
                style={{ marginBottom: "10px" }}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <TextField
                required
                id="contact"
                label="Contact Number"
                variant="outlined"
                type="number"
                fullWidth
                autoFocus={false}
                value={contact}
                style={{ marginBottom: "20px" }}
                onChange={(e) => setContact(e.target.value)}
              />
              <Button variant="contained" fullWidth onClick={signUpUser}>
                SIGN UP
              </Button>
            </Box>
          </FormControl>
          {signUpResponse ? (
            <Alert severity="success">{signUpResponse.message}</Alert>
          ) : null}
          {error ? <Alert severity="error">{error}</Alert> : null}
          <Link sx={{ alignItems: "left" }}>
            Already have an account? Sign In
          </Link>
        </Stack>
      </Box>
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

export default Signup;
