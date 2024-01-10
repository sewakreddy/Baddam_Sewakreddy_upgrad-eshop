import React, { useState, useContext } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Box, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import { AuthContext } from "../../common/auth/AuthContext";

function Product({ product, deleteFunction }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const { loginInfo } = useContext(AuthContext);
  const role = loginInfo.role;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Card sx={{ width: 300, height: 600 }}>
      <CardMedia
        component={"img"}
        alt={product.name}
        image={product.imageUrl}
        sx={{
          height: 300,
          width: { sm: 300 },
          alignItems: "center",
          objectFit: "cover",
        }}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {product.name}
        </Typography>
        <Typography gutterBottom variant="h5" component="div">
          <CurrencyRupeeIcon />
          {product.price}
        </Typography>
        <Box sx={{ height: 100, overflowY: "auto" }}>
          <Typography variant="body2" color="text.secondary">
            {product.description}
          </Typography>
        </Box>
      </CardContent>
      <CardActions>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <Box display="flex" justifyContent="flex-start">
              <Button
                variant="contained"
                size="small"
                onClick={() => navigate("/productDetail", { state: product })}
              >
                BUY
              </Button>
            </Box>
          </Grid>
          <Grid item xs={2}>
            <IconButton
              aria-label="edit"
              onClick={() => navigate("/modifyProduct", { state: product })}
            >
              {role === "ADMIN" ? <EditIcon /> : null}
            </IconButton>
          </Grid>
          <Grid item xs={2}>
            <IconButton
              aria-label="delete"
              onClick={() => {
                handleClickOpen();
              }}
            >
              {role === "ADMIN" ? <DeleteIcon /> : null}
            </IconButton>
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {"Confirm deletion of product!"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Are you sure you want to delete the product?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  variant="contained"
                  onClick={() => {
                    deleteFunction(product);
                    handleClose();
                  }}
                >
                  OK
                </Button>
                <Button variant="outlined" onClick={handleClose} autoFocus>
                  CANCEL
                </Button>
              </DialogActions>
            </Dialog>
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
}

export default Product;
