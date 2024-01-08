import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Stack, Grid, TextField, Paper } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";

const steps = ["Items", "Select Address", "Confirm Order"];

const Address = () => {
  const [activeStep, setActiveStep] = React.useState(1);
  const [addresses, setAddresses] = React.useState([]);
  const [selectedAddress, setSelectAddress] = React.useState();
  const [addressId, setAddressId] = React.useState(null);
  const [name, setName] = React.useState("");
  const [contact, setContact] = React.useState("");
  const [street, setStreet] = React.useState("");
  const [city, setCity] = React.useState("");
  const [state, setState] = React.useState("");
  const [landmark, setLandmark] = React.useState("");
  const [zipcode, setZipcode] = React.useState("");
  const [addressRequest, setAddressRequest] = React.useState(null);
  const [addAddressResponse, setAddAddressResponse] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [formErrors, setFormErrors] = React.useState({});
  const [snackPosition, setSnackPosition] = React.useState({
    open: false,
    vertical: "top",
    horizontal: "right",
  });

  const { vertical, horizontal, open } = snackPosition;
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  const authToken =
    "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0M0B1cGdyYWQuY29tIiwiaWF0IjoxNzA0NzM0MzQyLCJleHAiOjE3MDQ3NDI3NDJ9.t7S46LpT4LvDUODAdLsLx_aaj83N3Dr-QWzkGqBW5ke0hVLOq_tR2zPXRqyC3QZ0WHRBU5KQtA5p_uCnm8d6Qw";
  const location = useLocation();
  const productInfo = location.state;
  const product = productInfo.productReceived;
  const quantity = productInfo.quantity;

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackPosition({ ...snackPosition, open: false });
    setError(null);
  };

  const handleNext = () => {
    if (addressId) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else {
      setSnackPosition({ ...snackPosition, open: true });
      setError("Please select address!");
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    // if (activeStep === 0) {
    //   navigate("/productDetail");
    // }
  };

  const getAddresses = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/addresses", {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": authToken,
        },
      });
      if (response.ok) {
        const result = await response.json();
        setAddresses(result);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const addAddressRequest = (e) => {
    e.preventDefault();

    setFormErrors(null);
    const validationErrors = {};
    if (!name) {
      validationErrors.name = "Name is required";
    }
    if (!street) {
      validationErrors.street = "Street is required";
    }
    if (!state) {
      validationErrors.state = "State is required";
    }
    if (!city) {
      validationErrors.city = "City is required";
    }
    if (!contact) {
      validationErrors.contact = "Contact is required";
    }
    if (!zipcode) {
      validationErrors.zipcode = "Zip Code is required";
    }

    setFormErrors(validationErrors);
    let addAddressRequest = {
      name: name,
      contactNumber: contact,
      city: city,
      landmark: landmark,
      street: street,
      state: state,
      zipcode: zipcode,
    };
    setAddressRequest(addAddressRequest);
  };

  const handlePostRequest = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/addresses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": authToken,
        },
        body: JSON.stringify(addressRequest),
      });

      if (response.ok) {
        const data = await response.json();
        setAddAddressResponse(data);
      }
    } catch (error) {
      setError(error);
      console.error("Error:", error);
    }
  };

  const handleAddressChange = () => {
    const a = addresses.filter((a) => a.id === addressId);
    setSelectAddress(a[0]);
  };

  React.useEffect(() => {
    getAddresses();
  }, [addAddressResponse]);

  React.useEffect(() => {
    if (addressRequest) {
      handlePostRequest();
    }
  }, [addressRequest]);

  return (
    <Box
      sx={{
        p: 2,
        marginTop: 10,
        maxWidth: 1000,
        flexGrow: 1,
      }}
    >
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};

          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === 2 ? (
        <React.Fragment>
          <Grid container spacing={0}>
            <Grid item xs={8}>
              <Paper
                sx={{
                  p: 2,
                  marginTop: 10,
                  flexGrow: 1,
                  height: 300,
                }}
              >
                <Grid container direction="column" spacing={1}>
                  <Grid item xs={2}>
                    <Box display="flex" justifyContent="flex-start">
                      <Typography variant="h4">{product.name}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={2}>
                    <Box display="flex" justifyContent="flex-start">
                      <Typography variant="h6">
                        Quantity: <b>{quantity}</b>
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={2}>
                    <Box display="flex" justifyContent="flex-start">
                      <Typography variant="h6">
                        Category: <b>{product.category}</b>
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={2}>
                    <Box display="flex" justifyContent="flex-start">
                      <Typography variant="body1">
                        <em>{product.description}</em>
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={2}>
                    <Box display="flex" justifyContent="flex-start">
                      <Typography variant="h5" sx={{ color: "red" }}>
                        Total Price: <CurrencyRupeeIcon /> {product.price}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper
                sx={{
                  p: 2,
                  marginTop: 10,
                  flexGrow: 1,
                  height: 300,
                }}
              >
                <Grid container direction="column" spacing={1}>
                  <Grid item xs={2}>
                    <Box display="flex" justifyContent="flex-start">
                      <Typography variant="h4">Address Details: </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={2}>
                    <Box display="flex" justifyContent="flex-start">
                      <Typography variant="body1">
                        {selectedAddress && selectedAddress.name}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={2}>
                    <Box display="flex" justifyContent="flex-start">
                      <Typography variant="body1">
                        {selectedAddress && selectedAddress.contactNumber}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={2}>
                    <Box display="flex" justifyContent="flex-start">
                      <Typography variant="body1">
                        {selectedAddress &&
                          `${selectedAddress.street}, ${selectedAddress.city}`}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={2}>
                    <Box display="flex" justifyContent="flex-start">
                      <Typography variant="body1">
                        {selectedAddress && selectedAddress.state}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={2}>
                    <Box display="flex" justifyContent="flex-start">
                      <Typography variant="body1">
                        {selectedAddress && selectedAddress.zipcode}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
          <Box padding={4}>
            <Grid container direction="row" spacing={2}>
              <Grid item xs={6}>
                <Box display="flex" justifyContent="flex-end">
                  <Button
                    color="inherit"
                    disabled={activeStep === 0}
                    onClick={handleBack}
                  >
                    BACK
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box display="flex" justifyContent="flex-start">
                  <Button variant="contained" onClick={handleNext}>
                    PLACE ORDER
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Stack direction="column" spacing={4} padding={1}>
            <Grid container direction="row">
              <Grid item xs={6}>
                <Typography>Select Address</Typography>
              </Grid>
            </Grid>
          </Stack>

          <FormControl sx={{ width: 600 }}>
            <Select
              labelId="adress-label-select"
              id="address-select"
              value={addressId}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
              onChange={(event) => {
                setAddressId(event.target.value);
                handleAddressChange();
              }}
            >
              {addresses &&
                addresses.map((c, i) => (
                  <MenuItem value={`${c.id}`} key={`${c.id}`}>
                    {`${c.name} --> ${c.street}, ${c.city}, ${c.landmark}, ${c.state}, ${c.zipcode}`}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          <Stack direction="column" spacing={4} padding={4}>
            <Grid container direction="row">
              <Grid item xs={12}>
                <Typography variant="body1">-OR-</Typography>
              </Grid>
            </Grid>
          </Stack>

          <Stack direction="column" padding={1}>
            <Typography variant="h5">Add Address</Typography>
          </Stack>
          <FormControl sx={{ width: 600 }}>
            <Box
              sx={{ flexGrow: 1 }}
              component="form"
              marginBottom="10px"
              marginTop="15px"
            >
              <TextField
                required
                fullWidth
                id="name"
                label="Name"
                variant="outlined"
                type="text"
                autoFocus={false}
                value={name}
                helperText={formErrors.name}
                style={{ marginBottom: "10px" }}
                onChange={(e) => setName(e.target.value)}
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
                style={{ marginBottom: "10px" }}
                onChange={(e) => setContact(e.target.value)}
              />
              <TextField
                required
                id="street"
                label="Street"
                variant="outlined"
                type="text"
                fullWidth
                autoFocus={false}
                value={street}
                helperText={formErrors.street}
                style={{ marginBottom: "10px" }}
                onChange={(e) => setStreet(e.target.value)}
              />
              <TextField
                required
                id="city"
                label="City"
                variant="outlined"
                type="text"
                fullWidth
                autoFocus={false}
                value={city}
                helperText={formErrors.city}
                style={{ marginBottom: "10px" }}
                onChange={(e) => setCity(e.target.value)}
              />
              <TextField
                required
                id="state"
                label="State"
                variant="outlined"
                type="text"
                fullWidth
                autoFocus={false}
                value={state}
                helperText={formErrors.state}
                style={{ marginBottom: "10px" }}
                onChange={(e) => setState(e.target.value)}
              />
              <TextField
                id="landmark"
                label="Landmark"
                variant="outlined"
                type="text"
                fullWidth
                autoFocus={false}
                value={landmark}
                style={{ marginBottom: "10px" }}
                onChange={(e) => setLandmark(e.target.value)}
              />
              <TextField
                required
                id="zip"
                label="Zip Code"
                variant="outlined"
                type="number"
                fullWidth
                autoFocus={false}
                value={zipcode}
                helperText={formErrors.zipcode}
                style={{ marginBottom: "20px" }}
                onChange={(e) => setZipcode(e.target.value)}
              />
              <Button variant="contained" fullWidth onClick={addAddressRequest}>
                SAVE ADDRESS
              </Button>
            </Box>
          </FormControl>

          <Stack direction="column" spacing={4} padding={1}>
            <Grid container direction="row">
              <Grid item xs={6}>
                <Button
                  color="inherit"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                >
                  BACK
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button variant="contained" onClick={handleNext}>
                  NEXT
                </Button>
              </Grid>
            </Grid>
          </Stack>

          {error ? (
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
          ) : null}
        </React.Fragment>
      )}
    </Box>
  );
};

export default Address;
