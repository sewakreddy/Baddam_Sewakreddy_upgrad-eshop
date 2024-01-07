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
import { useLocation, useNavigate } from "react-router-dom";

const ModifyProduct = () => {
  const location = useLocation();
  const productReceived = location.state;
  const navigate = useNavigate();

  const [id, setId] = useState(productReceived.id);
  const [name, setName] = useState(productReceived.name);
  const [manufacturer, setManufacturer] = useState(
    productReceived.manufacturer
  );
  const [availableItems, setAvailableItems] = useState(
    productReceived.availableItems
  );
  const [price, setPrice] = useState(productReceived.price);
  const [imageUrl, setImageUrl] = useState(productReceived.imageUrl);
  const [description, setDescription] = useState(productReceived.description);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modifyProductRequest, setModifyProductRequest] = useState(null);
  const [modifyProductResponse, setModifyProductResponse] = useState("");
  const [modifyProdError, setModifyProdError] = useState(null);

  const authToken =
    "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0M0B1cGdyYWQuY29tIiwiaWF0IjoxNzA0NjM4MTY1LCJleHAiOjE3MDQ2NDY1NjV9.qNaOES5BZSrK2zdBL1LLLde_N_gWunkdy80qJEmA6XolCc3F2Eypou6WGX_SqTH8Qi_B857XTYlXjQtO3B3XxA";

  const createOption = (label) => ({
    label,
    value: label.toLowerCase().replace(/\W/g, ""),
  });

  const buildProductRequest = (e) => {
    e.preventDefault();
    let productRequest = {
      id: id,
      name: name,
      category: category.label,
      price: price,
      description: description,
      manufacturer: manufacturer,
      availableItems: availableItems,
      imageUrl: imageUrl,
    };
    setModifyProductRequest(productRequest);
  };

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/products/categories"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();

        if (result && result.length > 0) {
          setCategories(
            result.map((category) => {
              createOption(category);
              if (productReceived.category === category) {
                setCategory(createOption(category));
              }
            })
          );
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getCategories();
  }, []);

  useEffect(() => {
    const modifyProduct = async (product) => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/products/${product.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "x-auth-token": authToken,
            },
            body: JSON.stringify(modifyProductRequest),
          }
        );
        if (response.ok) {
          const s = `Product ${product.name} modified successfully`;
          console.log(s);
          setModifyProductResponse(s);
        } else {
          setModifyProdError("Error: Something went wrong. Try again!");
        }
      } catch (error) {
        setModifyProdError("Error: Something went wrong. Try again!" + error);
        console.error("Error:", error);
      }
    };
    if (modifyProductRequest) {
      modifyProduct(modifyProductRequest);
    }
  }, [modifyProductRequest]);

  useEffect(() => {
    if (modifyProductResponse) {
      navigate("/home", { state: modifyProductResponse });
    }

    if (modifyProdError) {
      navigate("/home", { state: modifyProdError });
    }
  }, [modifyProductResponse, modifyProdError]);

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
          <Typography variant="h5">Modify Product</Typography>
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
                inputProps={{ maxLength: 35 }}
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
                MODIFY PRODUCT
              </Button>
            </Box>
          </FormControl>
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

export default ModifyProduct;
