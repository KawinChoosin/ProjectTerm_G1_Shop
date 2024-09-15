import React from 'react';
import { Button, IconButton } from '@mui/material';
import useScreenSize from './useScreenSize';

const Navbar: React.FC = () => {
  const screenSize = useScreenSize();
  const isMobile = screenSize.width < 900;

  if (!isMobile) {
    // Render for desktop view
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: '140px',
        backgroundColor: '#bcd2ee',
        padding: '0 20px',
        position: 'absolute',
        top: 0,
        left: 0,
        boxSizing: 'border-box',
        zIndex: 20,
        overflow: 'hidden',
      }}>
        <div style={{
          fontFamily: "Syncopate",
          fontSize: "calc(1.5rem + 2vw)", // Responsive font size
          color: "#161A30",
          marginBottom: '10px',
          marginRight: "30px"
        }}>
          KAD-ENT
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '30px',
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
          flexDirection: 'row',
          alignItems: 'center',
          position: 'absolute',
          right: '20px',
          gap: '10px',
        }}>
          <IconButton sx={{ mb: "5px" }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" fill="#161A30" className="bi bi-cart2" viewBox="0 0 16 16">
              <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5M3.14 5l1.25 5h8.22l1.25-5zM5 13a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0m9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0"/>
            </svg>
          </IconButton>
          <IconButton>
            <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" fill="#161A30" className="bi bi-person" viewBox="0 0 16 16">
              <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
            </svg>
          </IconButton>
          <IconButton>
            <svg xmlns="http://www.w3.org/2000/svg" width="27px" height="27px" fill="#161A30" className="bi bi-heart" viewBox="0 0 16 16">
              <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15"/>
            </svg>
          </IconButton>
        </div>
      </div>
    );
  } else {
    // Render for mobile view
    return (
      <>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '120px',
          backgroundColor: '#bcd2ee',
          textAlign: 'center',
          position: 'absolute',
          boxSizing: 'border-box',
          zIndex: 2,
        }}>
          <div style={{
            fontFamily: "Syncopate",
            fontSize: "calc(1.5rem + 2vw)", // Responsive font size
            color: "#161A30",
            marginBottom: '10px',
            marginRight: "30px",
          }}>
            KAD-ENT
          </div>
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '30px',
          padding: '10px 0',
          backgroundColor: '#BDBD33',
          position: 'relative',
          top: '120px',
          zIndex: 20,
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
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '30px',
          padding: '10px 0',
          backgroundColor: '#bebebe',
          position: 'relative',
          top: '120px',
          zIndex: 20,
        }}>
          <IconButton sx={{ mb: "5px" }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" fill="#161A30" className="bi bi-cart2" viewBox="0 0 16 16">
              <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5M3.14 5l1.25 5h8.22l1.25-5zM5 13a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0m9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0"/>
            </svg>
          </IconButton>
          <IconButton>
            <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" fill="#161A30" className="bi bi-person" viewBox="0 0 16 16">
              <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
            </svg>
          </IconButton>
          <IconButton>
            <svg xmlns="http://www.w3.org/2000/svg" width="27px" height="27px" fill="#161A30" className="bi bi-heart" viewBox="0 0 16 16">
              <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15"/>
            </svg>
          </IconButton>
        </div>
      </>
    );
  }
};

export default Navbar;
