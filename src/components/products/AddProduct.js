import { useState, useEffect, useContext } from "react";
import CreatableSelect from "react-select/creatable";
import {
  Box,
  Stack,
  Typography,
  TextField,
  Button,
  Paper,
  FormControl,
  Container,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../common/auth/AuthContext";

const AddProduct = () => {
  const [name, setName] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [availableItems, setAvailableItems] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addProductRequest, setAddProductRequest] = useState(null);
  const [addProductResponse, setAddProductResponse] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const { loginInfo } = useContext(AuthContext);

  const authToken = loginInfo.token;

  //to create a new category in categories dropdown
  const createOption = (label) => ({
    label,
    value: label.toLowerCase().replace(/\W/g, ""),
  });

  //to handle when ADD PRODUCT button is clicked.
  const buildProductRequest = (e) => {
    e.preventDefault();

    setFormErrors(null);

    //To check form validation errors
    let validationErrors = {};
    if (name === "") {
      validationErrors.name = "Name is required";
    }

    if (category === "") {
      validationErrors.category = "Category is required";
    }

    if (availableItems === "") {
      validationErrors.availableItems = "Available Items are required";
    }

    if (manufacturer === "") {
      validationErrors.manufacturer = "Manufacturer is required";
    }

    if (price === "") {
      validationErrors.price = "Price is required";
    }
    setFormErrors(validationErrors);

    //To set the addProductRequest object only when there are zero form validation errors
    if (Object.keys(validationErrors).length === 0) {
      setAddProductRequest({
        name: name,
        category: category.label,
        price: price,
        description: description,
        manufacturer: manufacturer,
        availableItems: availableItems,
        imageUrl: imageUrl,
      });
    }
  };

  //this effect is invoked every time addProductRequest object is built
  useEffect(() => {
    const addProduct = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": authToken,
          },
          body: JSON.stringify(addProductRequest),
        });

        if (response.ok) {
          const s = `Product ${name} added successfully`;
          setAddProductResponse(s);
        } else {
          setError("Error: Something went wrong. Try again!");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    if (addProductRequest) {
      addProduct();
    }
  }, [addProductRequest]);

  //to fetch the categories when component mounts for first time for dropdown
  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/products/categories"
        );
        if (!response.ok) {
          setCategories([]);
        }
        const result = await response.json();

        if (result && result.length > 0) {
          setCategories(result.map((category) => createOption(category)));
        }
        // Since we are getting list of categories asynchronously from backend, intially isLoading is set to true.
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    getCategories();
  }, []);

  //Once the product is added or failed, navigating user back to home
  useEffect(() => {
    if (addProductResponse) {
      navigate("/home", { state: addProductResponse });
    }

    if (error) {
      navigate("/home", { state: error });
    }
  }, [addProductResponse, error, navigate]);

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
          <Typography variant="h5">Add Product</Typography>
          <FormControl>
            <Box
              sx={{ flexGrow: 1 }}
              component="form"
              marginBottom="10px"
              marginTop="15px"
            >
              <TextField
                required
                id="name"
                label="Name"
                variant="outlined"
                type="text"
                fullWidth
                autoFocus={false}
                value={name}
                helperText={formErrors.name}
                style={{ marginBottom: "10px" }}
                inputProps={{ maxLength: 35 }}
                onChange={(e) => setName(e.target.value)}
              />
              <Box sx={{ paddingBottom: 1 }}>
                <CreatableSelect
                  isClearable
                  placeholder="Select a Category.."
                  isLoading={isLoading}
                  options={categories}
                  value={category}
                  allowCreateWhileLoading={true}
                  onChange={(newValue) => setCategory(newValue)}
                />
              </Box>
              <TextField
                required
                id="manufacturer"
                label="Manufacturer"
                variant="outlined"
                type="text"
                fullWidth
                autoFocus={false}
                value={manufacturer}
                helperText={formErrors.manufacturer}
                style={{ marginBottom: "10px" }}
                onChange={(e) => setManufacturer(e.target.value)}
              />
              <TextField
                required
                id="availableItems"
                label="Available Items"
                variant="outlined"
                type="number"
                fullWidth
                autoFocus={false}
                value={availableItems}
                helperText={formErrors.availableItems}
                style={{ marginBottom: "10px" }}
                onChange={(e) => setAvailableItems(e.target.value)}
              />
              <TextField
                required
                id="price"
                label="Price"
                variant="outlined"
                type="number"
                fullWidth
                autoFocus={false}
                value={price}
                helperText={formErrors.price}
                style={{ marginBottom: "10px" }}
                onChange={(e) => setPrice(e.target.value)}
              />
              <TextField
                id="imageUrl"
                label="Image Url"
                variant="outlined"
                type="text"
                fullWidth
                autoFocus={false}
                value={imageUrl}
                style={{ marginBottom: "10px" }}
                onChange={(e) => setImageUrl(e.target.value)}
              />
              <TextField
                id="description"
                label="Description"
                variant="outlined"
                type="text"
                fullWidth
                autoFocus={false}
                value={description}
                style={{ marginBottom: "20px" }}
                onChange={(e) => setDescription(e.target.value)}
              />
              <Button
                variant="contained"
                fullWidth
                onClick={buildProductRequest}
              >
                SAVE PRODUCT
              </Button>
            </Box>
          </FormControl>
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

export default AddProduct;
