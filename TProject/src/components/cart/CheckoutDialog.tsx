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
  Alert,
  Snackbar,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import  Grid  from "@mui/material/Grid2"; // Importing Grid
import axios from "axios";
import QR from "./Qr";
import PaymentForm from "./uploadfile"; // Ensure this is the correct import for your upload component
import { useForm, Controller } from 'react-hook-form';

interface CheckoutDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (addressId: number) => void;
  total: number;
  customerId: number;
}

interface CartItem {
  Product: any;
  P_id: number;
  CA_quantity: number;
  CA_price: number;  // This should be the price from the cart
  P_name: string;    // Add this for product name
  P_price: number;   // Add this for product price
}



interface Address {
  A_id: number;
  A_street: string;
  A_city: string;
  A_state: string;
  A_postalCode: string;
  A_country: string;
  A_name: string;
  A_phone: string;
}

interface NewAddress {
  name: string;
  phoneNumber: string;
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
    name: "",
    phoneNumber: "",
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
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<
    "success" | "error" | "warning" | "info"
  >("success");
  const [showAlert, setShowAlert] = useState(false);
  const { control, handleSubmit, formState: { errors }, trigger } = useForm({
    mode: "onBlur", // Trigger validation onBlur
    defaultValues: {
      name: '',
      phoneNumber: '',
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: ''
    },
  });

  useEffect(() => {
    if (open) {
      resetForm();
      fetchAddresses();
    }
  }, [open]);

