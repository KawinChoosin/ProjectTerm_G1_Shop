import React from 'react';
import { Button, Typography, IconButton, Box } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';

interface CartItemProps {
  item: {
    P_name: string;
    P_description: string;
    P_price: number;
    CA_quantity: number;
    P_img: string;
  };
  onQuantityChange: (newQuantity: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onQuantityChange }) => {
  const handleIncrease = () => {
    onQuantityChange(item.CA_quantity + 1);
  };

  const handleDecrease = () => {
    if (item.CA_quantity > 1) {
      onQuantityChange(item.CA_quantity - 1);
    }
  };

  return (
    <Box mb={2} p={2} display="flex" justifyContent="space-between" alignItems="center" borderBottom={1} borderColor="#e0e0e0" sx={{ borderColor: '#e0e0e0', borderBottomWidth: '1px' }}>
      <Box display="flex" alignItems="center">
        <img
          src={item.P_img || '/placeholder.png'}
          alt={`${item.P_name} image`}
          style={{ width: '80px', height: '80px', objectFit: 'cover', marginRight: '16px', borderRadius: '4px' }}
        />
        <Box>
          <Typography variant="h6" fontWeight="500">{item.P_name}</Typography>
          <Typography variant="body2" color="textSecondary">
            {item.P_description}
          </Typography>
          <Box display="flex" alignItems="center" mt={1}>
            <IconButton onClick={handleDecrease} disabled={item.CA_quantity <= 1} size="small" sx={{ border: '1px solid #000', borderRadius: '4px', color: '#000' }}>
              <Remove />
            </IconButton>
            <Typography sx={{ margin: '0 10px' }}>{item.CA_quantity}</Typography>
            <IconButton onClick={handleIncrease} size="small" sx={{ border: '1px solid #000', borderRadius: '4px', color: '#000' }}>
              <Add />
            </IconButton>
          </Box>
        </Box>
      </Box>
      <Typography variant="h6" align="right" fontWeight="500">
        ${(item.CA_quantity * item.P_price).toFixed(2)}
      </Typography>
    </Box>
  );
};

export default CartItem;
