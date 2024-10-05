import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import MainBanner from "./components/MainBanner";
import ProductGrid from "./components/ProductGrid";
import { Container, Typography, Button, Fab } from "@mui/material";
import Footer from "./components/Footer";
import axios from "axios";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useLocation } from "react-router-dom";
import LoadingCompo from "./components/loading";

const App: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]); // Add state for categories
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | string>("all"); // Change to store category ID
  const location = useLocation();
  const { C_id } = location.state || {};

  // Fetch products from the backend API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/products");
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Error fetching products");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Fetch categories from the backend API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:3000/categories");
        setCategories([{ CG_id: "all", CG_name: "ALL" }, ...response.data]); // Include "ALL" category
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Error fetching categories");
      }
    };

    fetchCategories();
  }, [selectedCategory]);

  const handleClick = (categoryId: number | string) => {
    setSelectedCategory(categoryId);
  };

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((product) => product.CG_id === selectedCategory);

  const handleScrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (loading) {
    return <LoadingCompo />;
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
      <Navbar />
      <MainBanner keyType={selectedCategory} />
      <Container>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: "30px",
          }}
        >
          {/* Map categories dynamically */}
          {categories.map((category) => (
            <Button
              key={category.CG_id}
              variant="text"
              sx={{
                fontFamily: "Ruda",
                color: "#161A30",
                fontSize: "25px",
                textDecoration:
                  selectedCategory === category.CG_id ? "underline" : "none",
                textDecorationColor:
                  selectedCategory === category.CG_id ? "#161A30" : "transparent",
                textDecorationThickness: "2px",
                textUnderlineOffset: "8px",
                "&:hover": {
                  textDecorationThickness: "3px",
                  textUnderlineOffset: "10px",
                },
              }}
              onClick={() => handleClick(category.CG_id)}
            >
              {category.CG_name.toUpperCase()}
            </Button>
          ))}
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
          position: "fixed",
          bottom: "7%",
          right: "7%",
        }}
      >
        <KeyboardArrowUpIcon />
      </Fab>

      <Footer />
    </div>
  );
};

export default App;
