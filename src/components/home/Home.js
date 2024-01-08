import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useLocation } from "react-router-dom";
import Product from "../products/Product";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [deleteProdError, setDeleteProdError] = useState(null);
  const [deleteProductResponse, setDeleteProductResponse] = useState(null);
  const [modifyProductResponse, setModifyProductResponse] = useState(null);
  const [sortMode, setSortMode] = useState("");
  const [snackPosition, setSnackPosition] = useState({
    open: false,
    vertical: "top",
    horizontal: "right",
  });
  const { vertical, horizontal, open } = snackPosition;

  const authToken =
    "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0M0B1cGdyYWQuY29tIiwiaWF0IjoxNzA0Njc3OTYyLCJleHAiOjE3MDQ2ODYzNjJ9.OfDhtrF9uPuzC4wwDr6qhRsIQoYayfxNE_Ts21RelNaj14Xv7RXUu1jre742U7yMybp9g4R08H2k-J8G4E-6_A";

  const location = useLocation();
  const searchQuery = location.state;
  console.log(searchQuery);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackPosition({ ...snackPosition, open: false });
    setDeleteProductResponse(null);
    // setModifyProductResponse(null);
  };

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const sortProducts = () => {
    setProducts(
      products.slice().sort((a, b) => {
        if (sortMode === "priceHighToLow") {
          return a.price - b.price;
        } else if (sortMode === "priceLowToHigh") {
          return b.price - a.price;
        } else if (sortMode === "default") {
          return 0;
        }
      })
    );
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/products/categories"
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      setCategories(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/products");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      setProducts(result);
      setModifyProductResponse(location.state);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const deleteProduct = async (product) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/products/${product.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": authToken,
          },
        }
      );
      if (response.status === 204) {
        setDeleteProductResponse(
          `Product ${product.name} deleted successfully`
        );
      }
      if (!response.ok) {
        setDeleteProdError("Error: Something went wrong");
      }
      fetchProducts();
    } catch (error) {
      setDeleteProdError(error);
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [modifyProductResponse]);

  useEffect(() => {
    fetchCategories();
  }, [products]);

  useEffect(() => {
    setFilteredProducts(
      selectedCategory !== "all"
        ? products.filter(
            (product) => product.category.toLowerCase() === selectedCategory
          )
        : products
    );
  }, [selectedCategory, products, categories]);

  useEffect(() => {
    const filtered = searchQuery
      ? products.filter((product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : products;
    setFilteredProducts(filtered);
  }, [products, searchQuery]);

  useEffect(() => {
    if (deleteProductResponse) {
      setSnackPosition({ ...snackPosition, open: true });
    }
  }, [deleteProductResponse]);

  useEffect(() => {
    if (modifyProductResponse) {
      setSnackPosition({ ...snackPosition, open: true });
    }
  }, [modifyProductResponse]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-evenly",
          alignItems: "center",
          height: "10%",
        }}
      >
        <ToggleButtonGroup
          color="primary"
          exclusive
          aria-label="Platform"
          value={selectedCategory}
          onChange={(event, newCategory) => {
            setSelectedCategory(newCategory);
          }}
        >
          <ToggleButton value="all">ALL</ToggleButton>
          {categories &&
            categories.map((c, i) => (
              <ToggleButton value={c.toLowerCase()} key={c.toLowerCase()}>
                {c.toUpperCase()}
              </ToggleButton>
            ))}
        </ToggleButtonGroup>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={2}>
          <FormControl sx={{ width: 180 }}>
            <InputLabel id="sort-by-label" placeholder="Select...">
              Sort By
            </InputLabel>
            <Select
              labelId="sort-select"
              id="sort-id"
              label="Sort By"
              value={sortMode}
              onChange={(event) => {
                setSortMode(event.target.value);
                sortProducts();
              }}
            >
              <MenuItem value="default">Default</MenuItem>
              <MenuItem value="priceHighToLow">Price: High to Low</MenuItem>
              <MenuItem value="priceLowToHigh">Price: Low to High</MenuItem>
              <MenuItem value="newest">Newest</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          height: "75%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: { xs: "center", md: "space-around" },
            alignContent: { xs: "center", md: "space-around" },
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {filteredProducts &&
            filteredProducts.map((product) => (
              <Product
                key={product.id}
                product={product}
                deleteFunction={deleteProduct}
              />
            ))}
        </Box>
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
            {deleteProductResponse}
            {modifyProductResponse}
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
};

export default Home;
