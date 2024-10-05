import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import CartItem from "./CartItem";
import CartTotals from "./CartTotals";
import Navbar from "../Navbar";
import Footer from "../Footer";
import CheckoutDialog from "./CheckoutDialog";
import UserContext from "../../context/UserContext";
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Box,
  createTheme,
  ThemeProvider,
  responsiveFontSizes,
  Snackbar,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useNavigate } from "react-router-dom";
import useScreenSize from "../useScreenSize";

interface CartItemType {
  CA_id: number;
  C_id: number;
  P_id: number;
  CA_quantity: number;
  CA_price: number;
  Product: {
    P_name: string;
    P_description: string;
    P_price: string; // Update type to accept both number and string
    P_img: string;
  };
}

const theme = createTheme({
  typography: {
    fontFamily: "Montserrat, sans-serif",
    h6: {
      fontFamily: "Montserrat, sans-serif",
    },
    body2: {
      fontFamily: "Open Sans, sans-serif",
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

const responsiveTheme = responsiveFontSizes(theme);

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customerId, setCustomerId] = useState<number | null>(null);
  const [openCheckoutDialog, setOpenCheckoutDialog] = useState(false);
  const { C_id } = useContext(UserContext);
  const navigate = useNavigate();
  const screenSize = useScreenSize();
  const isMobile = screenSize.width < 900;
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<
    "success" | "error" | "warning" | "info"
  >("success");
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (C_id !== null) {
      setCustomerId(C_id);
    } else {
      navigate("/login");
    }
  }, [C_id, navigate]);

  useEffect(() => {
    if (customerId !== null) {
      const fetchCartDetails = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3000/cart/${customerId}`
          );
          setCartItems(response.data);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching cart details:", error);
          setError("Error fetching cart details");
          setLoading(false);
        }
      };

      fetchCartDetails();
    }
  }, [customerId, openCheckoutDialog]);

  const triggerAlert = (
    message: string,
    severity: "success" | "error" | "warning" | "info"
  ) => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setShowAlert(true);

    // set time out = 3 sec for alert
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  const handleQuantityChange = async (id: number, newQuantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.P_id === id ? { ...item, CA_quantity: newQuantity } : item
      )
    );

    const updatedItem = cartItems.find((item) => item.P_id === id);

    if (updatedItem) {
      try {
        await axios.patch(`http://localhost:3000/cart/update`, {
          C_id: updatedItem.C_id,
          P_id: updatedItem.P_id,
          CA_quantity: newQuantity,
          CA_price: parseFloat(updatedItem.Product.P_price) || 0,
        });
      } catch (error) {
        console.error("Error updating cart quantity:", error);
      }
    }
  };

  const handleDelete = async (P_id: number, C_id: number) => {
    try {
      await axios.delete(`http://localhost:3000/cart/delete`, {
        data: {
          C_id,
          P_id,
        },
      });

      setCartItems(cartItems.filter((item) => item.P_id !== P_id));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleOpenCheckout = () => {
    setOpenCheckoutDialog(true);
  };

  const handleCloseCheckout = () => {
    setOpenCheckoutDialog(false);
  };

  const handleCheckoutSubmit = async (addressId: number) => {
    console.log("Address ID:", addressId);
    handleCloseCheckout();
    triggerAlert("Order successfully placed and cart cleared!", "success");
  };

  const calculateSubtotal = () => {
    return cartItems.reduce(
      (sum, item) => sum + parseFloat(item.Product.P_price) * item.CA_quantity,
      0
    );
  };

  const subtotal = calculateSubtotal();
  const shipping = 50;
  let discount = 0;
  let total = subtotal + shipping;

  if (total >= 1000) {
    discount = total * 0.1;
  }

  total = total - discount;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        maxWidth: "100%",
        padding: "0",
        margin: "0",
      }}
    >
      <Navbar />
      <Container maxWidth="xl" sx={{ mt: isMobile ? 0 : 20, mb: 8 }}>
        <ThemeProvider theme={responsiveTheme}>
          <Typography
            variant="h3"
            align="left"
            gutterBottom
            sx={{
              fontFamily: "Syncopate",
              textAlign: "left",
              flex: "1 0 100%",
              fontSize: "2.5rem",
              mt: 4,
            }}
          >
            Your Cart
          </Typography>

          <Grid container spacing={5} justifyContent="center">
            <Grid size={{ xs: 12, md: 7 }}>
              <Box
                className="scrollable-container"
                sx={{
                  p: 4,
                  borderRadius: "8px",
                  maxHeight: "600px",
                  overflowY: "auto",
                }}
              >
                {loading ? (
                  <CircularProgress />
                ) : error ? (
                  <Alert severity="error">{error}</Alert>
                ) : cartItems.length > 0 ? (
                  cartItems.map((item) => {
                    const price = parseFloat(item.Product.P_price); // Ensure price is a number
                    return (
                      <CartItem
                        key={item.P_id}
                        item={{
                          ...item.Product,
                          CA_quantity: item.CA_quantity,
                          P_price: price.toFixed(2), // Convert to string
                        }}
                        onQuantityChange={(newQuantity) =>
                          handleQuantityChange(item.P_id, newQuantity)
                        }
                        onDelete={() => handleDelete(item.P_id, item.C_id)}
                      />
                    );
                  })
                ) : (
                  <Typography variant="body1" align="center">
                    Your cart is empty.
                  </Typography>
                )}
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <CartTotals
                subtotal={subtotal}
                shipping={shipping}
                discount={discount}
                total={total}
                onCheckout={handleOpenCheckout} // Pass handleOpenCheckout to CartTotals
              />
            </Grid>
          </Grid>
        </ThemeProvider>
      </Container>
      {/* </div> */}
      <Snackbar
        open={showAlert}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={alertSeverity} onClose={() => setShowAlert(false)}>
          {alertMessage}
        </Alert>
      </Snackbar>
      <Footer />
      {customerId !== null && (
        <CheckoutDialog
          customerId={customerId}
          open={openCheckoutDialog}
          onClose={handleCloseCheckout}
          onSubmit={handleCheckoutSubmit}
          total={total}
        />
      )}
    </div>
  );
};

export default CartPage;
