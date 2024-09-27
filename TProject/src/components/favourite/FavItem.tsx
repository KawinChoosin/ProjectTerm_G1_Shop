import React from "react";
import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export interface FavItemProps {
  item: {
    P_id: number;
    P_name: string;
    P_description: string;
    P_price: string;
    P_img: string;
  };
}

const FavItem: React.FC<FavItemProps> = ({ item }) => {
  return (
    <Link to={`/products/${item.P_id}`} style={{ color: "inherit" }}>
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
        <Box display="flex" alignItems="center" width="100%">
          <img
            src={item.P_img || "/placeholder.png"}
            alt={`${item.P_name} image`}
            style={{
              width: "100px",
              height: "auto",
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
          </Box>

          <Typography
            variant="h6"
            align="right"
            fontWeight="500"
            sx={{ width: "100px", textAlign: "left" }}
          >
            ฿ {parseFloat(item.P_price).toFixed(2)}
          </Typography>
        </Box>
      </Box>
    </Link>
  );
};

export default FavItem;
