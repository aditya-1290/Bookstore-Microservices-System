import React from 'react';
import { Container, Typography, Grid, Card, CardContent, Box } from '@mui/material';
import { Book, ShoppingCart, Notifications } from '@mui/icons-material';

const HomePage = () => {
  const services = [
    {
      title: 'Book Service',
      description: 'Manages book inventory with CRUD operations',
      port: 8001,
      icon: <Book />,
      color: '#1976d2'
    },
    {
      title: 'Order Service',
      description: 'Handles customer orders and stock management',
      port: 8002,
      icon: <ShoppingCart />,
      color: '#388e3c'
    },
    {
      title: 'Notification Service',
      description: 'Sends notifications for new orders',
      port: 8003,
      icon: <Notifications />,
      color: '#f57c00'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Bookstore Microservices System
      </Typography>
      
      <Typography variant="h6" align="center" color="text.secondary" paragraph>
        A distributed system built with FastAPI microservices communicating via REST APIs
      </Typography>

      <Grid container spacing={4} sx={{ mt: 3 }}>
        {services.map((service, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ color: service.color, mr: 2 }}>
                    {service.icon}
                  </Box>
                  <Typography variant="h5" component="h2">
                    {service.title}
                  </Typography>
                </Box>
                
                <Typography variant="body2" color="text.secondary" paragraph>
                  {service.description}
                </Typography>
                
                <Typography variant="body2" color="primary">
                  Port: {service.port}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4, p: 3, bgcolor: 'grey.100', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          System Architecture
        </Typography>
        <Typography variant="body2">
          This system demonstrates microservices architecture with:
        </Typography>
        <ul>
          <li>Independent services running on different ports</li>
          <li>REST API communication between services</li>
          <li>Event-driven notifications</li>
          <li>React frontend for unified user experience</li>
        </ul>
      </Box>
    </Container>
  );
};

export default HomePage;
