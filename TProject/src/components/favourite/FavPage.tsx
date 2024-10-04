import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import FavItem from "./FavItem";
import Navbar from "../Navbar";
import Footer from "../Footer";
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Box,
  responsiveFontSizes,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import useScreenSize from "../useScreenSize";
import UserContext from "../../context/UserContext";
import { useNavigate, useLocation } from "react-router-dom";

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
  const { C_id } = useContext(UserContext);
  const [favItems, setFavItems] = useState<FavItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const screenSize = useScreenSize();
  const isMobile = screenSize.width < 900;
  const navigate = useNavigate(); // Use useNavigate for redirection
  const location = useLocation(); // To get the current URL

  useEffect(() => {
    if (C_id === null) {
      navigate("/login", { state: { from: location } }); // Pass current location as state
      return;
    }

    const fetchFavDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/favourite/${C_id}`
        );
        console.log(C_id);
        setFavItems(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching favourite items:", error);
        setError("Error fetching favourite items");
        setLoading(false);
      }
    };

    fetchFavDetails();
  }, [C_id]);

  if (C_id === null) {
    return <Typography>Loading user information...</Typography>; // Optionally display loading for user info
  }

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  // Common layout for both mobile and desktop
  const renderFavItems = () => (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        justifyContent: "center",
        padding: 4,
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
          You have no favourites.
        </Typography>
      )}
    </Box>
  );

  const theme = createTheme({
    typography: {
      fontFamily: "Montserrat, sans-serif",
      h6: {
        fontFamily: "Montserrat, sans-serif",
      },
      body2: {
        fontFamily: "Open Sans, sans-serif",
      },
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536,
      },
    },
  });
  
  const responsiveTheme = responsiveFontSizes(theme);
  
  return (
    // <div
    //   style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    // >
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
      <Container maxWidth="xl" sx={{ mt: isMobile ? 0 : 20, mb: 16}}>
        <ThemeProvider theme={responsiveTheme}>
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
          {renderFavItems()}
        </ThemeProvider>
      </Container>
      <Footer />
    </div>
  );
};

export default FavPage;
