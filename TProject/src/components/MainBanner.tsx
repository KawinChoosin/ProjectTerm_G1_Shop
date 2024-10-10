import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import allpic from "./banner/image.png";
import sportpic from "./banner/sport.png";
import clothpic from "./banner/cloth.jpg";
import elecpic from "./banner/elec.jpg";

interface MainBannerProps {
  keyType: any; // Use 'keyType' instead of 'key' because 'key' is a reserved prop in React.
}

const MainBanner: React.FC<MainBannerProps> = ({ keyType }) => {
  const [mainpic, setMainPic] = useState<string>(allpic);
  const [Topic, setTopic] = useState<string>('Welcome to Our Store');
  const [Detail, setDetail] = useState<string>('Explore our variety of products including cloths, electronics, and sports equipment.');

  useEffect(() => {
    switch (keyType) {
      case 'cloths':
        setMainPic(clothpic);
        setTopic('Latest in Fashion');
        setDetail('Discover our wide range of trendy cloths for all seasons.');
        break;
      case 'electronics':
        setMainPic(elecpic);
        setTopic('Cutting-Edge Electronics');
        setDetail('Explore the latest and greatest in tech and gadgets.');
        break;
      case 'sports':
        setMainPic(sportpic);
        setTopic('Sports & Fitness Gear');
        setDetail('Gear up with our top-quality sports equipment.');
        break;
      default:
        setMainPic(allpic);
        setTopic('Welcome to Our Store');
        setDetail('Explore our variety of products including cloths, electronics, and sports equipment.');
        break;
    }
  }, [keyType]);

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '880px',
        overflow: 'hidden', // Ensures no overflow
      }}
    >
      <Box
        component="img"
        src={mainpic}
        alt="Main Pic"
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
      {/* Semi-transparent overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.5)', // Black color with 50% opacity
          zIndex: 1, // Ensure overlay is above image
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)', // Center horizontally and vertically
          color: 'white',
          fontFamily: 'Ruda',
          textAlign: 'center',
          zIndex: 2, // Ensure text is above overlay
        }}
      >
        <Box
          sx={{
            fontSize: '50px',
            fontWeight: 'Regular',
            mb: '10px',
            color: '#FFFF00',
            textShadow: '0 0 10px rgba(255, 255, 255, 0.2)', // White glow effect
          }}
        >
          {Topic}
        </Box>
        <Box
          sx={{
            fontSize: '30px',
            fontWeight: 'Regular',
            color: "#F4F5FF",
            width: "500px",
            margin: '0 auto',
             // Subtle white glow for the description
          }}
        >
          {Detail}
        </Box>
      </Box>
    </Box>
  );
};

export default MainBanner;
