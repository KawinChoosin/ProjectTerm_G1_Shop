import React from 'react';
import './loading.scss'; // Import your CSS file if needed

const Loading: React.FC = () => {
  return (
    <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh', // Full height of the viewport
      width: '100vw', // Full width of the viewport
      backgroundColor: '#222', // Black background
      position: 'fixed', // Fix the position to cover the screen
      top: 0, // Align to the top
      left: 0, // Align to the left
      zIndex: 1000, // Ensure it's on top of other elements
    }}
  >
    <div className="container">
      <div className="h1Container">
        <div className="cube h1 w1 l1">
          <div className="face top"></div>
          <div className="face left"></div>
          <div className="face right"></div>
        </div>
        <div className="cube h1 w1 l2">
          <div className="face top"></div>
          <div className="face left"></div>
          <div className="face right"></div>
        </div>
        <div className="cube h1 w1 l3">
          <div className="face top"></div>
          <div className="face left"></div>
          <div className="face right"></div>
        </div>
        <div className="cube h1 w2 l1">
          <div className="face top"></div>
          <div className="face left"></div>
          <div className="face right"></div>
        </div>
        <div className="cube h1 w2 l2">
          <div className="face top"></div>
          <div className="face left"></div>
          <div className="face right"></div>
        </div>
        <div className="cube h1 w2 l3">
          <div className="face top"></div>
          <div className="face left"></div>
          <div className="face right"></div>
        </div>
        <div className="cube h1 w3 l1">
          <div className="face top"></div>
          <div className="face left"></div>
          <div className="face right"></div>
        </div>
        <div className="cube h1 w3 l2">
          <div className="face top"></div>
          <div className="face left"></div>
          <div className="face right"></div>
        </div>
        <div className="cube h1 w3 l3">
          <div className="face top"></div>
          <div className="face left"></div>
          <div className="face right"></div>
        </div>
      </div>

      <div className="h2Container">
        <div className="cube h2 w1 l1">
          <div className="face top"></div>
          <div className="face left"></div>
          <div className="face right"></div>
        </div>
        <div className="cube h2 w1 l2">
          <div className="face top"></div>
          <div className="face left"></div>
          <div className="face right"></div>
        </div>
        <div className="cube h2 w1 l3">
          <div className="face top"></div>
          <div className="face left"></div>
          <div className="face right"></div>
        </div>
        <div className="cube h2 w2 l1">
          <div className="face top"></div>
          <div className="face left"></div>
          <div className="face right"></div>
        </div>
        <div className="cube h2 w2 l2">
          <div className="face top"></div>
          <div className="face left"></div>
          <div className="face right"></div>
        </div>
        <div className="cube h2 w2 l3">
          <div className="face top"></div>
          <div className="face left"></div>
          <div className="face right"></div>
        </div>
        <div className="cube h2 w3 l1">
          <div className="face top"></div>
          <div className="face left"></div>
          <div className="face right"></div>
        </div>
        <div className="cube h2 w3 l2">
          <div className="face top"></div>
          <div className="face left"></div>
          <div className="face right"></div>
        </div>
        <div className="cube h2 w3 l3">
          <div className="face top"></div>
          <div className="face left"></div>
          <div className="face right"></div>
        </div>
      </div>

      <div className="h3Container">
        <div className="cube h3 w1 l1">
          <div className="face top"></div>
          <div className="face left"></div>
          <div className="face right"></div>
        </div>
        <div className="cube h3 w1 l2">
          <div className="face top"></div>
          <div className="face left"></div>
          <div className="face right"></div>
        </div>
        <div className="cube h3 w1 l3">
          <div className="face top"></div>
          <div className="face left"></div>
          <div className="face right"></div>
        </div>
        <div className="cube h3 w2 l1">
          <div className="face top"></div>
          <div className="face left"></div>
          <div className="face right"></div>
        </div>
        <div className="cube h3 w2 l2">
          <div className="face top"></div>
          <div className="face left"></div>
          <div className="face right"></div>
        </div>
        <div className="cube h3 w2 l3">
          <div className="face top"></div>
          <div className="face left"></div>
          <div className="face right"></div>
        </div>
        <div className="cube h3 w3 l1">
          <div className="face top"></div>
          <div className="face left"></div>
          <div className="face right"></div>
        </div>
        <div className="cube h3 w3 l2">
          <div className="face top"></div>
          <div className="face left"></div>
          <div className="face right"></div>
        </div>
        <div className="cube h3 w3 l3">
          <div className="face top"></div>
          <div className="face left"></div>
          <div className="face right"></div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Loading;
