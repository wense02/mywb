// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  Chip,
  Divider,
  LinearProgress,
  IconButton,
  Tooltip,
  Zoom,
} from '@mui/material';
import { motion } from 'framer-motion';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LanguageIcon from '@mui/icons-material/Language';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import SettingsIcon from '@mui/icons-material/Settings';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '../contexts/AuthContext';
import { useScrollReveal, animationVariants } from '../hooks/useScrollAnimation';

const Dashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalGalleries: 0,
    totalViews: 0,
    totalLikes: 0,
    storageUsed: 0,
    storageLimit: 100 // GB
  });

  // Scroll animations
  const headerReveal = useScrollReveal({ delay: 0.2 });
  const statsReveal = useScrollReveal({ delay: 0.4 });

  useEffect(() => {
    // Fetch user statistics here
    // This would typically come from your API
    setStats({
      totalGalleries: 12,
      totalViews: 1247,
      totalLikes: 342,
      storageUsed: 15.7,
      storageLimit: 100
    });
  }, []);

  const dashboardCards = [
    {
      title: 'Client Galleries',
      description: 'Create and manage beautiful photo galleries for your clients',
      icon: <PhotoLibraryIcon sx={{ fontSize: 40 }} />,
      color: '#3b82f6',
      route: '/gallery',
      stats: `${stats.totalGalleries} galleries`,
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
    },
    {
      title: 'Store',
      description: 'Set up your online store and sell prints directly to clients',
      icon: <StorefrontIcon sx={{ fontSize: 40 }} />,
      color: '#10b981',
      route: '/store',
      stats: 'Coming soon',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      disabled: true
    },
    {
      title: 'Website Builder',
      description: 'Create a stunning photography website to showcase your work',
      icon: <LanguageIcon sx={{ fontSize: 40 }} />,
      color: '#8b5cf6',
      route: '/website',
      stats: 'Coming soon',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      disabled: true
    },
    {
      title: 'Mobile App',
      description: 'Download our mobile app for on-the-go gallery management',
      icon: <PhoneAndroidIcon sx={{ fontSize: 40 }} />,
      color: '#f59e0b',
      route: '/mobile',
      stats: 'Download available',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      disabled: true
    }
  ];

  const quickStats = [
    {
      label: 'Total Views',
      value: stats.totalViews.toLocaleString(),
      icon: <VisibilityIcon />,
      color: '#3b82f6'
    },
    {
      label: 'Total Likes',
      value: stats.totalLikes.toLocaleString(),
      icon: <FavoriteIcon />,
      color: '#ef4444'
    },
    {
      label: 'Galleries',
      value: stats.totalGalleries,
      icon: <PhotoLibraryIcon />,
      color: '#10b981'
    },
    {
      label: 'Storage Used',
      value: `${stats.storageUsed}GB`,
      icon: <CloudUploadIcon />,
      color: '#8b5cf6'
    }
  ];

  const handleCardClick = (route, disabled) => {
    if (!disabled) {
      navigate(route);
    }
  };

  return (
    <Box sx={{ 
      py: 4, 
      bgcolor: 'background.default',
      minHeight: '100vh'
    }}>
      <Container maxWidth="lg">
        {/* Header Section */}
        <motion.div
          ref={headerReveal.ref}
          variants={animationVariants.fadeInUp}
          initial="hidden"
          animate={headerReveal.animate}
        >
          <Box sx={{ mb: 6 }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              mb: 4,
              flexDirection: { xs: 'column', md: 'row' },
              gap: { xs: 3, md: 0 }
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Avatar
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    bgcolor: 'primary.main',
                    fontSize: '2rem',
                    fontWeight: 700
                  }}
                >
                  {user?.name ? user.name[0].toUpperCase() : 'U'}
                </Avatar>
                <Box>
                  <Typography 
                    variant="h3" 
                    component="h1" 
                    sx={{ 
                      fontWeight: 700,
                      mb: 1,
                      background: theme.palette.mode === 'dark'
                        ? 'linear-gradient(135deg, #f8fafc 0%, #3b82f6 100%)'
                        : 'linear-gradient(135deg, #111827 0%, #2563eb 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Welcome back, {user?.name?.split(' ')[0] || 'User'}!
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    Let's create something amazing today
                  </Typography>
                </Box>
              </Box>
              
              <Tooltip title="Account Settings" TransitionComponent={Zoom}>
                <IconButton
                  onClick={() => navigate('/settings')}
                  sx={{
                    p: 2,
                    bgcolor: 'background.paper',
                    border: `1px solid ${theme.palette.divider}`,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                    }
                  }}
                >
                  <SettingsIcon />
                </IconButton>
              </Tooltip>
            </Box>

            {/* Storage Usage */}
            <Box sx={{ 
              p: 3, 
              bgcolor: 'background.paper',
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              mb: 4
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={600}>
                  Storage Usage
                </Typography>
                <Chip 
                  label={`${stats.storageUsed}GB / ${stats.storageLimit}GB`}
                  color="primary"
                  variant="outlined"
                />
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={(stats.storageUsed / stats.storageLimit) * 100}
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  backgroundColor: theme.palette.grey[200],
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
                  }
                }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {((stats.storageLimit - stats.storageUsed)).toFixed(1)}GB remaining
              </Typography>
            </Box>
          </Box>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          ref={statsReveal.ref}
          variants={animationVariants.staggerContainer}
          initial="hidden"
          animate={statsReveal.animate}
        >
          <Typography variant="h5" fontWeight={600} sx={{ mb: 3 }}>
            Quick Stats
          </Typography>
          <Grid container spacing={3} sx={{ mb: 6 }}>
            {quickStats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <motion.div variants={animationVariants.staggerItem}>
                  <Card sx={{
                    p: 2,
                    textAlign: 'center',
                    bgcolor: 'background.paper',
                    border: `1px solid ${theme.palette.divider}`,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                    }
                  }}>
                    <Box sx={{ 
                      color: stat.color, 
                      mb: 1,
                      display: 'flex',
                      justifyContent: 'center'
                    }}>
                      {stat.icon}
                    </Box>
                    <Typography variant="h4" fontWeight={700} sx={{ mb: 0.5 }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.label}
                    </Typography>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        <Divider sx={{ my: 4 }} />

        {/* Main Dashboard Cards */}
        <motion.div
          variants={animationVariants.staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Typography variant="h5" fontWeight={600} sx={{ mb: 3 }}>
            Your Tools
          </Typography>
          <Grid container spacing={4}>
            {dashboardCards.map((card, index) => (
              <Grid item xs={12} md={6} key={index}>
                <motion.div
                  variants={animationVariants.staggerItem}
                  whileHover={{ 
                    y: card.disabled ? 0 : -8,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={card.disabled ? {} : { scale: 0.98 }}
                >
                  <Card
                    sx={{
                      height: 280,
                      cursor: card.disabled ? 'not-allowed' : 'pointer',
                      opacity: card.disabled ? 0.7 : 1,
                      background: card.disabled 
                        ? theme.palette.background.paper
                        : `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${card.color}15 100%)`,
                      border: `1px solid ${theme.palette.divider}`,
                      transition: 'all 0.3s ease-in-out',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        boxShadow: card.disabled 
                          ? 'none'
                          : '0 12px 35px rgba(0,0,0,0.15)',
                      },
                      '&::before': card.disabled ? {} : {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: card.gradient,
                        opacity: 0,
                        transition: 'opacity 0.3s ease-in-out',
                      },
                      '&:hover::before': card.disabled ? {} : {
                        opacity: 0.05,
                      }
                    }}
                    onClick={() => handleCardClick(card.route, card.disabled)}
                  >
                    <CardContent sx={{ 
                      p: 4, 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      position: 'relative',
                      zIndex: 1
                    }}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        mb: 3
                      }}>
                        <Box sx={{ 
                          p: 2,
                          borderRadius: 2,
                          background: card.gradient,
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {card.icon}
                        </Box>
                        {card.disabled && (
                          <Chip 
                            label="Coming Soon" 
                            size="small" 
                            color="default"
                            variant="outlined"
                          />
                        )}
                      </Box>
                      
                      <Typography variant="h5" fontWeight={700} gutterBottom>
                        {card.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ mb: 3, flexGrow: 1 }}>
                        {card.description}
                      </Typography>
                      
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        mt: 'auto'
                      }}>
                        <Typography variant="body2" color="text.secondary">
                          {card.stats}
                        </Typography>
                        {!card.disabled && (
                          <Button
                            variant="contained"
                            sx={{
                              background: card.gradient,
                              '&:hover': {
                                transform: 'translateY(-1px)',
                                boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
                              }
                            }}
                          >
                            Open
                          </Button>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* Recent Activity Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Typography variant="h5" fontWeight={600} sx={{ mb: 3, mt: 6 }}>
            Recent Activity
          </Typography>
          <Card sx={{
            p: 4,
            bgcolor: 'background.paper',
            border: `1px solid ${theme.palette.divider}`,
            textAlign: 'center'
          }}>
            <TrendingUpIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No recent activity
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Start creating galleries to see your activity here
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/gallery')}
              sx={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                px: 4,
                py: 1.5,
              }}
            >
              Create Your First Gallery
            </Button>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Dashboard;