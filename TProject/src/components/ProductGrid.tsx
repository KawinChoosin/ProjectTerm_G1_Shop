import React from 'react';
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
    <Grid
      container
      spacing={2} // Reduced spacing between items
      sx={{ mt: 4, justifyContent: 'center', alignItems: 'center' }} // Center the grid items
    >
      {products.map((product) => (
        <Grid
         
          size={{xs:12,sm:6,md:4,lg:3}} // Correct use of Grid item
          // Adjust column sizes based on screen width
          key={product.P_id}
          sx={{ display: 'flex', justifyContent: 'center' }} // Ensure products are centered within their grid item
        >
          {/* Wrap Card in Link to product detail page */}
          <Link to={`/products/${product.P_id}`} style={{ textDecoration: 'none' }}>
            <Card
              sx={{
                width: '270px',
                height: '400px',
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
                image={`http://localhost:3000/uploads/${product.P_img}`}
                alt={product.P_name}
                sx={{
                  height: '70%', // Image takes up 70% of card height
                  objectFit: 'cover', // Ensures the image fits within the card's width without distortion
                  width: '100%', // Make sure the image covers the width of the card
                }}
              />
              <CardContent sx={{ padding: '10%' }}>
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
