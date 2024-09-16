import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import MainBanner from './components/MainBanner';
import ProductGrid from './components/ProductGrid';
import { Container, CircularProgress, Typography, Button, Fab } from '@mui/material';
import Footer from "./components/Footer";
import axios from 'axios';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const App: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all'); 

  // Fetch products from the backend API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/products');
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError('Error fetching products');
        setLoading(false);
      }
    };
  
    fetchProducts();
  }, []);

  const handleClick = (category: string) => {
    setSelectedCategory(category);
  };

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => {
        if (selectedCategory === 'sports') return product.CG_id === 1;
        if (selectedCategory === 'cloths') return product.CG_id === 2;
        if (selectedCategory === 'electronics') return product.CG_id === 3;
        return false;
      });

  const handleScrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

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
      <MainBanner keyType={selectedCategory} />
      <Container>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '30px',
        }}>
          <Button
            variant="text"
            sx={{
              fontFamily: "Ruda",
              color: '#161A30',
              fontSize: "25px",
              textDecoration: selectedCategory === 'all' ? 'underline' : 'none',
              textDecorationColor: selectedCategory === 'all' ? '#161A30' : 'transparent',
              textDecorationThickness: '2px',
              textUnderlineOffset: '8px',
              '&:hover': {
                textDecorationThickness: '3px',
                textUnderlineOffset: '10px',
              },
            }}
            onClick={() => handleClick('all')}
          >
            ALL
          </Button>
          <Button
            variant="text"
            sx={{
              fontFamily: "Ruda",
              color: '#161A30',
              fontSize: "25px",
              textDecoration: selectedCategory === 'sports' ? 'underline' : 'none',
              textDecorationColor: selectedCategory === 'sports' ? '#161A30' : 'transparent',
              textDecorationThickness: '2px',
              textUnderlineOffset: '8px',
              '&:hover': {
                textDecorationThickness: '3px',
                textUnderlineOffset: '10px',
              },
            }}
            onClick={() => handleClick('sports')}
          >
            SPORTS
          </Button>
          <Button
            variant="text"
            sx={{
              fontFamily: "Ruda",
              color: '#161A30',
              fontSize: "25px",
              textDecoration: selectedCategory === 'cloths' ? 'underline' : 'none',
              textDecorationColor: selectedCategory === 'cloths' ? '#161A30' : 'transparent',
              textDecorationThickness: '2px',
              textUnderlineOffset: '8px',
              '&:hover': {
                textDecorationThickness: '3px',
                textUnderlineOffset: '10px',
              },
            }}
            onClick={() => handleClick('cloths')}
          >
            CLOTHS
          </Button>
          <Button
            variant="text"
            sx={{
              fontFamily: "Ruda",
              color: '#161A30',
              fontSize: "25px",
              textDecoration: selectedCategory === 'electronics' ? 'underline' : 'none',
              textDecorationColor: selectedCategory === 'electronics' ? '#161A30' : 'transparent',
              textDecorationThickness: '2px',
              textUnderlineOffset: '8px',
              '&:hover': {
                textDecorationThickness: '3px',
                textUnderlineOffset: '10px',
              },
            }}
            onClick={() => handleClick('electronics')}
          >
            ELECTRONICS
          </Button>
        </div>

        {/* Product Grid */}
        <ProductGrid key={selectedCategory} products={filteredProducts} />
      </Container>

      {/* Scroll to Top Button */}
      <Fab 
        color="primary" 
        size="large" 
        aria-label="scroll back to top" 
        onClick={handleScrollTop}
        style={{ 
          position: 'fixed', 
          bottom: '7%', 
          right: '7%' 
        }}
      >
        <KeyboardArrowUpIcon />
      </Fab>
      
      <Footer />
    </div>
  );
};

export default App;
