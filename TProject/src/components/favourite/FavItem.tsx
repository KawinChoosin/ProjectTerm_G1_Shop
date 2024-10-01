import React from "react";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";
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
    <Link
      to={`/products/${item.P_id}`}
      style={{ color: "inherit", textDecoration: "none" }}
    >
      <Card
        variant="outlined"
        sx={{
          width: "200px",
          height: "400px",
          border: "2px solid #ddd",
          borderRadius: "10px",
          boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
          transition: "transform 0.3s ease-in-out",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          "&:hover": {
            transform: "scale(1.03)",
            boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.3)",
          },
        }}
      >
        <CardMedia
          component="img"
          height="100%"
          image={item.P_img}
          alt={item.P_name}
          sx={{
            objectFit: "contain",
            maxHeight: "330px",
            width: "100%",
          }}
        />
        <CardContent sx={{ padding: "10%" }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            {item.P_name}
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            {item.P_description}
          </Typography>
          <Typography variant="h6" sx={{ mb: 2 }}>
            ฿ {parseFloat(item.P_price).toFixed(2)}
          </Typography>
        </CardContent>
      </Card>
    </Link>
  );
};

export default FavItem;