  const resetForm = () => {
    setAddress(null);
    setNewAddress({
      name: "",
      phoneNumber: "",
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
        A_name: addr.A_name,
        A_phone: addr.A_phone,
      }));
      setCheckoutAddresses(addresses);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      triggerAlert("Failed to fetch addresses.", "error");
    }
  };

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

  const handleFileUpload = (file: File | null) => {
    setSelectedFile(file);
    setUploadSuccess(false); // Reset upload success state
  };

  const handleSaveNewAddress = async () => {
    
    // Check for form validation here
    const isValid = await trigger(); // Trigger validation for all fields
    if (!isValid) {
      triggerAlert("Please fill all fields to save the new address.", "error");
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
        A_name: newAddress.name,
        A_phone: newAddress.phoneNumber,
      });
  
      const savedAddress = response.data; // Ensure this matches your API's response
  
      // Update checkout addresses to include the newly added address
      setCheckoutAddresses((prevAddresses) => [...prevAddresses, savedAddress]);
  
      // Automatically select the newly added address
      setAddress(savedAddress);
  
      // Clear the newAddress state if you want to reset the form
      setNewAddress({
        name: "",
        phoneNumber: "",
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
      });
  
      // Hide the new address form and go back to the address selection view
      setShowNewAddressForm(false);
    } catch (error) {
      console.error("Error saving new address:", error);
      triggerAlert("Failed to save the new address.", "error");
    }
  };
  
  
  // Add this in the component to set newAddress when toggling form
  const handleShowNewAddressForm = () => {
 
    // Optionally, reset newAddress if you want a fresh form
    setNewAddress({
      name: "",
      phoneNumber: "",
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    });
    setShowNewAddressForm(true);
  };
  

  const handleCheckoutSubmit = async () => {
    
    // Validate address selection or addition
    if (!address && !newAddress.street) {
      triggerAlert("Please select or add an address!", "error");
      return;
    }

    try {
      // Fetch cart items
      const cartItems = await fetchCartItems(customerId);

      if (!cartItems || cartItems.length === 0) {
        triggerAlert("No items found in cart.", "error");
        return;
      }

      // Prepare order details
      const orderDetails = cartItems.map((item: CartItem) => ({
        P_id: item.P_id,
        OD_quantity: item.CA_quantity,
        OD_price: total,
        OD_product_name: item.Product.P_name,
        OD_product_price: item.Product.P_price,
      }));
      // console.log("test",cartItems)
      // console.log("test1",orderDetails)

      // Calculate total amount
      // const total = cartItems.reduce(
      //   (sum: number, item: CartItem) => sum + item.CA_price * item.CA_quantity,
      //   0
      // );
      console.log("tota",total)
      // Handle address submission (new or existing)
      const addressId: number = await handleAddressSubmission();

      // Handle file upload before submitting the order
      let payslipPath: string | null = null; // Initialize payslipPath

      if (selectedFile) {
        payslipPath = await uploadPayslip(selectedFile); // Get the file path
      } else {
        triggerAlert("Please upload a payslip.", "error");
        return;
      }

      console.log("pay:", payslipPath);

      // Check if payslipPath is null
      if (payslipPath === null) {
        triggerAlert("Failed to upload payslip. Please try again.", "error");
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

      // alert("Order successfully placed and cart cleared!");
      onSubmit(addressId); // Pass selected address and payment method
    } catch (error) {
      console.error("Error during checkout:", error);
      triggerAlert("Failed to complete checkout. Please try again.", "error");
    }
  };

  const submitOrder = async (
    customerId: number,
    addressId: number,
    orderDetails: CartItem[],  // Define orderDetails as an array of CartItem
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
      O_Description: null,
      orderDetails: orderDetails.map((item) => ({
        
        P_id: item.P_id,
        OD_quantity: item.CA_quantity,
        OD_price: item.OD_price,        // Price in cart or discounted price
        OD_product_name: item.OD_product_name,   // Product name at the time of order
        OD_product_price: item.OD_product_price, // Product price at the time of order
      })),
      
      
    };
  
  
    console.log("odt",orderDetails)
    await axios.post("http://localhost:3000/order", orderData);
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
          A_name: newAddress.name,
          A_phone: newAddress.phoneNumber,
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
          A_name: newAddress.name,
          A_phone: newAddress.phoneNumber,
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
                      {`${addr.A_name}, ${addr.A_phone}, ${addr.A_street}, ${addr.A_city}, ${addr.A_state}, ${addr.A_postalCode}, ${addr.A_country}`}
                    </MenuItem>
                  ))}
                </Select>
                <Button
                  onClick={handleShowNewAddressForm}
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
              <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth TransitionComponent={Transition}>
              <DialogTitle>CHECKOUT</DialogTitle>
              <DialogContent>
                <form onSubmit={handleSubmit(handleCheckoutSubmit)}>
                  <Grid container spacing={2}>
                    <Grid size={12}>
                      <Controller
                        name="name"
                        
                        control={control}
                        rules={{ required: 'Name is required' }}
                        render={({ field }) => (
                          <TextField
                            label="Name"
                            fullWidth
                            variant="outlined"
                            
                            // {...field}
                            error={!!errors.name}
                            helperText={errors.name?.message}
                            onBlur={() => trigger('name')}
                            onChange={(e) => {
                              field.onChange(e);
                              setNewAddress((prev) => ({ ...prev, name: e.target.value })); // Update newAddress state
                            }}
                          />
                        )}
                      />
                    </Grid>
      
                    <Grid size={12}>
                      <Controller
                        name="phoneNumber"
                        control={control}
                        rules={{
                          required: 'Phone number is required',
                          pattern: {
                            value: /^0[0-9]{9}$/, // Example: phone must start with 0 and have 10 digits
                            message: 'Phone number must start with 0 and be 10 digits long',
                          },
                        }}
                        render={({ field }) => (
                          <TextField
                            label="Phone"
                            fullWidth
                            variant="outlined"
                            // {...field}
                            error={!!errors.phoneNumber}
                            helperText={errors.phoneNumber?.message}
                            onBlur={() => trigger('phoneNumber')}
                            onChange={(e) => {
                              field.onChange(e);
                              setNewAddress((prev) => ({ ...prev, phoneNumber: e.target.value })); // Update newAddress state
                            }}
                          />
                        )}
                      />
                    </Grid>
      
                    <Grid size={12}>
                      <Controller
                        name="street"
                        control={control}
                        rules={{ required: 'Street is required' }}
                        render={({ field }) => (
                          <TextField
                            label="Street"
                            fullWidth
                            variant="outlined"
                            // {...field}
                            error={!!errors.street}
                            helperText={errors.street?.message}
                            onBlur={() => trigger('street')}
                            onChange={(e) => {
                              field.onChange(e);
                              setNewAddress((prev) => ({ ...prev, street: e.target.value })); // Update newAddress state
                            }}
                          />
                        )}
                      />
                    </Grid>
      
                    <Grid size={12}>
                      <Controller
                        name="city"
                        control={control}
                        rules={{ required: 'City is required' }}
                        render={({ field }) => (
                          <TextField
                            label="City"
                            fullWidth
                            variant="outlined"
                            // {...field}
                            error={!!errors.city}
                            helperText={errors.city?.message}
                            onBlur={() => trigger('city')}
                            onChange={(e) => {
                              field.onChange(e);
                              setNewAddress((prev) => ({ ...prev, city: e.target.value })); // Update newAddress state
                            }}
                          />
                        )}
                      />
                    </Grid>
      
                    <Grid size={12}>
                      <Controller
                        name="state"
                        control={control}
                        rules={{ required: 'State is required' }}
                        render={({ field }) => (
                          <TextField
                            label="State"
                            fullWidth
                            variant="outlined"
                            // {...field}
                            error={!!errors.state}
                            helperText={errors.state?.message}
                            onBlur={() => trigger('state')}
                            onChange={(e) => {
                              field.onChange(e);
                              setNewAddress((prev) => ({ ...prev, state: e.target.value })); // Update newAddress state
                            }}
                          />
                        )}
                      />
                    </Grid>
      
                    <Grid size={12}>
                      <Controller
                        name="postalCode"
                        control={control}
                        rules={{ required: 'Postal code is required' }}
                        render={({ field }) => (
                          <TextField
                            label="Postal Code"
                            fullWidth
                            variant="outlined"
                            // {...field}
                            error={!!errors.postalCode}
                            helperText={errors.postalCode?.message}
                            onBlur={() => trigger('postalCode')}
                            onChange={(e) => {
                              field.onChange(e);
                              setNewAddress((prev) => ({ ...prev, postalCode: e.target.value })); // Update newAddress state
                            }}
                          />
                        )}
                      />
                    </Grid>
      
                    <Grid size={12}>
                      <Controller
                        name="country"
                        control={control}
                        rules={{ required: 'Country is required' }}
                        render={({ field }) => (
                          <TextField
                            label="Country"
                            fullWidth
                            variant="outlined"
                            // {...field}
                            error={!!errors.country}
                            helperText={errors.country?.message}
                            onBlur={() => trigger('country')}
                            onChange={(e) => {
                              field.onChange(e);
                              setNewAddress((prev) => ({ ...prev, country: e.target.value })); // Update newAddress state
                            }}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
      
                  <DialogActions>
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

                  </DialogActions>
                </form>
              </DialogContent>
            </Dialog>
            )}
            <Snackbar
              open={showAlert}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
              <Alert
                severity={alertSeverity}
                onClose={() => setShowAlert(false)}
              >
                {alertMessage}
              </Alert>
            </Snackbar>
          
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
