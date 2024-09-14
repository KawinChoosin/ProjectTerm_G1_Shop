import React, { useState } from 'react';
import { Box, Card, CardContent, CardMedia, Typography, IconButton, Button, CardActions } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Grid from '@mui/material/Grid2';

// Define product type
interface Product {
  P_name: string;
  P_description: string;
  P_quantity: number;
  P_price: string;
  CG_id: number;
  P_img: string;
}

// Define props type
interface ProductGridProps {
  products: Product[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  // State to manage product quantities
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});

  // Handle quantity change
  const handleQuantityChange = (id: number, change: number) => {
    setQuantities((prevQuantities) => {
      const newQuantity = (prevQuantities[id] || 0) + change;
      return {
        ...prevQuantities,
        [id]: newQuantity >= 0 ? newQuantity : 0,
      };
    });
  };

  // Handle add to cart
  const handleAddToCart = (id: number) => {
    console.log(`Added product with id ${id} to cart with quantity ${quantities[id] || 0}`);
    // Implement cart logic here
  };

  return (
    <Grid container spacing={2} sx={{ mt: 4, justifyContent: 'center' }}>
      {products.map((product) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={product.CG_id}>
          <Card 
            sx={{ 
              width: "350px", 
              height: '550px',
              border: '2px solid #ddd', // Thicker border
              borderRadius: '10px', // Rounded corners
              boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)', // More shadow
              transition: 'transform 0.3s ease-in-out', // Smooth transition for hover effect
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between', // Ensures content is spaced evenly
              '&:hover': {
                transform: 'scale(1.03)', // Slightly scale up on hover
                boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.3)', // Enhance shadow on hover
              },
            }}
          >
            <CardMedia
              component="img"
              height="100%"
              image={product.P_img}
              alt={product.P_name}
              sx={{ 
                objectFit: 'contain', // Keeps aspect ratio
                maxHeight: '330px', // Ensures image doesn't exceed this height
                width: '100%', // Ensures image covers full width
             
              }} 
            />
            <CardContent sx={{ padding: "10%" }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                {product.P_name}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                {product.P_description}
              </Typography>
              <Typography variant="h6" sx={{ mb: 2 }}>
                ${product.P_price}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<ShoppingCartIcon />}
                onClick={() => handleAddToCart(product.CG_id)}
            
              >
                Add to Cart
              </Button>
            </CardContent>
            {/* <CardActions 
              sx={{ 
                height:"100px",
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: '10%', // Adds padding from the bottom
                marginTop: 'auto', // Pushes the actions to the bottom
              }}
            > */}
              {/* <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton onClick={() => handleQuantityChange(product.CG_id, -1)} size="small">
                  <RemoveIcon />
                </IconButton>
                <Typography variant="body2" sx={{ mx: 1 }}>
                  {quantities[product.CG_id] || 0}
                </Typography>
                <IconButton onClick={() => handleQuantityChange(product.CG_id, 1)} size="small">
                  <AddIcon />
                </IconButton>
              </Box> */}
              {/* <Button
                variant="contained"
                color="primary"
                startIcon={<ShoppingCartIcon />}
                onClick={() => handleAddToCart(product.CG_id)}
              >
                Add to Cart
              </Button>
            </CardActions> */}
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductGrid;
