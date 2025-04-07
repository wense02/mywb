import React from 'react';
import { Box, Container, Grid, Typography, Card, CardMedia, CardContent, Button, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const Store = () => {
  const products = [
    {
      title: 'Digital Download',
      image: 'https://source.unsplash.com/800x600/?photography',
      price: '$15.00',
      type: 'Digital'
    },
    {
      title: 'Premium Print 8x10',
      image: 'https://source.unsplash.com/800x600/?print',
      price: '$25.00',
      type: 'Print'
    },
    {
      title: 'Canvas Print 16x20',
      image: 'https://source.unsplash.com/800x600/?canvas',
      price: '$89.00',
      type: 'Canvas'
    },
    {
      title: 'Photo Album',
      image: 'https://source.unsplash.com/800x600/?album',
      price: '$149.00',
      type: 'Album'
    }
  ];

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography variant="h3" component="h1" gutterBottom align="center">
            Photo Store
          </Typography>
          <Typography variant="h6" color="textSecondary" align="center" sx={{ mb: 6 }}>
            Purchase prints and digital downloads
          </Typography>

          <Grid container spacing={4}>
            {products.map((product, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                >
                  <Card sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      transition: 'transform 0.3s ease-in-out'
                    }
                  }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={product.image}
                      alt={product.title}
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" gutterBottom>
                        {product.title}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h5" color="primary">
                          {product.price}
                        </Typography>
                        <Chip label={product.type} size="small" color="secondary" />
                      </Box>
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        startIcon={<ShoppingCartIcon />}
                        sx={{ textTransform: 'none' }}
                      >
                        Add to Cart
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mt: 8, textAlign: 'center' }}>
            <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
              All prints are processed by professional photo labs
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                px: 4,
                py: 1.5
              }}
            >
              View Cart
            </Button>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Store;
