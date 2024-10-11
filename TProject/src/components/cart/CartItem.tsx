import React from "react";
import { Typography, IconButton, Box } from "@mui/material";
import { Add, Remove, Close } from "@mui/icons-material";
import "./cart.css";

interface CartItemProps {
  item: {
    P_name: string;
    P_description: string;
    P_price: string;
    CA_quantity: number;
    P_img: string;
    P_quantity: number;
  };
  onQuantityChange: (newQuantity: number) => void;
  onDelete: () => void;
}

const CartItem: React.FC<CartItemProps> = ({
  item,
  onQuantityChange,
  onDelete,
}) => {
  const realQuantity =
    item.CA_quantity > item.P_quantity ? item.P_quantity : item.CA_quantity;

  const handleIncrease = () => {
    if (realQuantity < item.P_quantity) {
      onQuantityChange(realQuantity + 1);
    }
  };

  const handleDecrease = () => {
    if (realQuantity > 1) {
      onQuantityChange(realQuantity - 1);
    }
  };

  const handleDelete = () => onDelete();

  return (
    <Box
      mb={2}
      p={2}
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      borderBottom="1px solid #e0e0e0"
    >
      <Box display="flex" alignItems="center" flex={1}>
        <img
          src={
            `${import.meta.env.VITE_APP_API_BASE_URL}/uploads/${item.P_img}` ||
            "/placeholder.png"
          }
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
            ฿{parseFloat(item.P_price)}
          </Typography>
        </Box>
      </Box>

      <Box display="flex" alignItems="center">
        <IconButton
          onClick={handleDecrease}
          disabled={realQuantity <= 1}
          size="small"
          sx={{ color: "#000" }}
        >
          <Remove />
        </IconButton>
        <Typography sx={{ margin: "0 10px" }}>{realQuantity}</Typography>
        <IconButton
          onClick={handleIncrease}
          disabled={realQuantity >= item.P_quantity} // Disable if max quantity reached
          size="small"
          sx={{ color: "#000" }}
        >
          <Add />
        </IconButton>
        <Typography
          variant="h6"
          align="right"
          fontWeight="500"
          sx={{ width: "100px", textAlign: "left" }}
        >
          ฿ {(parseFloat(item.P_price) * realQuantity).toFixed(2)}
        </Typography>
      </Box>

      <IconButton
        onClick={handleDelete}
        size="small"
        sx={{ marginLeft: "16px", color: "#888" }}
      >
        <Close />
      </IconButton>
    </Box>
  );
};

export default CartItem;
