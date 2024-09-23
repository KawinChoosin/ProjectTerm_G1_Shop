import React from 'react';
import { Button, Typography, Divider, Box } from '@mui/material';

interface CartTotalsProps {
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
}

const CartTotals: React.FC<CartTotalsProps> = ({ subtotal, shipping, discount, total }) => {
  return (
    <Box p={5} sx={{backgroundColor: '#f9f9f9' }}>
      <Typography variant="h6" gutterBottom fontWeight="bold">
        SUMMARY
      </Typography>
      <Box display="flex" justifyContent="space-between" pt={1}>
        <Typography variant="body1">Subtotal</Typography>
        <Typography variant="body1">${subtotal.toFixed(2)}</Typography>
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="body1">Shipping</Typography>
        <Typography variant="body1">${shipping.toFixed(2)}</Typography>
      </Box>
      <Box display="flex" justifyContent="space-between" color="error.main">
        <Typography variant="body1">Discount</Typography>
        <Typography variant="body1">- ${discount.toFixed(2)}</Typography>
      </Box>
      <Divider sx={{ my: 2 }} />
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h6" fontWeight="500">Total</Typography>
        <Typography variant="h6" fontWeight="500">${total.toFixed(2)}</Typography>
      </Box>

      <Button
        variant="contained"
        sx={{
          width: '100%',
          mt: 2,
          backgroundColor: '#f0f0f0',
          color: '#000',
          '&:hover': {
            backgroundColor: '#596fb7',
            color: '#fff',
          },
        }}
      >
        Proceed to Checkout
      </Button>
    </Box>
  );
};

export default CartTotals;
