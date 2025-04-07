import React from 'react';
import { Box, Container, Typography, Button, Grid, Card, CardContent, Avatar } from '@mui/material';
import { motion } from 'framer-motion';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SpeedIcon from '@mui/icons-material/Speed';
import SecurityIcon from '@mui/icons-material/Security';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';

const Home = () => {
  const features = [
    {
      icon: <CloudUploadIcon sx={{ fontSize: 40 }} />,
      title: 'Easy Upload',
      description: 'Upload your photos quickly and easily with our drag-and-drop interface.'
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 40 }} />,
      title: 'Lightning Fast',
      description: 'Experience blazing-fast loading speeds for your photo galleries.'
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      title: 'Secure Storage',
      description: 'Your photos are safely stored with enterprise-grade security.'
    },
    {
      icon: <PhotoLibraryIcon sx={{ fontSize: 40 }} />,
      title: 'Beautiful Galleries',
      description: 'Showcase your work in stunning, customizable galleries.'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Wedding Photographer',
      content: 'This platform has transformed how I deliver photos to my clients. The galleries are beautiful and my clients love them!',
      avatar: 'https://source.unsplash.com/100x100/?portrait,woman'
    },
    {
      name: 'Michael Chen',
      role: 'Event Photographer',
      content: 'The e-commerce integration is seamless. I\'ve seen a significant increase in print sales since switching to this platform.',
      avatar: 'https://source.unsplash.com/100x100/?portrait,man'
    }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: '#f5f5f5',
          py: { xs: 8, md: 12 },
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 700,
                mb: 3,
                fontSize: { xs: '2.5rem', md: '3.5rem' }
              }}
            >
              Beautiful Client Photo Galleries
            </Typography>
            <Typography
              variant="h5"
              color="textSecondary"
              sx={{ mb: 4, maxWidth: '800px', mx: 'auto' }}
            >
              The all-in-one platform for photographers to share, deliver, and sell online
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                px: 4,
                py: 1.5
              }}
            >
              Get Started Free
            </Button>
          </motion.div>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <Box
                  sx={{
                    textAlign: 'center',
                    p: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}
                >
                  <Box sx={{ color: 'primary.main', mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography color="textSecondary">
                    {feature.description}
                  </Typography>
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Testimonials Section */}
      <Box sx={{ bgcolor: '#f5f5f5', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" gutterBottom>
            What Our Users Say
          </Typography>
          <Grid container spacing={4} sx={{ mt: 4 }}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={6} key={index}>
                <motion.div
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                >
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar
                          src={testimonial.avatar}
                          sx={{ width: 60, height: 60, mr: 2 }}
                        />
                        <Box>
                          <Typography variant="h6">{testimonial.name}</Typography>
                          <Typography color="textSecondary">{testimonial.role}</Typography>
                        </Box>
                      </Box>
                      <Typography variant="body1">"{testimonial.content}"</Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h3" component="h2" gutterBottom>
              Ready to get started?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Join thousands of photographers who trust us
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                px: 4,
                py: 1.5,
                color: 'primary.main',
                bgcolor: 'white',
                '&:hover': {
                  bgcolor: 'grey.100'
                }
              }}
            >
              Start Free Trial
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
