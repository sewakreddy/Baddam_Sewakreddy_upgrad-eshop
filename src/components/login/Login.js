import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useState, useContext } from "react";
import {
  Box,
  IconButton,
  Stack,
  Typography,
  TextField,
  Button,
  Link,
  Paper,
} from "@mui/material";
import Alert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../common/auth/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { error, user, authToken, login, logOut } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    await login(email, password);
    if (error === null) {
      redirectToHome();
    }
  };

  const redirectToHome = () => {
    console.log(error);
    console.log(authToken);
    console.log(user);

    if (error === null) {
      console.log("test");
      navigate("/home");
    }
  };

  const lockIconStyle = {
    backgroundColor: "pink",
    borderRadius: "80%",
    padding: "8px",
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
          height: "30%",
        }}
      >
        <Stack sx={{ width: "50%" }} spacing={2}>
          <IconButton>
            <LockOutlinedIcon style={lockIconStyle} />
          </IconButton>
          <Typography variant="h5">Sign In</Typography>
          <form>
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
                style={{ marginTop: "10px", marginBottom: "20px" }}
                onChange={(e) => setPassword(e.target.value)}
              />
              {/* redirect using useEffect() hook instead of this */}
              <Button variant="contained" fullWidth onClick={handleSubmit}>
                SIGN IN
              </Button>
            </Box>
          </form>
          {error ? <Alert severity="error">{error}</Alert> : null}
          <Link sx={{ alignItems: "left" }}>
            Don't have an account? Sign Up
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

export default Login;
