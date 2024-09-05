import React, {useEffect, useState} from 'react';
import { Container, Grid, Card, CardContent, CardMedia, Typography, Button, CircularProgress, Alert } from '@mui/material';
import { makeStyles } from '@mui/styles'; 
import axios from 'axios'; 

const useStyles = makeStyles({
  root: {
    padding: '20px',  
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh', //center vertically
  }, 
  cardContainer: {
    maxWidth: '1200px', //optional: Set a max width for your cards container
    width: '100%',      //full width to enable responsive wrapping
  },
  card: { 
    maxWidth: 345, 
    margin: 'auto', 
    position: 'relative', 
    display: 'flex',
    flexDirection: 'column',
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
  const fetchProducts = async () => {
    try { 
      console.log('Fetching products...'); 
      const response = await axios.get('http://localhost:5000/api/products'); 
      if (Array.isArray(response.data)) {
        setProducts(response.data);
      } else { 
        throw new Error('Unexpected API response');
      }  
      setLoading(false); 
    } catch(err) {
      console.error('Error fetching a list of products:', err); 
      setError('Error fetching products'); 
      setLoading(false);      
    } 
  };

  //handle delete functionality
  const handleDelete = async (id) => {
    try{
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      setProducts(products.filter(product => product.id !== id));
    } catch(err) {
        console.error('Error deleting product:', err);
        setError('Error deleting product');
    } 
  };

  useEffect(() => { 
    fetchProducts(); 
  }, []); 

  if (loading) return <CircularProgress />; 
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container className={classes.root}>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : products && products.length > 0 ? (
        <Grid container spacing={3} className={classes.cardContainer} justifyContent="center"> 
          {products.map(product => (
            // adjust grid breakpoints
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}> 
              <Card>  
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
      ) : (
        <Typography>No products available</Typography>
      )}  
    </Container>
  );
};

export default ProductList;