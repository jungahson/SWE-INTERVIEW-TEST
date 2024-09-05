import React, {useEffect, useState} from 'react';
import { Container, Grid, Card, CardContent, CardMedia, Typography, Button, CircularProgress, Alert } from '@mui/material';
import { makeStyles } from '@mui/styles'; 
import axios from 'axios'; 

const useStyles = makeStyles({
  root: {
    padding: '20px',  
  }, 
  card: { 
    maxWidth: 345, 
    margin: 'auto', 
    position: 'relative', 
  }, 
  media: {
    height: 140, 
  }, 
  deleteButton: {
    position: 'absolute', 
    top: 10, 
    right: 10, 
  },  
}); 

const ProductList = () => {

  const classes = useStyles();  
  const [products, setProducts] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  //implement the get products function
  const fetchProducts = () => {
    setLoading(true);
    console.log('Fetching products...'); 
    fetch('http://localhost:5000/api/products')
      .then(response => { 
        if (!response.ok) {
          console.log('Response is not okay');
          throw new Error(`HTTP error! status: ${response.status}`); // Check if response is not ok
        }
        return response.json();
      })
      .then(data => {
        console.log('Fetched products:', data);
        setProducts(data); 
        setLoading(false); 
      })
      .catch(error => {
        console.error('Error fetching a list of products:', error); 
        setError('Error fetching products'); 
        setLoading(false);      
      }); 
  };

  useEffect(() => {
    fetchProducts(); 
  }, []); 

  // Handle delete functionality
  const handleDelete = (id) => {
    fetch(`http://localhost:5000/api/products/${id}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to delete product with ID ${id}`);
        }
        // Update state after successful deletion
        setProducts(products.filter(product => product.id !== id));
        console.log(`Deleted product with ID ${id}`);
      })
      .catch(error => {
        console.error('Error deleting product:', error);
        setError('Error deleting product');
      });
  };

  if (loading) {
    return (
      <Container className={classes.root}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className={classes.root}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className={classes.root}>
      <Grid container spacing={3}> 
        {products.map(product => (
          <Grid item xs={12} sm={6} md={4} key={product.id}> 
            <Card> className={classes.card}> 
              <CardMedia
                className={classes.media}
                image={product.imageUrl || 'https://via.placeholder.com/150'}
                title={product.name}
              />
              <CardContent> 
                <Typography gutterButtom variant="h5" component="div"> 
                  {product.name} 
                </Typography> 
                <Typography variant="body2" color="text.secondary"> 
                  {product.description}
                </Typography> 
                <Typography variant="h6" component="div">
                  ${product.price}
                </Typography>
                <Button
                  className={classes.deleteButton} 
                  variant="contained" 
                  color="secondary" 
                  onClick={() => handleDelete(product.id)}
                >
                  Delete 
                </Button> 
              </CardContent> 
            </Card> 
          </Grid> 
        ))}
      </Grid> 
    </Container>
  );
};

export default ProductList;