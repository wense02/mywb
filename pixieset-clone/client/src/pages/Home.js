import React, { useRef, useEffect, useState } from 'react';
import { Box, Container, Typography, Button, Grid, Card, CardContent, Avatar } from '@mui/material';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SpeedIcon from '@mui/icons-material/Speed';
import SecurityIcon from '@mui/icons-material/Security';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const AnimatedSection = ({ children, delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

const FloatingCard = ({ children, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: "easeOut"
      }}
      whileHover={{
        y: -8,
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
    >
      {children}
    </motion.div>
  );
};

const Home = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const heroRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    setMounted(true);
  }, []);

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
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1c0?w=100&h=100&fit=crop&crop=face'
    },
    {
      name: 'Michael Chen',
      role: 'Event Photographer',
      content: 'The e-commerce integration is seamless. I\'ve seen a significant increase in print sales since switching to this platform.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    }
  ];

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <Box sx={{ overflow: 'hidden', bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Hero Section with Parallax */}
      <Box
        ref={heroRef}
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          bgcolor: 'background.default',
          background: theme.palette.mode === 'dark' 
            ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)'
            : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: theme.palette.mode === 'dark'
              ? `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                 radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)`
              : `radial-gradient(circle at 25% 25%, rgba(37, 99, 235, 0.1) 0%, transparent 50%),
                 radial-gradient(circle at 75% 75%, rgba(124, 58, 237, 0.1) 0%, transparent 50%)`,
            pointerEvents: 'none',
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div style={{ y: heroY, opacity: heroOpacity }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <Typography
                variant="h1"
                component="h1"
                sx={{
                  fontWeight: 800,
                  mb: 3,
                  fontSize: { xs: '2.5rem', md: '4rem', lg: '5rem' },
                  textAlign: 'center',
                  background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, #f8fafc 0%, #3b82f6 50%, #8b5cf6 100%)'
                    : 'linear-gradient(135deg, #111827 0%, #2563eb 50%, #7c3aed 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: 1.1,
                }}
              >
                Beautiful Client
                <br />
                Photo Galleries
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            >
              <Typography
                variant="h4"
                color="text.secondary"
                sx={{ 
                  mb: 5, 
                  maxWidth: '800px', 
                  mx: 'auto',
                  textAlign: 'center',
                  fontWeight: 400,
                  lineHeight: 1.4,
                }}
              >
                The all-in-one platform for photographers to share, deliver, and sell online
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
              style={{ textAlign: 'center' }}
            >
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={() => navigate('/register')}
                sx={{
                  borderRadius: 3,
                  textTransform: 'none',
                  px: 6,
                  py: 2,
                  fontSize: '1.2rem',
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 15px 40px rgba(59, 130, 246, 0.4)',
                  }
                }}
              >
                Get Started Free
              </Button>
            </motion.div>
          </motion.div>
        </Container>

        {/* Floating Elements */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{
            duration: 6,
            // repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            position: 'absolute',
            top: '20%',
            right: '10%',
            width: 60,
            height: 60,
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            borderRadius: '50%',
            opacity: 0.6,
            zIndex: 0,
          }}
        />

        <motion.div
          animate={{
            y: [0, 30, 0],
            rotate: [0, -10, 0]
          }}
          transition={{
            duration: 8,
            // repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          style={{
            position: 'absolute',
            bottom: '20%',
            left: '10%',
            width: 40,
            height: 40,
            background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
            borderRadius: '30%',
            opacity: 0.5,
            zIndex: 0,
          }}
        />
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 12, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <AnimatedSection>
            <Typography
              variant="h2"
              component="h2"
              sx={{
                textAlign: 'center',
                mb: 2,
                fontWeight: 700,
                fontSize: { xs: '2rem', md: '3rem' },
                color: 'text.primary'
              }}
            >
              Why Choose Our Platform?
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ textAlign: 'center', mb: 8, maxWidth: '600px', mx: 'auto' }}
            >
              Everything you need to create stunning photo galleries and grow your business
            </Typography>
          </AnimatedSection>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <FloatingCard index={index}>
                  <Card
                    sx={{
                      height: '100%',
                      textAlign: 'center',
                      p: 3,
                      border: theme.palette.mode === 'dark' ? '1px solid rgba(148, 163, 184, 0.1)' : 'none',
                      background: theme.palette.mode === 'dark'
                        ? 'linear-gradient(145deg, #1e293b 0%, #334155 100%)'
                        : 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                    }}
                  >
                    <Box sx={{ 
                      color: 'primary.main', 
                      mb: 3,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: 80,
                      height: 80,
                      mx: 'auto',
                      borderRadius: '50%',
                      background: theme.palette.mode === 'dark'
                        ? 'rgba(59, 130, 246, 0.1)'
                        : 'rgba(37, 99, 235, 0.1)',
                    }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h5" component="h3" gutterBottom fontWeight={600}>
                      {feature.title}
                    </Typography>
                    <Typography color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      {feature.description}
                    </Typography>
                  </Card>
                </FloatingCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ 
        py: 12, 
        bgcolor: 'background.default',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: theme.palette.mode === 'dark'
            ? 'radial-gradient(circle at 75% 25%, rgba(139, 92, 246, 0.05) 0%, transparent 50%)'
            : 'radial-gradient(circle at 75% 25%, rgba(124, 58, 237, 0.05) 0%, transparent 50%)',
          pointerEvents: 'none',
        }
      }}>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <AnimatedSection>
            <Typography 
              variant="h2" 
              align="center" 
              gutterBottom
              sx={{ fontWeight: 700, mb: 2, color: 'text.primary' }}
            >
              What Our Users Say
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ textAlign: 'center', mb: 8, maxWidth: '600px', mx: 'auto' }}
            >
              Trusted by thousands of photographers worldwide
            </Typography>
          </AnimatedSection>

          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={6} key={index}>
                <FloatingCard index={index}>
                  <Card sx={{ 
                    height: '100%', 
                    p: 4,
                    bgcolor: 'background.paper',
                    border: theme.palette.mode === 'dark' ? '1px solid rgba(148, 163, 184, 0.1)' : 'none',
                  }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Avatar
                          src={testimonial.avatar}
                          sx={{ 
                            width: 64, 
                            height: 64, 
                            mr: 3,
                            border: '3px solid',
                            borderColor: 'primary.main'
                          }}
                        />
                        <Box>
                          <Typography variant="h6" fontWeight={600} sx={{ color: 'text.primary' }}>
                            {testimonial.name}
                          </Typography>
                          <Typography color="text.secondary" variant="body2">
                            {testimonial.role}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="body1" sx={{ 
                        fontStyle: 'italic',
                        lineHeight: 1.7,
                        fontSize: '1.1rem',
                        color: 'text.primary'
                      }}>
                        "{testimonial.content}"
                      </Typography>
                    </CardContent>
                  </Card>
                </FloatingCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ 
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
          : 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
        color: 'white', 
        py: 12,
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <AnimatedSection>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h2" component="h2" gutterBottom fontWeight={700} sx={{ color: 'white' }}>
                Ready to get started?
              </Typography>
              <Typography 
                variant="h5" 
                sx={{ mb: 6, opacity: 0.9, maxWidth: '600px', mx: 'auto', color: 'white' }}
              >
                Join thousands of photographers who trust us with their business
              </Typography>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/register')}
                  sx={{
                    borderRadius: 3,
                    textTransform: 'none',
                    px: 6,
                    py: 2,
                    fontSize: '1.2rem',
                    fontWeight: 600,
                    bgcolor: 'white',
                    color: 'primary.main',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                    '&:hover': {
                      bgcolor: 'grey.100',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 15px 40px rgba(0,0,0,0.3)',
                    }
                  }}
                >
                  Start Free Trial
                </Button>
              </motion.div>
            </Box>
          </AnimatedSection>
        </Container>

        {/* Background Pattern */}
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 50,
            // repeat: Infinity,
            ease: "linear"
          }}
          style={{
            position: 'absolute',
            top: '-50%',
            right: '-20%',
            width: '100%',
            height: '200%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
            opacity: 0.3,
            zIndex: 0,
          }}
        />
      </Box>
    </Box>
  );
};

export default Home;