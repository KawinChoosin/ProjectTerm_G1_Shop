import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CircularProgress, Typography } from "@mui/material";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get the product ID from the route
  const [product, setProduct] = useState<any | null>(null); // State to hold product details
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const [quantity, setQuantity] = useState(0);
  const navigate = useNavigate();

  // Fetch the product details by ID
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/products/${id}`
        );
        setProduct(response.data); // Set the fetched product data
        setLoading(false); // Turn off loading
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError("Error fetching product details");
        setLoading(false); // Turn off loading
      }
    };

    fetchProductDetails();
  }, [id]); // Run when the component mounts or when the ID changes

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <Typography variant="h6" color="error">
          Product not found
        </Typography>
      </div>
    );
  }

  const increaseQuantity = () => {
    if (quantity < (product?.P_quantity ?? 1)) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = async () => {
    if (quantity < 1) {
      alert("Please select a valid quantity");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/cart/add", {
        C_id: 1, // Replace with actual customer ID
        P_id: product.P_id,
        CA_quantity: quantity,
        CA_price: product.P_price,
      });

      if (response.status === 200) {
        alert(`Added ${quantity} ${product?.P_name} to cart!`);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add product to cart");
    }
  };

  const handleAddToFav = () => {
    alert(`Added ${product?.P_name} to favourite!`);
    // navigate("/fav", {
    //   state: {
    //     P_id: product.P_id,
    //     P_name: product.P_name,
    //     P_price: product.P_price,
    //   },
    // });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        maxWidth: "100%",
        padding: "0",
        margin: "0",
      }}
    >
      {/* header */}
      <Navbar />

      <section
        style={{
          display: "flex",
          padding: "2rem",
          justifyContent: "center",
          marginTop: "140px",
        }}
      >
        <div style={{ flex: 1 }}>
          <img
            src={product.P_img}
            alt={product?.P_name}
            style={{
              width: "100%",
              height: "auto",
              objectFit: "cover",
              borderRadius: "0.5rem",
            }}
          />
        </div>
        <div style={{ flex: 0.05 }}></div>
        <div
          style={{
            flex: 2,
            backgroundColor: "#f4f4f4",
            padding: "1.5rem",
            borderRadius: "0.5rem",
          }}
        >
          <Typography variant="h4" gutterBottom>
            {product.P_name}
          </Typography>
          <Typography variant="h5" color="red" gutterBottom>
            ฿{product.P_price}
          </Typography>
          <p
            style={{
              color:
                product?.P_quantity && product.P_quantity > 0 ? "green" : "red",
            }}
          >
            {product?.P_quantity && product.P_quantity > 0
              ? "In Stock"
              : "Out of Stock"}
          </p>

          {/* Quantity and Add to Cart Button */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              margin: "1.5rem 0",
            }}
          >
            <button
              onClick={decreaseQuantity}
              style={{
                padding: "0.5rem 1rem",
                fontSize: "1rem",
                cursor: "Pointer",
                border: "2px solid #2A2927",
                borderRadius: "0.25rem",
              }}
            >
              -
            </button>
            <span style={{ margin: "0 1rem", fontSize: "1.2rem" }}>
              {quantity}
            </span>
            <button
              onClick={increaseQuantity}
              style={{
                padding: "0.5rem 1rem",
                border: "2px solid #2A2927",
                borderRadius: "0.25rem",
                fontSize: "1rem",
                cursor: "Pointer",
              }}
            >
              +
            </button>
            <button
              onClick={handleAddToCart}
              style={{
                marginLeft: "1.5rem",
                padding: "0.5rem 1rem",
                backgroundColor: "#282828",
                color: "white",
                borderRadius: "0.25rem",
                cursor: quantity < 1 ? "not-allowed" : "pointer",
              }}
            >
              Add to cart
            </button>
          </div>
          <div>
            <button
              onClick={handleAddToFav}
              style={{
                padding: "0.3rem 0.3rem",
                border: "2px solid #2A2927",
                backgroundColor: "#ff9966",
                color: "#2A2927",
                borderRadius: "0.5rem",
                fontSize: "0.7rem",
                cursor: "Pointer",
              }}
            >
              ❤ Add to favourite
            </button>
          </div>
        </div>
      </section>

      {/* Description Section */}
      <section
        style={{
          padding: "1.5rem",
          borderTop: "1px solid #C0C0C0",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Description:
        </Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          {product.P_description}
        </Typography>
      </section>

      {/* footer */}
      <Footer />
    </div>
  );
};

export default ProductDetail;
