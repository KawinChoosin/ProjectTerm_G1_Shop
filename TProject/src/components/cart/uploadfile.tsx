import React from "react";
import {Box, Typography } from "@mui/material";

interface PaymentFormProps {
  total: number;
  onFileUpload: (file: File | null) => void; // Prop for file upload handler
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onFileUpload }) => {


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
     
      onFileUpload(file); // Call handler to update parent state
    }
  };

  return (
    <Box>
      <Typography variant="h6">Upload Payment Slip</Typography>
      <input type="file" accept="image/*" onChange={handleFileChange} />
    
    </Box>
  );
};

export default PaymentForm;
