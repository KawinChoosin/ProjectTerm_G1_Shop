import React from 'react';
import { Button, Card, CardContent, Typography, Divider, Box } from '@mui/material';

interface CartTotalsProps {
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
}

const CartTotals: React.FC<CartTotalsProps> = ({ subtotal, shipping, discount, total }) => {
  return (
    <Box p={2} sx={{ border: '1px solid #e0e0e0', borderRadius: '8px' }}>
      <Typography variant="h6" component="div" gutterBottom fontWeight="500" sx={{ mb: 2 }}>
        Cart Totals
      </Typography>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="body1" color="text.secondary">
          Subtotal
        </Typography>
        <Typography variant="body1">${subtotal.toFixed(2)}</Typography>
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="body1" color="text.secondary">
          Shipping
        </Typography>
        <Typography variant="body1">${shipping.toFixed(2)}</Typography>
      </Box>
      <Box display="flex" justifyContent="space-between" color="error.main">
        <Typography variant="body1" color="text.secondary">
          Discount
        </Typography>
        <Typography variant="body1">- ${discount.toFixed(2)}</Typography>
      </Box>
      <Divider sx={{ my: 2 }} />
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h6" fontWeight="500">
          Total
        </Typography>
        <Typography variant="h6" fontWeight="500">${total.toFixed(2)}</Typography>
      </Box>

      <Button
        variant="outlined"
        sx={{
          width: '100%',
          mt: 2,
          color: '#000',
          borderColor: '#000',
          '&:hover': {
            backgroundColor: '#000',
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
