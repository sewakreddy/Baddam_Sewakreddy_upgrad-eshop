import "./App.css";
import React, { useContext, useState } from "react";
import Home from "./components/home/Home";
import Login from "./components/login/Login";
import SignUp from "./components/signup/Signup";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import { ShoppingCart } from "@mui/icons-material";
import { Button, Container } from "@mui/material";
import { red } from "@mui/material/colors";
import Stack from "@mui/material/Stack";
import { Routes, Route, Link } from "react-router-dom";
import useAuthentication from "./common/auth/useAuthentication";
import ProductDetail from "./components/product-detail/ProductDetail";
import AddProduct from "./components/products/AddProduct";
import { useNavigate } from "react-router-dom";
import ModifyProduct from "./components/products/ModifyProduct";

function App() {
  const { AuthCtx } = useAuthentication();
  const { user, logOut } = useContext(AuthCtx);

  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const redirectToLogin = () => {
    navigate("/login");
  };

  const handleSearchChange = (event) => {
    console.log(event.target.value);
    setSearchQuery(event.target.value);

    console.log(searchQuery);
  };

  const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(40),
      width: "auto",
    },
  }));

  const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }));

  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    "& .MuiInputBase-input": {
      padding: theme.spacing(1, 1, 1, 0),
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("md")]: {
        width: "40ch",
      },
    },
  }));

  const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(red[500]),
    backgroundColor: red[500],
    "&:hover": {
      backgroundColor: red[700],
    },
  }));

  return (
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
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
                onChange={handleSearchChange}
                value={searchQuery}
              />
            </Search>
            <Box sx={{ flexGrow: 1 }} />
            {user ? (
              <>
                <Box sx={{ m: 2 }}>
                  <Link
                    to={{
                      pathname: "/home",
                      state: searchQuery,
                    }}
                    style={{ color: "white", fontSize: "16px" }}
                    component="button"
                  >
                    Home
                  </Link>
                </Box>
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
                <Link to="/login">Login</Link>
                <Link to="/signup">Sign Up</Link>
              </Stack>
            )}
          </Toolbar>
        </AppBar>
      </Box>
      <Container sx={{ height: "200vh" }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/productDetail" element={<ProductDetail />} />
          <Route path="/addProduct" element={<AddProduct />} />
          <Route path="/modifyProduct" element={<ModifyProduct />} />
        </Routes>
      </Container>
    </div>
  );
}

export default App;
