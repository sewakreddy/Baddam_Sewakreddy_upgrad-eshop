import React, { useState, useEffect, useContext } from "react";
import { Box, Stack } from "@mui/material";
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
import Alert from "../../common/Alert";
import { AuthContext } from "../../common/auth/AuthContext";
import { SearchContext } from "../../common/search/SearchContext";

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [deleteProdError, setDeleteProdError] = useState(null);
  const [sortMode, setSortMode] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  //To align the messages as snackbars
  const [snackPosition, setSnackPosition] = useState({
    open: false,
    vertical: "top",
    horizontal: "right",
  });
  const { vertical, horizontal, open } = snackPosition;

  //To handle closing of snackbar by setting the open prop to false
  const handleClose = (reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackPosition({ ...snackPosition, open: false });
    setSuccessMessage("");
  };
  const location = useLocation();

  //To get authtoken from loginInfo of AuthContext
  const { loginInfo } = useContext(AuthContext);
  const authToken = loginInfo.token;

  //To get the search query from SearchContext
  const { searchQuery } = useContext(SearchContext);

  //method to get categories from backend.
  const fetchCategories = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/products/categories"
      );
      if (response.ok) {
        const result = await response.json();
        setCategories(result);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  //method to get products from backend.
  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/products");
      if (response.ok) {
        const result = await response.json();
        setProducts(result);
        const s = location.state;
        setSuccessMessage(s);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  //method to delete a product using product Id
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
        let s = `Product ${product.name} deleted successfully`;
        setSuccessMessage(s);
      }
      if (!response.ok) {
        setDeleteProdError("Error: Something went wrong");
      }
      // to update products after a product is deleted.
      fetchProducts();
    } catch (error) {
      setDeleteProdError(error);
      console.error("Error:", error);
    }
  };

  //function to sort the products
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

  //To render products when the component is mounted for first time.
  useEffect(() => {
    fetchProducts();
  }, []);

  //To render categoires everytime when the products is created/modified/deleted
  useEffect(() => {
    fetchCategories();
  }, [products]);

  //To filter products based on selected category
  useEffect(() => {
    setFilteredProducts(
      selectedCategory !== "all"
        ? products.filter(
            (product) => product.category.toLowerCase() === selectedCategory
          )
        : products
    );
  }, [selectedCategory, products, categories]);

  //To show the success or error messages on snack bar whenever the success message state is updated.
  useEffect(() => {
    if (successMessage) {
      setSnackPosition({ ...snackPosition, open: true });
    }
  }, [successMessage]);

  //to sort the products whenever the sortMode changes
  useEffect(() => {
    sortProducts();
  }, [sortMode]);

  //to invoke useEffect and search in the products
  useEffect(() => {
    const filtered = searchQuery
      ? products.filter((product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : products;
    setFilteredProducts(filtered);
  }, [searchQuery]);

  return (
    <>
      <Box
        sx={{
          marginTop: 5,
          p: 5,
        }}
      >
        <Stack spacing={4}>
          {/* Category section*/}
          <Box>
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
          {/* Sort the products section */}
          <Grid container>
            <Grid item xs={4}>
              <FormControl sx={{ width: 180 }}>
                <InputLabel id="sort-by-label" placeholder="Select...">
                  Sort By
                </InputLabel>
                <Select
                  labelId="sort-select"
                  id="sort-id"
                  label="Sort By"
                  value={sortMode}
                  onChange={(e) => {
                    const c = e.target.value;
                    setSortMode(c);
                  }}
                >
                  <MenuItem value="default">Default</MenuItem>
                  <MenuItem value="priceLowToHigh">Price: High to Low</MenuItem>
                  <MenuItem value="priceHighToLow">Price: Low to High</MenuItem>
                  <MenuItem value="newest">Newest</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          {/*List of products section*/}
          <Grid container>
            <Grid item xs={2}></Grid>
            <Grid item xs={8}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: { xs: "center", md: "space-around" },
                    alignContent: { xs: "center", md: "space-around" },
                    alignItems: "center",
                    flexWrap: "wrap",
                    height: "100%",
                    p: 4,
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
              </Box>
            </Grid>
            <Grid item xs={2}></Grid>
          </Grid>

          {/*To return the success message snack bar */}
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
              {successMessage}
            </Alert>
          </Snackbar>
        </Stack>
      </Box>
    </>
  );
};

export default Home;
