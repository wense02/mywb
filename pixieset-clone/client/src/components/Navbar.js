import React, { useState } from 'react';
import { AppBar, Toolbar, Button, Box, Container, IconButton, Drawer, List, ListItem, useScrollTrigger, Avatar, Menu, MenuItem, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  const menuItems = [
    { text: 'Client Gallery', link: '/gallery', protected: true },
    { text: 'Store', link: '/store', protected: true },
    { text: 'Website', link: '/website', protected: false },
    { text: 'Studio Manager', link: '/studio', protected: false },
    { text: 'Mobile App', link: '/mobile', protected: false },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      handleMenuClose();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const isActive = (path) => location.pathname === path;

  const filteredMenuItems = menuItems.filter(
    item => !item.protected || (item.protected && user)
  );

  return (
    <AppBar 
      position="sticky" 
      elevation={trigger ? 1 : 0} 
      sx={{ 
        bgcolor: 'background.default',
        borderBottom: trigger ? 'none' : '1px solid',
        borderColor: 'grey.200'
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Box 
              component="img" 
              src="/logo.png" 
              alt="Pixieset" 
              sx={{ 
                height: 32,
                '&:hover': {
                  opacity: 0.8
                }
              }} 
            />
          </Link>

          {/* Desktop Menu */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, alignItems: 'center' }}>
            {filteredMenuItems.map((item) => (
              <Button
                key={item.text}
                component={Link}
                to={item.link}
                color="primary"
                sx={{
                  px: 2,
                  py: 1,
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: 2,
                    bgcolor: 'primary.main',
                    transform: isActive(item.link) ? 'scaleX(1)' : 'scaleX(0)',
                    transition: 'transform 0.3s ease-in-out',
                  },
                  '&:hover::after': {
                    transform: 'scaleX(1)',
                  }
                }}
              >
                {item.text}
              </Button>
            ))}

            {user ? (
              <>
                <IconButton
                  onClick={handleMenuOpen}
                  sx={{
                    ml: 2,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      transition: 'transform 0.2s ease-in-out',
                    }
                  }}
                >
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    {user.name ? user.name[0].toUpperCase() : <AccountCircleIcon />}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  onClick={handleMenuClose}
                >
                  <MenuItem onClick={() => navigate('/profile')}>Profile</MenuItem>
                  <MenuItem onClick={() => navigate('/settings')}>Settings</MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  component={Link}
                  to="/login"
                  color="primary"
                >
                  Sign In
                </Button>
                <Button
                  component={Link}
                  to="/register"
                  variant="contained"
                  color="primary"
                  sx={{
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      transition: 'transform 0.2s ease-in-out',
                    }
                  }}
                >
                  Get Started
                </Button>
              </Box>
            )}
          </Box>

          {/* Mobile Menu Icon */}
          <IconButton
            color="primary"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{ 
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            width: 280,
            bgcolor: 'background.default'
          }
        }}
      >
        <List sx={{ pt: 2 }}>
          {filteredMenuItems.map((item) => (
            <ListItem key={item.text} sx={{ px: 2, py: 1 }}>
              <Button
                fullWidth
                component={Link}
                to={item.link}
                onClick={handleDrawerToggle}
                sx={{
                  justifyContent: 'flex-start',
                  color: isActive(item.link) ? 'primary.main' : 'text.primary',
                  bgcolor: isActive(item.link) ? 'primary.light' : 'transparent',
                  '&:hover': {
                    bgcolor: 'primary.light',
                  }
                }}
              >
                {item.text}
              </Button>
            </ListItem>
          ))}
          <Divider sx={{ my: 2 }} />
          {user ? (
            <>
              <ListItem sx={{ px: 2, py: 1 }}>
                <Button
                  fullWidth
                  onClick={() => {
                    handleDrawerToggle();
                    navigate('/profile');
                  }}
                >
                  Profile
                </Button>
              </ListItem>
              <ListItem sx={{ px: 2, py: 1 }}>
                <Button
                  fullWidth
                  onClick={() => {
                    handleDrawerToggle();
                    navigate('/settings');
                  }}
                >
                  Settings
                </Button>
              </ListItem>
              <ListItem sx={{ px: 2, py: 1 }}>
                <Button
                  fullWidth
                  onClick={() => {
                    handleDrawerToggle();
                    handleLogout();
                  }}
                  color="primary"
                >
                  Logout
                </Button>
              </ListItem>
            </>
          ) : (
            <>
              <ListItem sx={{ px: 2, py: 1 }}>
                <Button
                  fullWidth
                  component={Link}
                  to="/login"
                  onClick={handleDrawerToggle}
                >
                  Sign In
                </Button>
              </ListItem>
              <ListItem sx={{ px: 2, py: 1 }}>
                <Button
                  fullWidth
                  component={Link}
                  to="/register"
                  variant="contained"
                  color="primary"
                  onClick={handleDrawerToggle}
                >
                  Get Started
                </Button>
              </ListItem>
            </>
          )}
        </List>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
