import React, { useEffect, useState } from "react";
import axios from "axios";
import FavItem from "./FavItem";
import Navbar from "../Navbar";
import Footer from "../Footer";
import {
  Grid,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Box,
} from "@mui/material";
import useScreenSize from "../useScreenSize";

interface FavItemType {
  F_id: number;
  C_id: number;
  P_id: number;
  Product: {
    P_name: string;
    P_description: string;
    P_price: number;
    P_img: string;
  };
}

const FavPage: React.FC = () => {
  const [favItems, setFavItems] = useState<FavItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customerId, setCustomerId] = useState<number>(1); // Example customer_id
  const screenSize = useScreenSize();
  const isMobile = screenSize.width < 900;

  useEffect(() => {
    const fetchFavDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/favourite/${customerId}`
        );
        setFavItems(response.data); // Update state with favorite items from API
        setLoading(false); // Stop loading once data is fetched
      } catch (error) {
        console.error("Error fetching favourite items:", error);
        setError("Error fetching favourite items");
        setLoading(false);
      }
    };

    fetchFavDetails();
  }, [customerId]);

  // Handle loading state
  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!isMobile) {
    return (
      <>
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
          <Container maxWidth="xl" sx={{ mt: 20, mb: 8 }}>
            <Typography
              variant="h3"
              align="left"
              gutterBottom
              sx={{
                fontFamily: "Syncopate",
                textAlign: "left",
                flex: "1 0 100%",
                fontSize: "2.5rem",
                mt: 4,
              }}
            >
              Your Favourites
            </Typography>

            <Grid container spacing={5} justifyContent="center">
              <Grid item xs={12} md={8}>
                <Box
                  sx={{
                    p: 4,
                    borderRadius: "8px",
                    overflowY: "auto",
                  }}
                >
                  {favItems.length > 0 ? (
                    favItems.map((item) => (
                      <FavItem
                        key={item.P_id}
                        item={{
                          P_id: item.P_id,
                          ...item.Product,
                          P_price: item.Product.P_price.toString(),
                        }}
                      />
                    ))
                  ) : (
                    <Typography variant="body1" align="center">
                      You have no favourite.
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Container>
          <Footer />
        </div>
      </>
    );
  } else {
    return (
      <>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: "100%",
          }}
        >
          <Navbar />
          <Container maxWidth="xl" sx={{ mb: 8 }}>
            <Typography
              variant="h3"
              align="left"
              gutterBottom
              sx={{
                fontFamily: "Syncopate",
                textAlign: "left",
                flex: "1 0 100%",
                fontSize: "2.5rem",
                mt: 4,
              }}
            >
              Your Favourites
            </Typography>

            <Grid container spacing={5} justifyContent="center">
              <Grid item xs={12} md={8}>
                <Box
                  sx={{
                    p: 4,
                    borderRadius: "8px",
                    overflowY: "auto",
                  }}
                >
                  {favItems.length > 0 ? (
                    favItems.map((item) => (
                      <FavItem
                        key={item.P_id}
                        item={{
                          P_id: item.P_id,
                          ...item.Product,
                          P_price: item.Product.P_price.toString(),
                        }}
                      />
                    ))
                  ) : (
                    <Typography variant="body1" align="center">
                      You have no favourite.
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Container>
          <Footer />
        </div>
      </>
    );
  }
};

export default FavPage;
