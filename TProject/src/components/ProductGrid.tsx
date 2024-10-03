import React, { useState } from 'react';
import { Box, Card, CardContent, CardMedia, Typography } from '@mui/material';
import { Link } from 'react-router-dom'; // Import Link from React Router
import Grid from '@mui/material/Grid2';

// Define product type (already defined)
export interface Product {
  P_id: number; // Unique Product ID
  P_name: string;
  P_description: string;
  P_quantity: number;
  P_price: string;
  CG_id: number;
  P_img: string;
}

// Define props type (already defined)
interface ProductGridProps {
  products: Product[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  return (
    <Grid container spacing={2} sx={{ mt: 4, justifyContent: 'center' }}>
      {products.map((product) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={product.P_id}>
          {/* Wrap Card in Link to product detail page */}
          <Link to={`/products/${product.P_id}`} style={{ textDecoration: 'none' }}>
            <Card 
              sx={{ 
                width: "350px", 
                height: '550px',
                border: '2px solid #ddd',
                borderRadius: '10px',
                boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
                transition: 'transform 0.3s ease-in-out',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                '&:hover': {
                  transform: 'scale(1.03)',
                  boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.3)',
                },
              }}
            >
              <CardMedia
                component="img"
                height="100%"
                image={product.P_img}
                alt={product.P_name}
                sx={{ 
                  objectFit: 'contain',
                  maxHeight: '330px',
                  width: '100%',
                  alignItems:"center",
                  justifyItems:"center"
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
              </CardContent>
            </Card>
          </Link>
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductGrid;
