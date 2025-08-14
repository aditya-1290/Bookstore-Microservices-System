import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  MenuItem,
  Chip
} from '@mui/material';
import { Add, ShoppingCart } from '@mui/icons-material';
import axios from 'axios';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [books, setBooks] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    book_id: '',
    quantity: '',
    customer_name: '',
    customer_email: ''
  });

  useEffect(() => {
    fetchOrders();
    fetchBooks();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:8002/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await axios.get('http://localhost:8001/books');
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      await axios.post('http://localhost:8002/orders', formData);
      fetchOrders();
      handleCloseDialog();
    } catch (error) {
      console.error('Error creating order:', error);
      alert(error.response?.data?.detail || 'Error creating order');
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({ book_id: '', quantity: '', customer_name: '', customer_email: '' });
  };

  const getBookTitle = (bookId) => {
    const book = books.find(b => b.id === bookId);
    return book ? book.title : 'Unknown Book';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Orders Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenDialog(true)}
        >
          Create Order
        </Button>
      </Box>

      <Grid container spacing={3}>
        {orders.map((order) => (
          <Grid item xs={12} md={6} key={order.id}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" component="h2">
                    Order #{order.id}
                  </Typography>
                  <Chip
                    label={order.status}
                    color={getStatusColor(order.status)}
                    size="small"
                  />
                </Box>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Book: {getBookTitle(order.book_id)}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Customer: {order.customer_name}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Email: {order.customer_email}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Quantity: {order.quantity}
                </Typography>
                
                <Typography variant="h6" color="primary">
                  Total: ${order.total_price?.toFixed(2)}
                </Typography>
                
                <Typography variant="caption" color="text.secondary">
                  Created: {new Date(order.created_at).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Order</DialogTitle>
        <DialogContent>
          <TextField
            select
            margin="dense"
            label="Book"
            fullWidth
            value={formData.book_id}
            onChange={(e) => setFormData({ ...formData, book_id: parseInt(e.target.value) })}
          >
            {books.map((book) => (
              <MenuItem key={book.id} value={book.id}>
                {book.title} - ${book.price} (Stock: {book.stock})
              </MenuItem>
            ))}
          </TextField>
          
          <TextField
            margin="dense"
            label="Quantity"
            type="number"
            fullWidth
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
          />
          
          <TextField
            margin="dense"
            label="Customer Name"
            fullWidth
            value={formData.customer_name}
            onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
          />
          
          <TextField
            margin="dense"
            label="Customer Email"
            type="email"
            fullWidth
            value={formData.customer_email}
            onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Create Order
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default OrdersPage;
