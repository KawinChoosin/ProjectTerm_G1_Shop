import React from 'react';
import { Box, Typography } from '@mui/material';

function Footer() {
  return (

    <Box
      sx={{
        width: '100%',
        height: '170px',
        background: '#BDBDBE',
        boxSizing: 'border-box',
        padding: '0 20px',
        mt:"10%",
        display: 'flex',
        flexDirection: 'column', // Stack children vertically
        justifyContent: 'flex-end', // Align children at the bottom
        zIndex: 10, // Ensure footer is behind the navbar
      }}
    >
      <Typography
        sx={{
         fontFamily: "Ruda", color: '#666666', fontSize: "20px" ,
          fontWeight: 'light',
          padding: '30px ', // Margin at the bottom
        }}
      >
        Copyrights © 2024 All Rights Reserved by KADENT
      </Typography>
    </Box>
  
  );
}

export default Footer;
