import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
import axios from "axios";
import QR from "./Qr";
import PaymentForm from "./uploadfile"; // Import the new PaymentForm component

interface CheckoutDialogProps {
  open: boolean;
  onClose: () => void;
  total: number;
  addresses: string[];
  customerId: number;
}

const theme = createTheme({
  typography: {
    fontFamily: "Montserrat, sans-serif",
  },
});

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CheckoutDialog: React.FC<CheckoutDialogProps> = ({
  open,
  onClose,
  total,
  addresses,
  customerId,
}) => {
  const [address, setAddress] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (open) {
      setAddress("");
      setSelectedFile(null); // Reset selected file when dialog opens
    }
  }, [open]);

  const handleFileUpload = (file: File | null) => {
    setSelectedFile(file);
  };

  const handleCheckoutSubmit = async () => {
    // Check if a file is selected before proceeding
    if (!selectedFile) {
      alert("Please upload a slip before confirming checkout.");
      return; // Exit the function if no file is selected
    }

    const formData = new FormData();
    formData.append("slip", selectedFile);
    formData.append("PM_amount", total.toString());
    formData.append("Date_time", new Date().toISOString());

    try {
      const response = await axios.post(
        "http://localhost:3000/order/payments",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Payment uploaded", response.data);
      // Optionally handle success (e.g., show a message or reset form)
    } catch (error) {
      console.error("Error uploading payment", error);
      // Optionally handle error (e.g., show an error message)
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

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              <QR amount={total} />
              <h3>TOTAL: {total}</h3>
              <PaymentForm total={total} onFileUpload={handleFileUpload} /> {/* Pass handler */}
            </div>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} sx={{ color: "#db4237" }}>
            Cancel
          </Button>
          <Button
            onClick={handleCheckoutSubmit} // Call submit handler
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
