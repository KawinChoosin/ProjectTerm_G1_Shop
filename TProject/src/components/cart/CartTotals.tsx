import React from 'react';
import { Button, Typography, Divider, Box } from '@mui/material';

interface CartTotalsProps {
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  onCheckout: () => void; // Prop for handling checkout button click
}

const CartTotals: React.FC<CartTotalsProps> = ({ subtotal, shipping, discount, total, onCheckout }) => {
  return (
    <Box p={5} sx={{ backgroundColor: '#f9f9f9' }}>
      <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ fontFamily: 'Montserrat' }}>
        SUMMARY
      </Typography>
      <Box display="flex" justifyContent="space-between" pt={1}>
        <Typography variant="body1" sx={{ fontFamily: 'Montserrat' }}>Subtotal</Typography>
        <Typography variant="body1" sx={{ fontFamily: 'Montserrat' }}>${subtotal.toFixed(2)}</Typography>
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="body1" sx={{ fontFamily: 'Montserrat' }}>Shipping</Typography>
        <Typography variant="body1" sx={{ fontFamily: 'Montserrat' }}>${shipping.toFixed(2)}</Typography>
      </Box>
      <Box display="flex" justifyContent="space-between" color="#db4237">
        <Typography variant="body1" sx={{ fontFamily: 'Montserrat' }}>Discount</Typography>
        <Typography variant="body1" sx={{ fontFamily: 'Montserrat' }}>- ${discount.toFixed(2)}</Typography>
      </Box>
      <Divider sx={{ my: 2 }} />
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h6" fontWeight="500" sx={{ fontFamily: 'Montserrat' }}>Total</Typography>
        <Typography variant="h6" fontWeight="500" sx={{ fontFamily: 'Montserrat' }}>${total.toFixed(2)}</Typography>
      </Box>

      <Button
        variant="contained"
        onClick={onCheckout} // Ensure this function is passed correctly from parent
        sx={{
          fontFamily: 'Montserrat',
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
