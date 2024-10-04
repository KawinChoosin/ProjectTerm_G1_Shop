import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import UserContext from "../../context/UserContext"; // Import your UserContext
import { Card, CardContent, Typography, CardActions, Box, Collapse, TextField, Button } from '@mui/material';
import Grid from '@mui/material/Grid2'; // Importing Grid2
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';
import ExpandLessIcon from '@mui/icons-material/ExpandLess'; // Importing ExpandLess for toggle
import Loadingcompo from "../../components/loading"
import Chip from '@mui/material/Chip';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

const OrderList: React.FC = () => {
  const { C_id } = useContext<any>(UserContext); // Get C_id from context
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openOrder, setOpenOrder] = useState<number | null>(null); // State to track which order is open
  const [orderDescriptions, setOrderDescriptions] = useState<{ [key: number]: string | null  }>({}); // State for descriptions
  const [descripupdate,setdescripupdate] = useState<boolean>(false);
  const [admin,setAdmin]=useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState('waiting'); // Default value is 'waiting'
  const [status,setStatus] = useState<boolean>(false)
  const [orderStatuses, setOrderStatuses] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    const fetchOrders = async () => {
      if (C_id) {
        try {
          const role = await axios.get(`http://localhost:3000/profile?C_id=${C_id}`);
          console.log(role.data[0].C_Role)
          if(role.data[0].C_Role){
            setAdmin(true);
            const response = await axios.get(`http://localhost:3000/orderlist/customer`);
            setOrders(response.data);
          }else{
            const response = await axios.get(`http://localhost:3000/order/customer/${C_id}`);
            setOrders(response.data);
          }
         
        } catch (err) {
          setError('You don\'t have any orders.');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        setError('No customer ID found.');
      }
    };

    fetchOrders();
  }, [C_id,descripupdate,orders]);

  if (loading) {
    return <Loadingcompo />;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  const handleToggle = (orderId: number) => {
    setOpenOrder(openOrder === orderId ? null : orderId); // Toggle the open order
  };

  const handleDescriptionChange = (O_id: number, value: string) => {
    setOrderDescriptions(prevState => ({
      ...prevState,
      [O_id]: value === '' ? null : value  // If the value is empty, set to null, else use the value
    }));
  };
  

  const handleDescriptionSubmit = async (O_id: number) => {
    try {
      setdescripupdate(true);
      await axios.put(`http://localhost:3000/orderlist/descrip`, {
        O_id,
        O_Description: orderDescriptions[O_id] || null, // Send the specific description for the order
        O_status: orderStatuses[O_id] || false // Send the specific status for the order
      });
      alert('Description updated successfully');
      setdescripupdate(false);
    } catch (err) {
      alert('Error updating description');
    }
  };
  

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>, orderId: number) => {
    const value = event.target.value;
    setSelectedStatus(value);
  
    // Set the status for the specific order
    const newStatus = value === 'Delivery on the way';
    setOrderStatuses(prevState => ({
      ...prevState,
      [orderId]: newStatus
    }));
  };
  

  return (
    <Grid container spacing={3}>
      {orders.length === 0 ? (
        <Grid>
          <Typography variant="h6">No orders found.</Typography>
        </Grid>
      ) : (
        orders.map(order => (
          <Grid key={order.O_id} sx={{ width: { lg: "80%", sm: "80%" } }}>
            <Card
              variant="elevation"
              sx={{
                marginBottom: 1,
                border: '4px ',
                borderColor: order.O_status ? 'success' : 'error',
                boxShadow: order.O_status
                  ? '0 0 2px  rgba(76, 175, 80)' // Green glow for success
                  : '0 0 2px  rgba(244, 67, 54)', // Red glow for error
                transition: 'box-shadow 0.3s ease', // Smooth transition for the glow effect
              }}
            >
              <Grid container sx={{ padding: '20px', display: 'flex', alignItems: 'center', justifyItems: 'flex-start', cursor: 'pointer' }} onClick={() => handleToggle(order.O_id)}>
                <Grid size={6}><Typography variant="h6" sx={{ fontFamily: 'Montserrat' }}>Order ID: {order.O_id}</Typography></Grid>
                
                  <Grid size={6} >
                    <Box sx={{ display: "flex", justifyContent:'flex-end' }}>
                    
                      <Chip label={order.O_status ? 'Delivery on the way' : 'WAITING'} color={order.O_status ? 'success' : 'error'} sx={{ fontFamily: 'Montserrat' }}/>

                    </Box>
                  </Grid>
                
                
                <Grid size={6}>
            
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    
                    
                    <Typography variant="body2" sx={{ fontFamily: 'Montserrat' }}>Date: {new Date(order.Q_Date_time).toLocaleString()}</Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'Montserrat' }}>
                      Address: {order.Address.A_street}, {order.Address.A_city}, {order.Address.A_state} {order.Address.A_postalCode}, {order.Address.A_country}
                    </Typography>
                    {order.Payment.PM_path && (
                      <Typography
                        variant="body2"
                        component="a"
                        href={order.Payment.PM_path}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ color: 'primary', textDecoration: 'underline', cursor: 'pointer' ,fontFamily: 'Montserrat' }}
                      >
                        Payment Slip
                      </Typography>
                    )}
                    {order.O_Description !== null && (
                      <Box component="section" sx={{ p: 0.5, border: '2px dashed grey',mt:2}}>
                          <Typography variant="body1" sx={{ fontFamily: 'Montserrat',display:'flex',justifyContent:'center'}} >{order.O_Description}</Typography>
                      </Box>
                   )}

                    
                  </Box>
                </Grid>
                <Grid size={5}>
                  
                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    
                    <Typography variant="h6" sx={{ fontFamily: 'Montserrat'}}>{order.O_Total} $</Typography>
                  {/* {order.Customer.C_Role && (
                      <>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleDescriptionSubmit(order.O_id)}
                          sx={{width:'50%'}}
                        >
                          Status
                        </Button>
                      </>
                    )} */}
                    </Box>
                  
                </Grid>
                <Grid size={1}>
                  <CardActions>
                    {openOrder === order.O_id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </CardActions>
                </Grid>
                
                {admin && (

                  
                    <Grid size={12}>
                      <Grid size={12}><Typography variant="h6" sx={{mt:2,mb:1,fontFamily: 'Montserrat' }}>ADMIN</Typography></Grid>
                      <Grid size={12}>
                      
                      <FormControl>
                        <FormLabel id="demo-row-radio-buttons-group-label" sx={{ fontFamily: 'Montserrat',fontVariant:'body2'}}>Status</FormLabel>
                        <RadioGroup
                          row
                          aria-labelledby="demo-row-radio-buttons-group-label"
                          name="row-radio-buttons-group"
                        >
                          <FormControlLabel
                            value="Delivery on the way"
                            control={<Radio />}
                            label={<Typography variant="body2" sx={{fontFamily: 'Montserrat' }}>Delivery on the way</Typography>}
                            onChange={(event) => handleStatusChange(event, order.O_id)} // Pass order ID
                            
                          />

                          <FormControlLabel
                            value="waiting"
                            control={<Radio />}
                            label={<Typography variant="body2" sx={{fontFamily: 'Montserrat' }}>Waiting</Typography>}
                            onChange={(event) => handleStatusChange(event, order.O_id)} // Pass order ID
                          />
          
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                      <Grid size={6}>
                      <TextField
                        label={<Typography variant="body2" sx={{fontFamily: 'Montserrat' }}>Order Description</Typography>}
                        value={orderDescriptions[order.O_id] || ''} // Get the specific description for the order
                        onChange={(e) => handleDescriptionChange(order.O_id, e.target.value)}
                        fullWidth
                        margin="normal"
                      />

                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleDescriptionSubmit(order.O_id)}
                          sx={{mb:1}}
                        >
                          <Typography variant="body2" sx={{fontFamily: 'Montserrat' }}>Submit</Typography>
                        </Button>
                      
                      </Grid>
                      <Grid size={6}>
                        
                      
                      </Grid>
                    </Grid>
                    )}
                </Grid>
              

              <Collapse in={openOrder === order.O_id} timeout="auto" unmountOnExit>
                <CardContent sx={{ padding: 0 }}>
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
                          padding: 2
                        }}
                      >
                        <Box display="flex" alignItems="center" width="100%" sx={{ padding: "10px" }}>
                          <Grid size={4}>
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
                          <Grid size={6}>
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
                          <Grid size={3}>
                            <Typography
                              variant="h6"
                              fontWeight="500"
                              sx={{ display: "flex", justifyContent: "flex-end" }}
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
