import "./App.css";
import React, { useContext } from "react";
import Home from "./components/home/Home";
import Login from "./components/login/Login";
import SignUp from "./components/signup/Signup";
import { styled } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { ShoppingCart } from "@mui/icons-material";
import { Button, ThemeProvider, createTheme } from "@mui/material";
import { red } from "@mui/material/colors";
import Stack from "@mui/material/Stack";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import ProductDetail from "./components/product-detail/ProductDetail";
import AddProduct from "./components/products/AddProduct";
import ModifyProduct from "./components/products/ModifyProduct";
import { AuthContext } from "./common/auth/AuthContext";
import Address from "./components/address/Address";
import SearchBar from "./components/search/SearchBar";
import { SearchProvider } from "./common/search/SearchContext";

const theme = createTheme({
  palette: {
    primary: {
      main: "#3f51b5",
    },
  },
});

function App() {
  const { loginInfo, logOut } = useContext(AuthContext);
  const role = loginInfo.role;
  const navigate = useNavigate();

  const redirectToLogin = () => {
    navigate("/login");
  };

  const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(red[500]),
    backgroundColor: red[500],
    "&:hover": {
      backgroundColor: red[700],
    },
  }));

  return (
    <ThemeProvider theme={theme}>
      <SearchProvider>
        <div className="App">
          <Box sx={{ flexGrow: 1 }}>
            <AppBar position="fixed">
              <Toolbar>
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="open drawer"
                  sx={{ mr: 2 }}
                >
                  <ShoppingCart />
                </IconButton>
                <Typography
                  variant="h6"
                  noWrap
                  component="div"
                  sx={{ display: { xs: "none", sm: "block" } }}
                >
                  upGrad E-Shop
                </Typography>
                <Box sx={{ flexGrow: 1 }} />
                <SearchBar />
                <Box sx={{ flexGrow: 1 }} />
                {role ? (
                  <>
                    <Box sx={{ m: 2 }}>
                      <Link
                        to={{
                          pathname: "/home",
                        }}
                        style={{ color: "white", fontSize: "16px" }}
                        component="button"
                      >
                        Home
                      </Link>
                    </Box>
                    {role === "ADMIN" ? (
                      <Box sx={{ m: 2 }}>
                        <Link
                          to="/addProduct"
                          style={{ color: "white", fontSize: "16px" }}
                          component="button"
                          underline="always"
                        >
                          Add Product
                        </Link>
                      </Box>
                    ) : null}
                    <Box sx={{ m: 1 }}>
                      <ColorButton
                        variant="contained"
                        onClick={() => {
                          logOut();
                          redirectToLogin();
                        }}
                      >
                        LOGOUT
                      </ColorButton>
                    </Box>
                  </>
                ) : (
                  <Stack direction="row" spacing={4} padding={1}>
                    <Link
                      to="/login"
                      style={{ color: "white", fontSize: "16px" }}
                      component="button"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      style={{ color: "white", fontSize: "16px" }}
                      component="button"
                    >
                      Sign Up
                    </Link>
                  </Stack>
                )}
              </Toolbar>
            </AppBar>
          </Box>
          <Box>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/home" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/productDetail" element={<ProductDetail />} />
              <Route path="/addProduct" element={<AddProduct />} />
              <Route path="/modifyProduct" element={<ModifyProduct />} />
              <Route path="/address" element={<Address />} />
            </Routes>
          </Box>
        </div>
      </SearchProvider>
    </ThemeProvider>
  );
}

export default App;
