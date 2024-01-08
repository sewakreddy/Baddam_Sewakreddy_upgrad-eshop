import * as React from "react";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ButtonBase from "@mui/material/ButtonBase";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import FormControl from "@mui/material/FormControl";
import { TextField, Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

const ProductDetail = () => {
  const [quantity, setQuantity] = React.useState(null);
  const [formErrors, setFormErrors] = React.useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const productReceived = location.state;

  const placeholder = (e) => {
    e.preventDefault();

    if (quantity !== null) {
      navigate("/address", { state: { productReceived, quantity } });
    } else {
      setFormErrors("Quantity is required");
    }
  };

  const Img = styled("img")({
    margin: "auto",
    display: "block",
    maxWidth: "100%",
    maxHeight: "100%",
  });

  return (
    <Box
      sx={{
        p: 2,
        marginTop: 20,
        maxWidth: 1000,
        flexGrow: 1,
        backgroundColor: (theme) =>
          theme.palette.mode === "dark" ? "#1A2027" : "#fff",
      }}
    >
      <Grid container spacing={2}>
        <Grid item>
          <ButtonBase sx={{ width: 360, height: 360 }}>
            <Img alt={productReceived.name} src={productReceived.imageUrl} />
          </ButtonBase>
        </Grid>
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={6}>
            <Grid item xs>
              <Box display="flex" justifyContent="flex-start" ma>
                <Typography gutterBottom variant="h4" component="div">
                  {productReceived.name}
                </Typography>
                <Box
                  sx={{
                    height: "50%",
                    width: 200,
                    display: "inline-block",
                    p: 1,
                    mx: 1,
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                    fontSize: "0.875rem",
                    fontWeight: "700",
                    textAlign: "center",
                    borderRadius: "20px",
                  }}
                >
                  <Typography variant="body1">
                    Availabe Quantity: {productReceived.availableItems}
                  </Typography>
                </Box>
              </Box>
              <Box
                display="flex"
                justifyContent="flex-start"
                ma
                sx={{ marginBlock: 2 }}
              >
                <Typography variant="body2">
                  Category: <b>{productReceived.category}</b>
                </Typography>
              </Box>
              <Box
                display="flex"
                justifyContent="flex-start"
                ma
                sx={{ marginBlock: 2 }}
              >
                <Typography variant="body2">
                  <i>{productReceived.description}</i>
                </Typography>
              </Box>
              <Box
                display="flex"
                justifyContent="flex-start"
                sx={{ color: "red" }}
              >
                <CurrencyRupeeIcon />
                <Typography variant="h5">{productReceived.price}</Typography>
              </Box>
              <Box
                display="flex"
                justifyContent="flex-start"
                ma
                sx={{ marginBlock: 2 }}
              >
                <FormControl>
                  <TextField
                    required
                    id="quantity"
                    label="Enter Quantity"
                    variant="outlined"
                    type="text"
                    autoFocus={false}
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    style={{ marginBottom: "20px", width: 250 }}
                    helperText={formErrors}
                  />
                  <Button
                    variant="contained"
                    style={{ marginBottom: "20px", width: 150 }}
                    onClick={(e) => placeholder(e)}
                  >
                    PLACE ORDER
                  </Button>
                </FormControl>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductDetail;
