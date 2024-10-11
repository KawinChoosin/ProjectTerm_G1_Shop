import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  CircularProgress,
  Snackbar,
  Typography,
  createSvgIcon,
  Alert, // Import alert
} from "@mui/material";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import useScreenSize from "./useScreenSize";
import UserContext from "../context/UserContext";

const ProductDetail: React.FC = () => {
  const { C_id } = useContext(UserContext);
  const { id } = useParams<{ id: string }>(); // Get the product ID from the route
  const [product, setProduct] = useState<any | null>(null); // State to hold product details
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const [quantity, setQuantity] = useState(0);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [fabColor, setFabColor] = useState<"default" | "secondary">("default");
  const screenSize = useScreenSize();
  const isMobile = screenSize.width < 900;
  const navigate = useNavigate(); // Use useNavigate for redirection
  const location = useLocation(); // To get the current URL
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<
    "success" | "error" | "warning" | "info"
  >("success");
  const [showAlert, setShowAlert] = useState(false); //set time to show alert

  // Fetch the product details by product ID
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/products/${id}`
        );
        const product = response.data;

        // Set the fetched product data
        setProduct(product);
        console.log(C_id);

        if (C_id) {
          const favoriteResponse = await axios.get(
            `http://localhost:3000/favourite/check/${product.P_id}`,
            {
              params: {
                C_id: C_id,
              },
            }
          );
          setIsLiked(favoriteResponse.data.isLiked);
          setFabColor(favoriteResponse.data.isLiked ? "secondary" : "default");
        }

        setLoading(false); // Turn off loading
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError("Error fetching product details");
        setLoading(false); // Turn off loading
      }
    };

    fetchProductDetails();
  }, [id]);
  // Run when the component mounts or when the ID or customer ID changes

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
      setQuantity((prev) => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 0) {
      setQuantity((prev) => Math.max(0, prev - 1));
    }
  };

  const triggerAlert = (
    message: string,
    severity: "success" | "error" | "warning" | "info"
  ) => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setShowAlert(true);

    // set time out = 5 sec for alert
    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  };

  const handleAddToCart = async () => {
    if (!C_id) {
      navigate("/login", { state: { from: location } });
      return;
    }

    if (quantity < 1) {
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/cart/add", {
        C_id: C_id,
        P_id: product.P_id,
        CA_quantity: quantity,
        CA_price: product.P_price,
      });

      console.log(response.data.CA_price);

      if (response.status === 200) {
        triggerAlert(
          `Added ${quantity} ${product?.P_name} to cart!`,
          "success"
        );
      }
    } catch (error) {
      console.error("Error adding to your cart:", error);
      triggerAlert("Failed to add product to your cart", "error");
    }
  };

  const handleToggleFav = async () => {
    if (!C_id) {
      navigate("/login", { state: { from: location } });
      return;
    }

    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    setFabColor(newIsLiked ? "secondary" : "default");

    try {
      if (newIsLiked) {
        const response = await axios.post(
          "http://localhost:3000/favourite/add",
          {
            C_id: C_id,
            P_id: product.P_id,
          }
        );
        if (response.status === 200) {
          triggerAlert(
            `Added ${product.P_name} to your favourites!`,
            "success"
          );
        }
      } else {
        const response = await axios.delete(
          "http://localhost:3000/favourite/remove",
          {
            data: {
              C_id: C_id,
              P_id: product.P_id,
            },
          }
        );
        if (response.status === 200) {
          triggerAlert(
            `Removed ${product.P_name} from your favourites!`,
            "success"
          );
        }
      }
    } catch (error) {
      console.error("Error managing favourites:", error);
      triggerAlert("Failed to manage your favourites", "error");

      setIsLiked(!newIsLiked); // Revert to previous state
      setFabColor(newIsLiked ? "default" : "secondary");
    }
  };

  const PlusIcon = createSvgIcon(
    // credit: plus icon from https://heroicons.com
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4.5v15m7.5-7.5h-15"
      />
    </svg>,
    "Plus"
  );

  const MinusIcon = createSvgIcon(
    // credit: minus icon from https://heroicons.com
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
    </svg>,
    "Minus"
  );

  if (!isMobile) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
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
            alignItems: "stretch",
          }}
        >
          <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <img
              src={`http://localhost:3000/uploads/${product.P_img}`}
              alt={product?.P_name}
              style={{
                width: "100%",
                height: "auto",
                objectFit: "contain",
                borderRadius: "0.5rem",
              }}
            />
          </div>
          <div style={{ flex: 0.4, height: "auto" }}></div>
          <div
            style={{
              flex: 2,
              backgroundColor: "#f4f4f4",
              padding: "1.5rem",
              borderRadius: "0.5rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              height: "100%",
              maxWidth: "50%",
              wordWrap: "break-word",
              overflowWrap: "break-word",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h4" gutterBottom>
                {product.P_name}
              </Typography>
              <Fab
                color={fabColor}
                onClick={handleToggleFav}
                size="small"
                aria-label="like"
              >
                <FavoriteIcon />
              </Fab>
            </div>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              {product.P_description}
            </Typography>
            <Typography variant="h5" color="red" gutterBottom>
              ฿{product.P_price}
            </Typography>
            <p
              style={{
                color:
                  product?.P_quantity && product.P_quantity > 0
                    ? "green"
                    : "red",
              }}
            >
              {product?.P_quantity && product.P_quantity > 0
                ? "In Stock: " + product.P_quantity
                : "Out of Stock"}
            </p>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                margin: "1.5rem 0",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginRight: "2rem",
                  border: "1px solid",
                  borderColor: "#027efa",
                  borderRadius: "4px",
                }}
              >
                <Button onClick={decreaseQuantity} sx={{ height: "40px" }}>
                  <MinusIcon />
                </Button>
                <TextField
                  variant="outlined"
                  value={quantity}
                  size="small"
                  error={quantity > product.P_quantity}
                  sx={{
                    height: "40px",
                    width: "50px",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 0,
                      "& fieldset": {
                        borderLeft: "1px solid #027efa",
                        borderRight: "1px solid #027efa",
                        borderTop: "none",
                        borderBottom: "none",
                      },
                      "&:hover fieldset": {
                        borderLeft: "1px solid #027efa",
                        borderRight: "1px solid #027efa",
                      },
                      "&.Mui-focused fieldset": {
                        borderLeft: "1px solid #027efa",
                        borderRight: "1px solid #027efa",
                      },
                    },
                    "& .MuiOutlinedInput-input": {
                      textAlign: "center",
                      color: quantity > product.P_quantity ? "red" : "inherit",
                    },
                  }}
                  onChange={(e) => {
                    const value = Math.max(
                      0,
                      parseInt(e.target.value, 10) || 0
                    );
                    setQuantity(value);
                  }}
                />
                <Button onClick={increaseQuantity} sx={{ height: "40px" }}>
                  <PlusIcon />
                </Button>
              </Box>

              <Button
                onClick={handleAddToCart}
                variant="contained"
                sx={{
                  backgroundColor: "#2e3135",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#1a1819",
                  },
                }}
                disabled={quantity < 1 || quantity > product.P_quantity}
              >
                Add to cart
              </Button>
            </div>
          </div>
        </section>

        <Snackbar
          open={showAlert}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity={alertSeverity} onClose={() => setShowAlert(false)}>
            {alertMessage}
          </Alert>
        </Snackbar>

        {/* footer */}
        <Footer />
      </div>
    );
  } else {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* header */}
        <Navbar />

        <div
          style={{
            flex: 2,
            display: "flex",
            justifyContent: "center",
            marginTop: "2rem",
          }}
        >
          <img
            src={`http://localhost:3000/uploads/${product.P_img}`}
            alt={product?.P_name}
            style={{
              width: "70%",
              height: "70%",
              objectFit: "contain",
              borderRadius: "0.5rem",
            }}
          />
        </div>

        <div
          style={{
            backgroundColor: "#f4f4f4",
            padding: "2rem",
            borderRadius: "0.5rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            height: "100%",
            maxWidth: "100%",
            wordWrap: "break-word",
            overflowWrap: "break-word",
            marginTop: "2rem",
            marginLeft: "1rem",
            marginRight: "1rem",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h4" gutterBottom>
              {product.P_name}
            </Typography>
            <Fab
              color={fabColor}
              onClick={handleToggleFav}
              size="small"
              aria-label="like"
            >
              <FavoriteIcon />
            </Fab>
          </div>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            {product.P_description}
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
              ? "In Stock: " + product.P_quantity
              : "Out of Stock"}
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              margin: "1.5rem 0",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                marginRight: "2rem",
                border: "1px solid",
                borderColor: "#027efa",
                borderRadius: "4px",
              }}
            >
              <Button onClick={decreaseQuantity} sx={{ height: "40px" }}>
                <MinusIcon />
              </Button>
              <TextField
                variant="outlined"
                value={quantity}
                size="small"
                error={quantity > product.P_quantity}
                sx={{
                  height: "40px",
                  width: "50px",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 0,
                    "& fieldset": {
                      borderLeft: "1px solid #027efa",
                      borderRight: "1px solid #027efa",
                      borderTop: "none",
                      borderBottom: "none",
                    },
                    "&:hover fieldset": {
                      borderLeft: "1px solid #027efa",
                      borderRight: "1px solid #027efa",
                    },
                    "&.Mui-focused fieldset": {
                      borderLeft: "1px solid #027efa",
                      borderRight: "1px solid #027efa",
                    },
                  },
                  "& .MuiOutlinedInput-input": {
                    textAlign: "center",
                    color: quantity > product.P_quantity ? "red" : "inherit",
                  },
                }}
                onChange={(e) => {
                  const value = Math.max(0, parseInt(e.target.value, 10) || 0);
                  setQuantity(value);
                }}
              />
              <Button onClick={increaseQuantity} sx={{ height: "40px" }}>
                <PlusIcon />
              </Button>
            </Box>

            <Button
              onClick={handleAddToCart}
              variant="contained"
              sx={{
                backgroundColor: "#2e3135",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#1a1819",
                },
              }}
              disabled={quantity < 1 || quantity > product.P_quantity}
            >
              Add to cart
            </Button>
          </div>
        </div>

        <Snackbar
          open={showAlert}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity={alertSeverity} onClose={() => setShowAlert(false)}>
            {alertMessage}
          </Alert>
        </Snackbar>

        {/* footer */}
        <Footer />
      </div>
    );
  }
};

export default ProductDetail;
