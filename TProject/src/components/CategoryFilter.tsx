import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

const CategoryFilter: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // State to keep track of the selected category
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  useEffect(() => {
    // Set selectedCategory based on the current route
    const path = location.pathname;
    if (path === '/sport') {
      setSelectedCategory('sport');
    } else if (path === '/cloth') {
      setSelectedCategory('cloth');
    } else if (path === '/electronic') {
      setSelectedCategory('electronic');
    } else {
      setSelectedCategory('/');
    }
  }, [location.pathname]);

  const handleClick = (category: string) => {
    setSelectedCategory(category);
    if(category!="all"){navigate(`/${category}`);}else{navigate("/");}
    
  };

  return (
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
            textDecorationThickness: '3px', // Slightly thicker underline on hover
            textUnderlineOffset: '10px', // Slightly more space between text and underline on hover
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
          textDecoration: selectedCategory === 'sport' ? 'underline' : 'none',
          textDecorationColor: selectedCategory === 'sport' ? '#161A30' : 'transparent',
          textDecorationThickness: '2px',
          textUnderlineOffset: '8px',
          '&:hover': {
            textDecorationThickness: '3px', // Slightly thicker underline on hover
            textUnderlineOffset: '10px', // Slightly more space between text and underline on hover
          },
        }}
        onClick={() => handleClick('sport')}
      >
        SPORTS
      </Button>
      <Button
        variant="text"
        sx={{
          fontFamily: "Ruda",
          color: '#161A30',
          fontSize: "25px",
          textDecoration: selectedCategory === 'cloth' ? 'underline' : 'none',
          textDecorationColor: selectedCategory === 'cloth' ? '#161A30' : 'transparent',
          textDecorationThickness: '2px',
          textUnderlineOffset: '8px',
          '&:hover': {
            textDecorationThickness: '3px', // Slightly thicker underline on hover
            textUnderlineOffset: '10px', // Slightly more space between text and underline on hover
          },
        }}
        onClick={() => handleClick('cloth')}
      >
        CLOTH
      </Button>
      <Button
        variant="text"
        sx={{
          fontFamily: "Ruda",
          color: '#161A30',
          fontSize: "25px",
          textDecoration: selectedCategory === 'electronic' ? 'underline' : 'none',
          textDecorationColor: selectedCategory === 'electronic' ? '#161A30' : 'transparent',
          textDecorationThickness: '2px',
          textUnderlineOffset: '8px',
          '&:hover': {
            textDecorationThickness: '3px', // Slightly thicker underline on hover
            textUnderlineOffset: '10px', // Slightly more space between text and underline on hover
          },
        }}
        onClick={() => handleClick('electronic')}
      >
        ELECTRONIC
      </Button>
    </div>
  );
};

export default CategoryFilter;
