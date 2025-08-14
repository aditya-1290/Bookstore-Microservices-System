import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Alert,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import { Send, Notifications as NotificationsIcon } from '@mui/icons-material';
import axios from 'axios';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(false);

  const sendNotification = async () => {
    if (!orderId) return;
    
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8003/notify', {
        order_id: parseInt(orderId)
      });
      
      setNotifications(prev => [...prev, {
        id: Date.now(),
        message: response.data.message,
        order_id: response.data.order_id,
        customer_email: response.data.customer_email,
        timestamp: new Date().toLocaleString()
      }]);
      
      setOrderId('');
    } catch (error) {
      console.error('Error sending notification:', error);
      alert('Error sending notification: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Notification Service Demo
      </Typography>
      
      <Typography variant="body1" paragraph>
        This page demonstrates the notification service. When orders are created, notifications are automatically sent.
        You can also manually trigger notifications here.
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Send Manual Notification
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              label="Order ID"
              type="number"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              size="small"
            />
            <Button
              variant="contained"
              startIcon={<Send />}
              onClick={sendNotification}
              disabled={!orderId || loading}
            >
              Send Notification
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          Check the console output of the Notification Service (port 8003) to see the actual notifications being logged.
        </Typography>
      </Alert>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recent Notifications
          </Typography>
          
          {notifications.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No notifications sent yet. Create an order or use the form above.
            </Typography>
          ) : (
            <List>
              {notifications.map((notification, index) => (
                <React.Fragment key={notification.id}>
                  <ListItem>
                    <ListItemText
                      primary={`Notification for Order #${notification.order_id}`}
                      secondary={
                        <>
                          <Typography variant="body2">
                            Customer: {notification.customer_email}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {notification.timestamp}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  {index < notifications.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          How Notifications Work
        </Typography>
        <Typography variant="body2" paragraph>
          1. When an order is created via the Order Service, it automatically sends a notification
        </Typography>
        <Typography variant="body2" paragraph>
          2. The Notification Service receives the order ID and fetches order details
        </Typography>
        <Typography variant="body2" paragraph>
          3. The notification is logged to the console with order details
        </Typography>
        <Typography variant="body2">
          4. The customer receives confirmation (simulated via console logging)
        </Typography>
      </Box>
    </Container>
  );
};

export default NotificationsPage;
