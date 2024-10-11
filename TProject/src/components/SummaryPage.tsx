import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Grid,
  Card,
  createTheme,
  ThemeProvider,
  CardContent,
  CircularProgress,
  Collapse,
  Avatar,
} from "@mui/material";

interface Product {
  P_name: string;
  P_description: string;
  P_img: string;
}

interface OrderDetail {
  P_id: number;
  OD_quantity: number;
  OD_price: number;
  Product: Product;
}

interface Order {
  O_id: number;
  Date_time: string;
  Total: number;
  OrderDetail: OrderDetail[];
}

const theme = createTheme({
  typography: {
    fontFamily: "Montserrat, sans-serif",
  },
});

const OrdersByCustomer: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [customerId] = useState<number>(1); // Default customer ID
  const [expandedOrders, setExpandedOrders] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_APP_API_BASE_URL
          }/order/customer/${customerId}`
        );
        setOrders(response.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || "Failed to fetch orders");
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [customerId]);

  if (loading) {
    return (
      <Container sx={{ mt: 5, textAlign: "center" }}>
        <CircularProgress color="primary" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 5, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Container>
    );
  }

  if (orders.length === 0) {
    return (
      <Container sx={{ mt: 5, textAlign: "center" }}>
        <Typography variant="h6">No orders found for this customer.</Typography>
      </Container>
    );
  }

  const handleCardClick = (orderId: number) => {
    setExpandedOrders((prev) => {
      const newExpandedOrders = new Set(prev);
      if (newExpandedOrders.has(orderId)) {
        newExpandedOrders.delete(orderId);
      } else {
        newExpandedOrders.add(orderId);
      }
      return newExpandedOrders;
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container sx={{ mt: 5, maxWidth: "md" }}>
        <Typography variant="h4" align="center" sx={{ mb: 4 }}>
          Orders Summary
        </Typography>
        <Grid container spacing={2}>
          {orders.map((order) => (
            <Grid item xs={12} sm={6} md={4} key={order.O_id}>
              <Card
                variant="outlined"
                sx={{
                  borderRadius: 1,
                  boxShadow: 0,
                  "&:hover": {
                    boxShadow: 1,
                  },
                  transition: "box-shadow 0.3s ease",
                  cursor: "pointer",
                }}
                onClick={() => handleCardClick(order.O_id)}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Order ID: {order.O_id}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Date: {new Date(order.Date_time).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    Total: ${order.Total.toFixed(2)}{" "}
                    {/* Assuming Total is in cents */}
                  </Typography>
                  <Collapse in={expandedOrders.has(order.O_id)}>
                    <Typography variant="subtitle2" sx={{ mt: 2 }}>
                      Order Details:
                    </Typography>
                    {order.OrderDetail.map((detail) => (
                      <Grid
                        container
                        spacing={2}
                        key={detail.P_id}
                        sx={{ mb: 2 }}
                      >
                        <Grid item xs={3}>
                          <Avatar
                            alt={detail.Product.P_name}
                            src={detail.Product.P_img || "/default-image.png"} // Fallback image
                            sx={{ width: 48, height: 48 }}
                          />
                        </Grid>
                        <Grid item xs={9}>
                          <Typography variant="body2" gutterBottom>
                            {detail.Product.P_name}
                          </Typography>
                          <Typography variant="body2">
                            {detail.OD_quantity} x ${detail.OD_price.toFixed(2)}{" "}
                            {/* Assuming price is in cents */}
                          </Typography>
                        </Grid>
                      </Grid>
                    ))}
                  </Collapse>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default OrdersByCustomer;
