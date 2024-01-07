import { useState, useEffect } from "react";
import CreatableSelect from "react-select/creatable";
import {
  Box,
  Stack,
  Typography,
  TextField,
  Button,
  Paper,
  FormControl,
} from "@mui/material";
import Alert from "@mui/material/Alert";

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
  const [error, setError] = useState(null);

  const authToken =
    "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0M0B1cGdyYWQuY29tIiwiaWF0IjoxNzA0NjM4MTY1LCJleHAiOjE3MDQ2NDY1NjV9.qNaOES5BZSrK2zdBL1LLLde_N_gWunkdy80qJEmA6XolCc3F2Eypou6WGX_SqTH8Qi_B857XTYlXjQtO3B3XxA";
  const createOption = (label) => ({
    label,
    value: label.toLowerCase().replace(/\W/g, ""),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/products/categories"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();

        if (result && result.length > 0) {
          setCategories(result.map((category) => createOption(category)));
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const buildProductRequest = (e) => {
    e.preventDefault();
    let addProductRequest = {
      name: name,
      category: category.label,
      price: price,
      description: description,
      manufacturer: manufacturer,
      availableItems: availableItems,
      imageUrl: imageUrl,
    };
    setAddProductRequest(addProductRequest);
  };

  useEffect(() => {
    const handlePostRequest = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": authToken,
          },
          body: JSON.stringify(addProductRequest),
        });

        const data = await response.json();
        setAddProductResponse(data);
      } catch (error) {
        setError(error);
        console.error("Error:", error);
      }
    };

    if (addProductRequest) {
      handlePostRequest();
    }
  }, [addProductRequest]);

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
                style={{ marginBottom: "10px" }}
                onChange={(e) => setName(e.target.value)}
              />
              <CreatableSelect
                isClearable
                placeholder="Select a Category.."
                isLoading={isLoading}
                options={categories}
                value={category}
                allowCreateWhileLoading={true}
                onChange={(newValue) => setCategory(newValue)}
              />
              <TextField
                required
                id="manufacturer"
                label="Manufacturer"
                variant="outlined"
                type="text"
                fullWidth
                autoFocus={false}
                value={manufacturer}
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
          {addProductResponse ? (
            <Alert severity="success">
              Product {addProductResponse.name} added successfully
            </Alert>
          ) : null}
          {error ? <Alert severity="error">{error}</Alert> : null}
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

export default AddProduct;
