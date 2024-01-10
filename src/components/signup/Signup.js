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
  Container,
} from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import { useNavigate } from "react-router-dom";
import Alert from "../../common/Alert";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userRequest, setUserRequest] = useState(null);
  const [signUpResponse, setSignUpResponse] = useState("");
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const navigate = useNavigate();

  //To align the login errors as snackbars
  const [snackPosition, setSnackPosition] = useState({
    open: false,
    vertical: "top",
    horizontal: "right",
  });

  const { vertical, horizontal, open } = snackPosition;

  //To handle closing of snackbar by setting the open prop to false and setting back errors to null
  const handleClose = (reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackPosition({ ...snackPosition, open: false });
    setError("");
    setSignUpResponse("");
  };

  const lockIconStyle = {
    backgroundColor: "pink",
    borderRadius: "80%",
    padding: "8px",
  };

  //To handle when SIGN UP button is clicked and form is submitted
  const handleSubmit = (e) => {
    e.preventDefault();
    //To check form validation errors
    let validationErrors = {};

    if (firstName === "") {
      validationErrors.firstName = "First name is required";
    }

    if (lastName === "") {
      validationErrors.lastName = "Last name is required";
    }

    if (email === "") {
      validationErrors.email = "Email is required";
    }

    //as per the backend code password must be minmum length of 6
    if (password === "") {
      validationErrors.password = "Password is required";
    } else if (password.length < 6) {
      validationErrors.password = "Password must be atleast 6 characters";
    }

    if (confirmPassword === "") {
      validationErrors.confirmPassword = "Enter Password again";
    } else if (password !== confirmPassword) {
      validationErrors.confirmPassword = "Both passwords must be same";
    }

    if (contact === "") {
      validationErrors.contact = "Contact number is required";
    }

    setFormErrors(validationErrors);

    //To set the Signup Request object only when there are zero form validation errors
    if (Object.keys(validationErrors).length === 0) {
      setUserRequest({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        contactNumber: contact,
      });
    }
  };

  //this effect is invoked whenever signup request is built
  useEffect(() => {
    const signUp = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userRequest),
        });

        if (response.ok) {
          const data = await response.json();
          setSignUpResponse(data.message);
          console.log(error);
        } else {
          //when the user is already has an account with this email, the request will be failed
          const error = await response.json();
          setError(error.message);
          console.log(error);
        }
        setSnackPosition({ ...snackPosition, open: true });
      } catch (error) {
        console.error("Error:", error);
      }
    };

    if (userRequest) {
      signUp();
    }
  }, [userRequest]);

  return (
    <>
      <Container
        sx={{
          p: 2,
          marginTop: 10,
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
                helperText={formErrors.firstName}
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
                helperText={formErrors.lastName}
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
                helperText={formErrors.email}
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
                helperText={formErrors.password}
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
                helperText={formErrors.confirmPassword}
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
                helperText={formErrors.contact}
                style={{ marginBottom: "20px" }}
                onChange={(e) => setContact(e.target.value)}
              />
              <Button variant="contained" fullWidth onClick={handleSubmit}>
                SIGN UP
              </Button>
            </Box>
          </FormControl>
          {error !== "" ? (
            <Snackbar
              anchorOrigin={{ vertical, horizontal }}
              open={open}
              autoHideDuration={6000}
              onClose={handleClose}
              key={vertical + horizontal}
            >
              <Alert
                onClose={handleClose}
                severity="error"
                sx={{ width: "100%" }}
              >
                {error}
              </Alert>
            </Snackbar>
          ) : (
            <Snackbar
              anchorOrigin={{ vertical, horizontal }}
              open={open}
              autoHideDuration={6000}
              onClose={handleClose}
              key={vertical + horizontal}
            >
              <Alert
                onClose={handleClose}
                severity="success"
                sx={{ width: "100%" }}
              >
                {signUpResponse}
              </Alert>
            </Snackbar>
          )}
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Link
              component="button"
              onClick={() => {
                navigate("/login");
              }}
            >
              <Typography variant="body1">
                Already have an account? Sign In
              </Typography>
            </Link>
          </Box>
        </Stack>
      </Container>
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
