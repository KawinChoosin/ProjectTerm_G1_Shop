import React, { useEffect, useState } from "react";
import axios from "axios";
import CartItem from "./CartItem";
import CartTotals from "./CartTotals";
import Navbar from "../Navbar";
import Footer from "../Footer";
import CheckoutDialog from "./CheckoutDialog";
import {
  Grid,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Box,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import "./cart.css";

interface CartItemType {
  CA_id: number;
  C_id: number;
  P_id: number;
  CA_quantity: number;
  CA_price: number;
  Product: {
    P_name: string;
    P_description: string;
    P_price: number;
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
});

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customerId, setCustomerId] = useState<number>(1); // Example customer_id
  const [openCheckoutDialog, setOpenCheckoutDialog] = useState(false);
  const [checkoutAddresses, setCheckoutAddresses] = useState<string[]>([]);

  useEffect(() => {
    const fetchCartDetails = async () => {
      // try {
      const response = await axios.get(
        `http://localhost:3000/cart/${customerId}`
      );
      setCartItems(response.data); // Update state with cart items from API
      setLoading(false); // Stop loading once data is fetched
      // } catch (error) {
      //   console.error("Error fetching cart details:", error);
      //   setError("Error fetching cart details");
      //   setLoading(false);
      // }
    };

    fetchCartDetails();
  }, [customerId]);

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
          CA_price: updatedItem.Product.P_price, // Send the price per unit
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

  const handleOpenCheckout = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/address/${customerId}`
      );
      const addresses = response.data.map((addr: any) => {
        return `${addr.A_street}, ${addr.A_city}, ${addr.A_state}, ${addr.A_postalCode}, ${addr.A_country}`;
      });
      setCheckoutAddresses(addresses);
      setOpenCheckoutDialog(true);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  const handleCloseCheckout = () => setOpenCheckoutDialog(false);

  const handleCheckoutSubmit = async (
    address: string,
    paymentMethod: string
  ) => {
    // Handle checkout submission logic here
    console.log("Address:", address);
    console.log("Payment Method:", paymentMethod);
    handleCloseCheckout();
  };

  const calculateSubtotal = () => {
    return cartItems.reduce(
      (sum, item) => sum + item.Product.P_price * item.CA_quantity,
      0
    );
  };

  const subtotal = calculateSubtotal();
  const shipping = 0; // Assume free shipping for now
  const discount = 10; // Assume a fixed discount for now
  const total = subtotal + shipping - discount;

  return (
    <>
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
        <Container maxWidth="xl" sx={{ mt: 20, mb: 8 }}>
          <ThemeProvider theme={theme}>
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
              <Grid item xs={12} md={8}>
                <Box
                  className="scrollable-container"
                  sx={{
                    p: 4,
                    borderRadius: "8px",
                    maxHeight: "600px",
                    overflowY: "auto",
                  }}
                >
                  {cartItems.length > 0 ? (
                    cartItems.map((item) => (
                      <CartItem
                        key={item.P_id}
                        item={{
                          ...item.Product,
                          CA_quantity: item.CA_quantity,
                        }}
                        onQuantityChange={(newQuantity) =>
                          handleQuantityChange(item.P_id, newQuantity)
                        }
                        onDelete={() => handleDelete(item.P_id, item.C_id)}
                      />
                    ))
                  ) : (
                    <Typography variant="body1" align="center">
                      Your cart is empty.
                    </Typography>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
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
        <Footer />
        <CheckoutDialog
          customerId={customerId}
          open={openCheckoutDialog}
          onClose={handleCloseCheckout}
          onSubmit={handleCheckoutSubmit}
          total={total}
          addresses={checkoutAddresses} // Pass fetched addresses
        />
      </div>
    </>
  );
};

export default CartPage;
