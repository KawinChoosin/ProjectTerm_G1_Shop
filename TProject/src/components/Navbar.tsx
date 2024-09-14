import React from 'react';
import { Button, IconButton } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCartOutlined';
import PersonIcon from '@mui/icons-material/PersonOutline';
import FavoriteIcon from '@mui/icons-material/FavoriteBorderOutlined';


const Navbar: React.FC = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row', // Arrange children in a column
      alignItems: 'center',    // Center items horizontally
      width: '100%',
      height: '140px',
      backgroundColor: '#BDBDBE',
      padding: '0 20px',
      position: 'absolute',
      top: 0,
      left: 0,
      boxSizing: 'border-box',
      zIndex: 20,
      overflow: 'hidden', // Ensure content doesn’t overflow
    }}>
  <div style={{ 
        fontFamily: "Syncopate", 
        fontSize: "64px", 
        color: "#161A30",
        marginBottom: '10px', // Space below the title
        marginRight:"30px"
    }}>
    KAD-ENT
  </div>
  <div style={{
        display: 'flex',
        flexDirection: 'row', // Stack buttons vertically
        alignItems: 'center',
        gap: '30px', // Space between buttons
    }}>
    <Button variant="text" sx={{ fontFamily: "Ruda", color: '#161A30', fontSize: "25px" }}>
      HOME
    </Button>
    <Button variant="text" sx={{ fontFamily: "Ruda", color: '#161A30', fontSize: "25px" }}>
      ABOUT
    </Button>
    <Button variant="text" sx={{ fontFamily: "Ruda", color: '#161A30', fontSize: "25px" }}>
      CONTACT
    </Button>
  </div>
  <div style={{
        display: 'flex',
        flexDirection: 'row', // Stack icons vertically
        alignItems: 'center', 
        position: 'absolute', // Positioning to place it at the end
        right: '20px', // Offset from the right edge
        gap: '10px', // Space between icons
    }}>
    <IconButton>
      <ShoppingCartIcon sx={{ color: '#161A30',fontSize:"40px" }} />
    </IconButton>
    <IconButton>
      <PersonIcon sx={{ color: '#161A30',fontSize:"40px"  }} />
    </IconButton>
    <IconButton>
      <FavoriteIcon sx={{ color: '#161A30',fontSize:"40px"  }} />
    </IconButton>
  </div>
</div>

  );
};

export default Navbar;
