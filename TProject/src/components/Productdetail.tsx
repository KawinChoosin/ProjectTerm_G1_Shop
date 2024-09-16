import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CircularProgress, Typography, Container } from '@mui/material';
import axios from 'axios';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get the product ID from the route
  const [product, setProduct] = useState<any | null>(null); // State to hold product details
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  // Fetch the product details by ID
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/products/${id}`);
        setProduct(response.data); // Set the fetched product data
        setLoading(false); // Turn off loading
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError('Error fetching product details');
        setLoading(false); // Turn off loading
      }
    };

    fetchProductDetails();
  }, [id]); // Run when the component mounts or when the ID changes

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <Typography variant="h6" color="error">{error}</Typography>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <Typography variant="h6" color="error">Product not found</Typography>
      </div>
    );
  }

  return (
    <Container style={{ padding: '20px', textAlign: 'center' }}>
      <img 
        src={product.P_img} 
        alt={product.P_name} 
        style={{ width: '100%', maxHeight: '400px', objectFit: 'contain', marginBottom: '20px' }} 
      />
      <Typography variant="h4" gutterBottom>{product.P_name}</Typography>
      <Typography variant="body1" color="textSecondary" gutterBottom>{product.P_description}</Typography>
      <Typography variant="h6" color="primary" gutterBottom>Price: ${product.P_price}</Typography>
      <Typography variant="body1">Quantity Available: {product.P_quantity}</Typography>
    </Container>
  );
};

export default ProductDetail;
