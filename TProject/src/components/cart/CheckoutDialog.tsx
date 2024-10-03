import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { Grid2 } from "@mui/material"; // Importing Grid2
import axios from "axios";
import QR from "./Qr";
import PaymentForm from "./uploadfile"; // Ensure this is the correct import for your upload component

interface CheckoutDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (addressId: number) => void;
  total: number;
  customerId: number;
}

interface CartItem {
  P_id: number;
  CA_quantity: number;
  CA_price: number;
}

interface Address {
  A_id: number;
  A_street: string;
  A_city: string;
  A_state: string;
  A_postalCode: string;
  A_country: string;
}

interface NewAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

// Theme
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

// Dialog Component
const CheckoutDialog: React.FC<CheckoutDialogProps> = ({
  open,
  onClose,
  onSubmit,
  total,
  customerId,
}) => {
  const [address, setAddress] = useState<Address | null>(null);
  const [newAddress, setNewAddress] = useState<NewAddress>({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [checkoutAddresses, setCheckoutAddresses] = useState<Address[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false); // State to manage upload success

  useEffect(() => {
    if (open) {
      resetForm();
      fetchAddresses();
    }
  }, [open]);

  const resetForm = () => {
    setAddress(null);
    setNewAddress({
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    });
    setShowNewAddressForm(false);
    setSelectedFile(null);
    setUploadSuccess(false);
  };

  const fetchAddresses = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/address/${customerId}`
      );
      const addresses = response.data.map((addr: any) => ({
        A_id: addr.A_id,
        A_street: addr.A_street,
        A_city: addr.A_city,
        A_state: addr.A_state,
        A_postalCode: addr.A_postalCode,
        A_country: addr.A_country,
      }));
      setCheckoutAddresses(addresses);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      alert("Failed to fetch addresses.");
    }
  };

  const handleFileUpload = (file: File | null) => {
    setSelectedFile(file);
    setUploadSuccess(false); // Reset upload success state
  };

  const handleSaveNewAddress = async () => {
    if (
      newAddress.street === "" ||
      newAddress.city === "" ||
      newAddress.state === "" ||
      newAddress.postalCode === "" ||
      newAddress.country === ""
    ) {
      alert("Please fill all fields to save the new address.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/address", {
        A_street: newAddress.street,
        A_city: newAddress.city,
        A_state: newAddress.state,
        A_postalCode: newAddress.postalCode,
        A_country: newAddress.country,
        C_id: customerId,
      });

      const savedAddress = response.data; // Ensure this matches your API's response

      // Update checkout addresses to include the newly added address
      setCheckoutAddresses((prevAddresses) => [...prevAddresses, savedAddress]);

      // Automatically select the newly added address
      setAddress(savedAddress);

      // Hide the new address form and go back to the address selection view
      setShowNewAddressForm(false);
    } catch (error) {
      console.error("Error saving new address:", error);
      alert("Failed to save the new address.");
    }
  };

  const handleCheckoutSubmit = async () => {
    // Validate address selection or addition
    if (!address && !newAddress.street) {
      alert("Please select or add an address!");
      return;
    }

    try {
      // Fetch cart items
      const cartItems = await fetchCartItems(customerId);

      if (!cartItems || cartItems.length === 0) {
        alert("No items found in cart.");
        return;
      }

      // Prepare order details
      const orderDetails = cartItems.map((item: CartItem) => ({
        P_id: item.P_id,
        OD_quantity: item.CA_quantity,
        OD_price: item.CA_price,
      }));

      // Calculate total amount
      const total = cartItems.reduce(
        (sum: number, item: CartItem) => sum + item.CA_price * item.CA_quantity,
        0
      );

      // Handle address submission (new or existing)
      const addressId: number = await handleAddressSubmission();

      // Handle file upload before submitting the order
      let payslipPath: string | null = null; // Initialize payslipPath

      if (selectedFile) {
        payslipPath = await uploadPayslip(selectedFile); // Get the file path
      } else {
        alert("Please upload a payslip.");
        return;
      }
      
      console.log("pay:", payslipPath);

      // Check if payslipPath is null
      if (payslipPath === null) {
        alert("Failed to upload payslip. Please try again.");
        return; // Or handle this error as needed
      }

      // Submit the order with payment information
      await submitOrder(
        customerId,
        addressId,
        orderDetails,
        total,
        payslipPath
      ); // Pass the payslip path

      console.log("Order Details:", orderDetails);

      // Clear the cart after a successful order
      await clearCart(cartItems);

      alert("Order successfully placed and cart cleared!");
      onSubmit(addressId); // Pass selected address and payment method
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("Failed to complete checkout. Please try again.");
    }
  };

  const submitOrder = async (
    customerId: number,
    addressId: number,
    orderDetails: any,
    total: number, // Ensure total is passed correctly
    payslipPath: string // New parameter for the payslip path
  ) => {

    const orderData = {
      C_id: customerId,
      Date_time: new Date().toISOString(),
      Total: total,
      PM_amount: total,
      A_id: addressId,
      PM_path: payslipPath,
      O_Description: "test",
      orderDetails,
    };
    

    await axios.post("http://localhost:3000/order", orderData);
    // console.log("Customer ID:", customerId);
    // console.log("Total:", total);
    // console.log("Address ID:", addressId);
    // console.log("Order Details:", orderDetails);
    // console.log("Payslip Path:", payslipPath); // Log the payslip path
  
    // Create FormData instance
    // const formData = new FormData();
  
    // // Check if the parameters are defined
    // if (
    //   typeof customerId === "undefined" ||
    //   typeof total === "undefined" ||
    //   typeof addressId === "undefined" ||
    //   !payslipPath // Check if payslipPath is provided
    // ) {
    //   console.error("One of the parameters is undefined");
    //   return;
    // }
  
    // // Append data to FormData
    // formData.append("C_id", customerId.toString());
    // formData.append("Date_time", new Date().toISOString());
    // formData.append("O_Total", total.toString());
    // formData.append("PM_amount", total.toString());
    // formData.append("A_id", addressId.toString());
    // formData.append("O_Description", "Optional description here"); // If you have a description
    // formData.append("PM_path", payslipPath); // Append the payslip path
  
    // // Check if orderDetails is an array and not empty
    // if (!Array.isArray(orderDetails) || orderDetails.length === 0) {
    //   console.error("Order details are invalid");
    //   return;
    // }
  
    // Append orderDetails as JSON strings
    // orderDetails.forEach((detail) => {
    //   formData.append("orderDetails", JSON.stringify(detail));
    // });
  
    // try {
    //   const response = await axios.post(
    //     "http://localhost:3000/order",
    //     formData,
    //     {
    //       headers: {
    //         "Content-Type": "multipart/form-data",
    //       },
    //     }
    //   );
    //   console.log("Order placed successfully:", response.data);
    //   return response.data;
    // } catch (error) {
    //   if (axios.isAxiosError(error)) {
    //     console.error("Error response:", error.response?.data);
    //   } else {
    //     console.error("Error:", error);
    //   }
    //   throw error; // Rethrow error for upstream handling
    // }
  };
  
  

  const uploadPayslip = async (file: File) => {
    const formData = new FormData();
    formData.append("slip", file);

    // If you're appending numbers, convert them to strings first
    formData.append("total", total.toString());

    const fileUploadResponse = await axios.post(
      "http://localhost:3000/upload/slip",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    setUploadSuccess(true); // Set upload success
    return fileUploadResponse.data.payslipPath;
  };

  const fetchCartItems = async (customerId: number) => {
    const cartResponse = await axios.get(
      `http://localhost:3000/cart/${customerId}`
    );
    return cartResponse.data;
  };

  const handleAddressSubmission = async () => {
    let addressId: number;
    if (showNewAddressForm) {
      const addressResponse = await axios.post(
        "http://localhost:3000/address",
        {
          A_street: newAddress.street,
          A_city: newAddress.city,
          A_state: newAddress.state,
          A_postalCode: newAddress.postalCode,
          A_country: newAddress.country,
          C_id: customerId,
        }
      );
      addressId = addressResponse.data.A_id; // Get the new address ID from the response
      // Append the new address to the existing addresses
      setCheckoutAddresses((prev) => [
        ...prev,
        {
          A_id: addressId,
          A_street: newAddress.street,
          A_city: newAddress.city,
          A_state: newAddress.state,
          A_postalCode: newAddress.postalCode,
          A_country: newAddress.country,
        },
      ]);
    } else if (address && "A_id" in address) {
      addressId = address.A_id; // Use the existing address if available
    } else {
      throw new Error("Selected address is invalid.");
    }
    return addressId;
  };

  const clearCart = async (cartItems: CartItem[]) => {
    for (const item of cartItems) {
      await axios.delete("http://localhost:3000/cart/delete", {
        data: { C_id: customerId, P_id: item.P_id },
      });
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
        <DialogTitle sx={{ fontWeight: "bold", color: "#333" }}>
          CHECKOUT
        </DialogTitle>
        <DialogContent sx={{ bgcolor: "#fafafa", color: "#333" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {!showNewAddressForm && checkoutAddresses.length > 0 ? (
              <FormControl fullWidth margin="normal">
                <InputLabel>Select Address</InputLabel>
                <Select
                  value={address ? JSON.stringify(address) : ""}
                  onChange={(e) => setAddress(JSON.parse(e.target.value))}
                  label="Select Address"
                  sx={{ bgcolor: "#ffffff" }}
                >
                  {checkoutAddresses.map((addr, index) => (
                    <MenuItem key={index} value={JSON.stringify(addr)}>
                      {`${addr.A_street}, ${addr.A_city}, ${addr.A_state}, ${addr.A_postalCode}, ${addr.A_country}`}
                    </MenuItem>
                  ))}
                </Select>
                <Button
                  onClick={() => setShowNewAddressForm(true)}
                  sx={{ mt: 2, color: "#596fb7", alignSelf: "center" }}
                >
                  Add New Address
                </Button>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "16px",
                  }}
                >
                  <QR amount={total} />
                  <h3>TOTAL: {total}</h3>
                  <PaymentForm total={total} onFileUpload={handleFileUpload} />
                  {uploadSuccess && (
                    <span style={{ color: "green" }}>
                      File uploaded successfully!
                    </span>
                  )}
                </div>
              </FormControl>
            ) : (
              <Grid2 container spacing={2}>
                <Grid2 size={12}>
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
                </Grid2>
                <Grid2 size={12}>
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
                </Grid2>
                <Grid2 size={12}>
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
                </Grid2>
                <Grid2 size={12}>
                  <TextField
                    label="Postal Code"
                    fullWidth
                    value={newAddress.postalCode}
                    onChange={(e) =>
                      setNewAddress({
                        ...newAddress,
                        postalCode: e.target.value,
                      })
                    }
                    margin="normal"
                    variant="outlined"
                  />
                </Grid2>
                <Grid2 size={12}>
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
                </Grid2>
                {/* <div style={{ display: 'flex', flexDirection: 'column'}}> */}
                <Button
                  onClick={() => setShowNewAddressForm(false)}
                  sx={{ mt: 2, color: "#db4237" }}
                >
                  BACK
                </Button>
                <Button
                  onClick={handleSaveNewAddress}
                  sx={{ mt: 2, ml: 13, color: "#596fb7", alignSelf: "center" }}
                >
                  Save New Address
                </Button>

                {/* </div> */}
              </Grid2>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} sx={{ color: "#596fb7" }}>
            Cancel
          </Button>
          <Button onClick={handleCheckoutSubmit} sx={{ color: "#596fb7" }}>
            Confirm Checkout
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default CheckoutDialog;
