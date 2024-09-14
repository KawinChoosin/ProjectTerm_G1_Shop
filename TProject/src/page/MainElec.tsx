import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import MainBanner from '../components/MainBanner';
import CategoryFilter from '../components/CategoryFilter';
import ProductGrid from '../components/ProductGrid';
import { Container, CircularProgress, Typography } from '@mui/material';
import Footer from "../components/Footer"
import mainpic from "../components/banner/elec.jpg";
import axios from 'axios';

const MainElec: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products from the backend API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/products');
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err); // Log the actual error
        setError('Error fetching products');
        setLoading(false);
      }
    };
  
    fetchProducts();
  }, []);

  // Group products by category
  const sportProducts = products.filter(product => product.CG_id === 1);
  const clothProducts = products.filter(product => product.CG_id === 2);
  const electronicProducts = products.filter(product => product.CG_id === 3);

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

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      maxWidth: '100%',
      padding: '0',
      margin: '0',
    }}>
      <Navbar />
      <MainBanner
        mainpic={mainpic}
        Topic="ALL Electronic YOU NEED HERE"
        Detail="Time to use your money"
      />
      <Container>
        <CategoryFilter />
        <ProductGrid products={electronicProducts} />
      </Container>
      <Footer />
    </div>
  );
};

export default MainElec;
