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
  Chip
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import axios from 'axios';

const BooksPage = () => {
  const [books, setBooks] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    price: '',
    stock: ''
  });

  useEffect(() => {
    fetchBooks();
  }, []);

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
      if (editingBook) {
        await axios.put(`http://localhost:8001/books/${editingBook.id}`, formData);
      } else {
        await axios.post('http://localhost:8001/books', formData);
      }
      fetchBooks();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving book:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8001/books/${id}`);
      fetchBooks();
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingBook(null);
    setFormData({ title: '', author: '', price: '', stock: '' });
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setFormData(book);
    setOpenDialog(true);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Books Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenDialog(true)}
        >
          Add Book
        </Button>
      </Box>

      <Grid container spacing={3}>
        {books.map((book) => (
          <Grid item xs={12} sm={6} md={4} key={book.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="h2" gutterBottom>
                  {book.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  by {book.author}
                </Typography>
                <Typography variant="h6" color="primary" gutterBottom>
                  ${book.price}
                </Typography>
                <Chip
                  label={`Stock: ${book.stock}`}
                  color={book.stock > 0 ? 'success' : 'error'}
                  size="small"
                />
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  startIcon={<Edit />}
                  onClick={() => handleEdit(book)}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  startIcon={<Delete />}
                  color="error"
                  onClick={() => handleDelete(book.id)}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingBook ? 'Edit Book' : 'Add New Book'}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Title"
            fullWidth
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Author"
            fullWidth
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Price"
            type="number"
            fullWidth
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
          />
          <TextField
            margin="dense"
            label="Stock"
            type="number"
            fullWidth
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingBook ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BooksPage;
