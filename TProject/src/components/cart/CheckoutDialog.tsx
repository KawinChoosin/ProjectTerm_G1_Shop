import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  createTheme,
  ThemeProvider,
  Slide,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import axios from "axios";

interface CheckoutDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (address: string, paymentMethod: string) => void;
  total: number;
  addresses: string[];
  customerId: number;
}

// Theme na ja
const theme = createTheme({
  typography: {
    fontFamily: "Montserrat, sans-serif",
  },
});

// Pop-up transition
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// Dialog
const CheckoutDialog: React.FC<CheckoutDialogProps> = ({
  open,
  onClose,
  onSubmit,
  total,
  addresses,
  customerId,
}) => {
  const [address, setAddress] = useState<string>(""); // Selected address
  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });
  const [showNewAddressForm, setShowNewAddressForm] = useState<boolean>(false);

  // Reset the address form when the dialog opens
  useEffect(() => {
    if (open) {
      setAddress("");
      setNewAddress({
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
      });
      setShowNewAddressForm(false); // Ensure the form starts closed
    }
  }, [open,address]);

  // interface Product {
  //   P_name: string;
  //   P_description?: string;
  //   P_img?: string;
  // }

  // interface OrderDetail {
  //   P_id: number;
  //   OD_quantity: number;
  //   OD_price: number;
  //   Product: Product;
  // }

  interface CartItem {
    P_id: number; // Product ID
    CA_quantity: number; // Quantity of the product
    CA_price: number; // Price per unit
  }
  

  // Cart to order
  const handleCheckoutSubmit = async () => {
    if (!address && !newAddress.street) {
      alert("Please select or add an address!");
      return;
    }

    const selectedAddress = showNewAddressForm
      ? `${newAddress.street}, ${newAddress.city}, ${newAddress.state}, ${newAddress.postalCode}, ${newAddress.country}`
      : address;

    try {
      // Fetch the cart items from the backend
      const cartResponse = await axios.get(
        `http://localhost:3000/cart/${customerId}`
      );
      const cartItems = cartResponse.data;

      if (!cartItems || cartItems.length === 0) {
        alert("No items found in cart.");
        return;
      }

      // Prepare the order details by mapping cart items to the expected order format
      const orderDetails = cartItems.map((item : CartItem) => ({
        P_id: item.P_id, // Product ID
        OD_quantity: item.CA_quantity, // Quantity of the product
        OD_price: item.CA_price, // Price per unit
      }));

      const orderData = {
        C_id: customerId,
        Date_time: new Date().toISOString(), // Current date and time
        Total: total, // Total amount from cart
        PM_type: "PromPlay", // Payment method
        PM_amount: total, // Amount to be paid
        orderDetails, // Attach cart items as order details
      };

      // Create the order by sending the order data to the backend
      await axios.post("http://localhost:3000/order", orderData);

      // Clear the cart by deleting the cart items for the customer
      for (const item of cartItems) {
        await axios.delete("http://localhost:3000/cart/delete", {
          data: { C_id: customerId, P_id: item.P_id },
        });
      }

      alert("Order successfully placed and cart cleared!");
      onSubmit(selectedAddress, "PromPlay"); // Trigger any additional actions (like UI updates)
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("Failed to complete checkout. Please try again.");
    }
  };

  const handleAddNewAddress = async () => {
    // Basic form validation
    if (
      !newAddress.street ||
      !newAddress.city ||
      !newAddress.state ||
      !newAddress.postalCode ||
      !newAddress.country
    ) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/address", {
        A_street: newAddress.street,
        A_city: newAddress.city,
        A_state: newAddress.state,
        A_postalCode: newAddress.postalCode,
        A_country: newAddress.country,
        C_id: customerId, // Use correct field name
      });

      // Assume the response returns the saved address
      const savedAddress = response.data;

      // Update the selected address with the new one
      setAddress(
        `${savedAddress.A_street}, ${savedAddress.A_city}, ${savedAddress.A_state}, ${savedAddress.A_postalCode}, ${savedAddress.A_country}`
      );

      // Hide the new address form and reset the fields
      setShowNewAddressForm(false);
      setNewAddress({
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error adding new address:",
          error.response?.data || error.message
        );
        alert("There was an error adding the address. Please try again.");
      } else {
        console.error("Unexpected error:", error);
        alert("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Transition}
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>CHECKOUT</DialogTitle>
        <DialogContent sx={{ bgcolor: "#fafafa", color: "#333" }}>
          {!showNewAddressForm && addresses.length > 0 ? (
            <FormControl fullWidth margin="normal">
              <InputLabel>Select Address</InputLabel>
              <Select
                value={address}
                onChange={(e) => setAddress(e.target.value as string)}
                label="Select Address"
                sx={{ bgcolor: "#ffffff" }}
              >
                {addresses.map((addr, index) => (
                  <MenuItem key={index} value={addr}>
                    {addr}
                  </MenuItem>
                ))}
              </Select>
              <Button
                onClick={() => setShowNewAddressForm(true)}
                sx={{ mt: 2, color: "#596fb7" }}
              >
                Add New Address
              </Button>
            </FormControl>
          ) : (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Street"
                  fullWidth
                  value={newAddress.street}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, street: e.target.value })
                  }
                  margin="normal"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="City"
                  fullWidth
                  value={newAddress.city}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, city: e.target.value })
                  }
                  margin="normal"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="State"
                  fullWidth
                  value={newAddress.state}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, state: e.target.value })
                  }
                  margin="normal"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Postal Code"
                  fullWidth
                  value={newAddress.postalCode}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, postalCode: e.target.value })
                  }
                  margin="normal"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Country"
                  fullWidth
                  value={newAddress.country}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, country: e.target.value })
                  }
                  margin="normal"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} container justifyContent="center">
                <Button
                  onClick={handleAddNewAddress}
                  sx={{ mt: 2, color: "#596fb7" }}
                >
                  Save Address
                </Button>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} sx={{ color: "#db4237" }}>
            Cancel
          </Button>
          <Button
            onClick={handleCheckoutSubmit}
            sx={{
              bgcolor: "#000",
              color: "#fff",
              borderRadius: "5px",
              "&:hover": {
                bgcolor: "#2e2e2e",
              },
              textTransform: "none",
            }}
          >
            Confirm Checkout (${total.toFixed(2)})
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default CheckoutDialog;