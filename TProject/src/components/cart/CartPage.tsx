import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CartItem from './CartItem';
import CartTotals from './CartTotals';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { Container, Typography, Button, TextField, Grid, CircularProgress, Alert, Dialog, DialogActions, DialogContent, DialogTitle, Box } from '@mui/material';

interface CartItemType {
  CA_id: number;
  C_id: number;
  P_id: number;
  CA_quantity: number;
  CA_price: number;
  Product: {
    P_name: string;
    P_description: string;
    P_price: number;
    P_img: string;
  };
}

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customerId, setCustomerId] = useState<number>(1); // Example customer_id
  const [couponCode, setCouponCode] = useState<string>('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get<CartItemType[]>(`http://localhost:3000/cart/${customerId}`);
        setCartItems(response.data);
      } catch (error) {
        setError('Error fetching cart items');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [customerId]);

  const handleQuantityChange = (id: number, newQuantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.P_id === id
          ? { ...item, CA_quantity: newQuantity }
          : item
      )
    );
  };

  const handleApply = async () => {
    if (couponCode.trim() === '') {
      setDialogMessage('Please enter a coupon code.');
      setDialogOpen(true);
      return;
    }

    if (couponCode !== '12345') {
      setDialogMessage('Invalid coupon code.');
      setDialogOpen(true);
      return;
    }

    try {
      const errors: { productId: number; message: string }[] = [];

      await Promise.all(
        cartItems.map(async (item) => {
          try {
            const response = await axios.patch(`http://localhost:3000/cart/update`, {
              C_id: item.C_id,
              P_id: item.P_id,
              CA_quantity: item.CA_quantity,
              CA_price: item.CA_price
            });
            if (response.status !== 200) {
              errors.push({ productId: item.P_id, message: 'Failed to update quantity' });
            }
          } catch (error) {
            errors.push({ productId: item.P_id, message: 'Error updating quantity' });
          }
        })
      );

      if (errors.length > 0) {
        setError(`Failed to update quantities for some items: ${errors.map(e => `Product ID ${e.productId}: ${e.message}`).join(', ')}`);
      } else {
        setDialogMessage('Coupon applied successfully.');
        setDialogOpen(true);
      }
    } catch (error) {
      setError('Error updating quantities');
      console.error('Error updating quantities:', error);
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.Product.P_price * item.CA_quantity), 0);
  };

  const subtotal = calculateSubtotal();
  const shipping = 0;
  const discount = 10;
  const total = subtotal + shipping - discount;

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 20, mb: 8 }}> {/* Increased top margin for larger space between Navbar and cart */}
        <Typography 
          variant="h3" 
          align="left" 
          gutterBottom 
          sx={{ 
            fontFamily: "Syncopate", 
            textAlign: 'left', 
            flex: '1 0 100%', 
            fontSize: '2.5rem',
            mt: 4,  // Margin-top for the Typography
          }}
        >
          Your Cart
        </Typography>

        <Grid container spacing={5} justifyContent="center"> {/* Spacing between items */}
          <Grid item xs={12} md={8}>
            <Box sx={{ border: '1px solid #e0e0e0', p: 4, borderRadius: '8px' }}> {/* Padding inside the Box */}
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <CartItem
                    key={item.P_id}
                    item={{ ...item.Product, CA_quantity: item.CA_quantity }}
                    onQuantityChange={(newQuantity) => handleQuantityChange(item.P_id, newQuantity)}
                  />
                ))
              ) : (
                <Typography variant="body1" align="center">
                  Your cart is empty.
                </Typography>
              )}

              <Grid container spacing={3} sx={{ mt: 3 }}>
                <Grid item xs={6}> {/* Reduced width to 6 columns */}
                  <TextField
                    label="Coupon Code"
                    variant="outlined"
                    fullWidth
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    sx={{
                      borderRadius: '7px',
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        height: '40px', // Height of the input field
                      },
                      '& .MuiInputLabel-root': {
                        top: '-8px', // Adjust label position
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={3}> {/* Reduced button size to 3 columns */}
                  <Button
                    variant="outlined"
                    sx={{
                      width: '100%',
                      height: '40px', // Match the input field height
                      fontSize: '0.85rem', // Reduced font size
                      color: '#000',
                      borderColor: '#000',
                      '&:hover': {
                        backgroundColor: '#000',
                        color: '#fff',
                      },
                    }}
                    onClick={handleApply}
                  >
                    Apply
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ border: '1px solid #e0e0e0', p: 4, borderRadius: '8px' }}> {/* Padding inside the Box */}
              <CartTotals subtotal={subtotal} shipping={shipping} discount={discount} total={total} />
            </Box>
          </Grid>
        </Grid>
      </Container>

      <Footer />

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Coupon Code</DialogTitle>
        <DialogContent>
          <Typography>{dialogMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CartPage;
