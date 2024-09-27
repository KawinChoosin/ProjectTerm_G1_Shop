import React from 'react';
import { Button, Typography, IconButton, Box } from '@mui/material';
import { Add, Remove, Close } from '@mui/icons-material';
import './cart.css'

interface CartItemProps {
  item: {
    P_name: string;
    P_description: string;
    P_price: string;
    CA_quantity: number;
    P_img: string;
  };
  onQuantityChange: (newQuantity: number) => void;
  onDelete: () => void; // Added onDelete prop
}

const CartItem: React.FC<CartItemProps> = ({
  item,
  onQuantityChange,
  onDelete,
}) => {
  const handleIncrease = () => {
    onQuantityChange(item.CA_quantity + 1);
  };

  const handleDecrease = () => {
    if (item.CA_quantity > 1) {
      onQuantityChange(item.CA_quantity - 1);
    }
  };

  const handleDelete = () => {
    onDelete(); // Call the delete function passed as a prop
  };

  return (
    <Box
      mb={2}
      p={2}
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      borderBottom={1}
      borderColor="#e0e0e0"
      sx={{ borderColor: "#e0e0e0", borderBottomWidth: "1px" }}
    >
    <Box mb={2} p={2} display="flex" justifyContent="space-between" alignItems="center" borderBottom={1} borderColor="#e0e0e0">
      <Box display="flex" alignItems="center" width="100%">
        <img
          src={item.P_img || "/placeholder.png"}
          alt={`${item.P_name} image`}
          style={{
            width: "60px",
            height: "60px",
            objectFit: "cover",
            marginRight: "16px",
            borderRadius: "4px",
          }}
        />
        <Box flex="1">
          <Typography variant="h6" fontWeight="500">
            {item.P_name}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {item.P_description}
          </Typography>
          <Typography className="price" fontWeight="500">
            ${item.P_price.toFixed(2)}
          </Typography>

        </Box>

        <Box display="flex" alignItems="center">
          <IconButton
            onClick={handleDecrease}
            disabled={item.CA_quantity <= 1}
            size="small"
            sx={{ color: "#000" }}
          >
            <Remove />
          </IconButton>
          <Typography sx={{ margin: "0 10px" }}>{item.CA_quantity}</Typography>
          <IconButton
            onClick={handleIncrease}
            size="small"
            sx={{ color: "#000" }}
          >
            <Add />
          </IconButton>
        </Box>
        <Typography
          variant="h6"
          align="right"
          fontWeight="500"
          sx={{ width: "100px", textAlign: "left" }}
        >
          ฿ {parseFloat(item.P_price).toFixed(2)}
        </Typography>
        <IconButton
          onClick={handleDelete}
          size="small"
          sx={{ marginLeft: "16px", color: "#888" }}
        >
          <Close />
        </IconButton>
      </Box>
    </Box>
  );
};

export default CartItem;
