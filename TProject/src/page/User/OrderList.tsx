import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import UserContext from "../../context/UserContext"; // Import your UserContext
import { Card, CardContent, Typography, CardActions, Box, Collapse } from '@mui/material';
import Grid from '@mui/material/Grid2'; // Importing Grid2
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';
import ExpandLessIcon from '@mui/icons-material/ExpandLess'; // Importing ExpandLess for toggle
import Loadingcompo from "../../components/loading"

const OrderList: React.FC = () => {
  const { C_id } = useContext<any>(UserContext); // Get C_id from context
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openOrder, setOpenOrder] = useState<number | null>(null); // State to track which order is open

  useEffect(() => {
    const fetchOrders = async () => {
      if (C_id) {
        try {
          const response = await axios.get(`http://localhost:3000/order/customer/${C_id}`);
          setOrders(response.data);
        } catch (err) {
          setError('you dont have any orders.');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        setError('No customer ID found.');
      }
    };

    fetchOrders();
  }, [C_id]);

  if (loading) {
    return( <Loadingcompo/>);
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  const handleToggle = (orderId: number) => {
    setOpenOrder(openOrder === orderId ? null : orderId); // Toggle the open order
  };

  return (
    <Grid container spacing={3}>
      {orders.length === 0 ? (
        <Grid>
          <Typography variant="h6">No orders found.</Typography>
        </Grid>
      ) : (
        orders.map(order => (
            
          <Grid key={order.O_id} sx={{ width:{lg:"60%",sm:"80%"} }}>
            <Card variant="outlined" sx={{ marginBottom: 1 }}>
              {/* <CardContent sx={{ display: 'flex' ,width:"100%"}}> */}
                <Grid container sx={{padding:'20px',display:'flex',alignItems:'center',justifyItems:'flex-start',cursor:'pointer'}}  onClick={() => handleToggle(order.O_id)}>   
                <Grid size={6}>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Typography variant="h6">Order ID: {order.O_id}</Typography>
                  <Typography variant="body2">Date: {new Date(order.Q_Date_time).toLocaleString()}</Typography>
                  <Typography variant="body2">
                    Address: {order.Address.A_street}, {order.Address.A_city}, {order.Address.A_state} {order.Address.A_postalCode}, {order.Address.A_country}
                  </Typography>
                  {order.Payment.PM_path && (
                  
                      <Typography
                        variant="body2"
                        component="a"
                        href={order.Payment.PM_path}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ color: '#1E88E5', textDecoration: 'underline', cursor: 'pointer' }}
                      >
                        Payment Slip
                      </Typography>
                
                  )}
                </Box>
                </Grid>
                <Grid size={5}>
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Typography variant="h5">{order.O_Total} $</Typography>
                </Box>
                </Grid>
                <Grid size={1}>
                <CardActions>
                  {/* <IconButton onClick={() => handleToggle(order.O_id)}> */}
                    {openOrder === order.O_id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  {/* </IconButton> */}
                </CardActions>
                </Grid>
                </Grid>
              {/* </CardContent> */}
              
              <Collapse in={openOrder === order.O_id} timeout="auto" unmountOnExit>
              <CardContent sx={{ padding: 0 }}> {/* Remove padding for full width effect */}
                {order.OrderDetail && order.OrderDetail.length > 0 ? (
                  order.OrderDetail.map((detail: any) => (
                    <Box
                      key={detail.OD_id}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      borderColor="#e0e0e0"
                      sx={{ 
                        width: "100%", 
                        padding: 2 // Padding for each product item
                      }}
                    >
                      <Box display="flex" alignItems="center" width="100%" sx={{padding:"10px"}}> {/* Use full width here */}
                        <Grid  size={4}>
                          <img
                            src={detail.Product.P_img || "/placeholder.png"}
                            alt={`${detail.Product.P_name} image`}
                            style={{
                              width: "80px",
                              height: "80px",
                              objectFit: "cover",
                              borderRadius: "4px",
                            }}
                          />
                        </Grid>
                        <Grid  size={6}>
                          <Typography variant="h6" fontWeight="500">
                            {detail.Product.P_name}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {detail.Product.P_description}
                          </Typography>
                          <Typography className="price" fontWeight="500">
                            ${detail.Product.P_price} x {detail.OD_quantity}
                          </Typography>
                        </Grid>
                        <Grid  size={3}>
                          <Typography
                            variant="h9"
                            fontWeight="500"
                            sx={{ display: "flex", justifyContent: "flex-end" }} // Align right
                          >
                            ฿ {parseFloat(detail.OD_price).toFixed(2)}
                          </Typography>
                        </Grid>
                      </Box>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2">No products found for this order.</Typography>
                )}
              </CardContent>
            </Collapse>

            </Card>
          </Grid>
        ))
      )}
    </Grid>
  );
};

export default OrderList;
