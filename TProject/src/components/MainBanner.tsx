import React from 'react';
import { Box } from '@mui/material';

interface MainBannerProps {
  mainpic: string;
  Topic: string;
  Detail: string;
}

const MainBanner: React.FC<MainBannerProps> = ({ mainpic, Topic, Detail }) => (
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
          color: 'white',
          textShadow: '0 0 10px rgba(255, 255, 255, 0.8)', // White glow effect
        }}
      >
        {Topic}
      </Box>
      {/* <Box sx={{ color: "#fff", mb: '20px' }}>
        <Button
          variant="contained"
          color='success'
          sx={{
            color: "#fff",
            borderColor: '#161A30',
            width: "180px",
            fontSize: "20px",
            boxShadow: '0 0 15px rgba(0, 255, 0, 0.6)', // Green glow effect
            '&:hover': {
              boxShadow: '0 0 20px rgba(0, 255, 0, 0.8)', // Brighter green glow on hover
            },
          }}
        >
          CHECK NOW
        </Button>
      </Box> */}
      <Box
        sx={{
          fontSize: '30px',
          fontWeight: 'Regular',
          color: "#F4F5FF",
          width: "500px",
          margin: '0 auto',
          textShadow: '0 0 5px rgba(255, 255, 255, 0.5)', // Subtle white glow for the description
        }}
      >
        {Detail}
      </Box>
    </Box>
  </Box>
);

export default MainBanner;
