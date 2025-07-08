import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Container,
  IconButton,
  Drawer,
  List,
  ListItem,
  useScrollTrigger,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Switch,
  FormControlLabel,
  Tooltip,
  Zoom,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme as useMuiTheme } from "@mui/material/styles";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { mode, toggleTheme } = useTheme();
  const muiTheme = useMuiTheme();
  
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  const menuItems = [
    // Public menu items (shown when not logged in)
    { text: "Features", link: "/#features", protected: false, public: true },
    { text: "Pricing", link: "/#pricing", protected: false, public: true },
    { text: "Contact", link: "/#contact", protected: false, public: true },
    
    // Protected menu items (shown when logged in)
    { text: "Dashboard", link: "/dashboard", protected: true, public: false },
    { text: "Client Gallery", link: "/gallery", protected: true, public: false },
    { text: "Store", link: "/store", protected: true, public: false },
    { text: "Settings", link: "/settings", protected: true, public: false },
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
      navigate("/");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  const isActive = (path) => location.pathname === path;

  const filteredMenuItems = user 
    ? menuItems.filter(item => item.protected && !item.public)
    : menuItems.filter(item => !item.protected && item.public);

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: trigger ? 'background.paper' : 'transparent',
        backdropFilter: trigger ? 'blur(20px)' : 'none',
        borderBottom: trigger ? `1px solid ${muiTheme.palette.divider}` : 'none',
        transition: 'all 0.3s ease-in-out',
        boxShadow: trigger ? '0 4px 20px rgba(0,0,0,0.08)' : 'none',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
              <Box
                component="img"
                src="/logo.png"
                alt="Pixieset"
                crossOrigin="anonymous"
                loading="lazy"
                sx={{
                  height: 40,
                  transition: "all 0.2s ease-in-out",
                  filter: mode === 'dark' ? 'brightness(1.2)' : 'none',
                  "&:hover": {
                    opacity: 0.8,
                  },
                }}
              />
            </Link>
          </motion.div>

          {/* Desktop Menu */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 1,
              alignItems: "center",
            }}
          >
            {filteredMenuItems.map((item, index) => (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -2 }}
              >
                <Button
                  component={Link}
                  to={item.link}
                  color="primary"
                  sx={{
                    px: 3,
                    py: 1.5,
                    position: "relative",
                    borderRadius: 2,
                    transition: "all 0.2s ease-in-out",
                    backgroundColor: isActive(item.link) 
                      ? muiTheme.palette.primary.main + '10' 
                      : 'transparent',
                    color: isActive(item.link) 
                      ? 'primary.main' 
                      : 'text.primary',
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      bottom: 4,
                      left: "50%",
                      width: isActive(item.link) ? "80%" : "0%",
                      height: 2,
                      bgcolor: "primary.main",
                      transform: "translateX(-50%)",
                      transition: "width 0.3s ease-in-out",
                      borderRadius: 1,
                    },
                    "&:hover": {
                      backgroundColor: muiTheme.palette.primary.main + '15',
                      "&::after": {
                        width: "80%",
                      },
                    },
                  }}
                >
                  {item.text}
                </Button>
              </motion.div>
            ))}

            {/* Theme Toggle */}
            <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`} TransitionComponent={Zoom}>
              <motion.div
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.9 }}
              >
                <IconButton
                  onClick={toggleTheme}
                  sx={{
                    ml: 2,
                    p: 1.5,
                    borderRadius: 2,
                    transition: "all 0.2s ease-in-out",
                    backgroundColor: muiTheme.palette.primary.main + '10',
                    "&:hover": {
                      backgroundColor: muiTheme.palette.primary.main + '20',
                    },
                  }}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={mode}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180 }}
                      transition={{ duration: 0.2 }}
                    >
                      {mode === "light" ? (
                        <DarkModeIcon sx={{ color: 'primary.main' }} />
                      ) : (
                        <LightModeIcon sx={{ color: 'primary.main' }} />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </IconButton>
              </motion.div>
            </Tooltip>

            {user ? (
              <>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <IconButton
                    onClick={handleMenuOpen}
                    sx={{
                      ml: 2,
                      p: 0,
                      border: '2px solid',
                      borderColor: 'primary.main',
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        borderColor: 'primary.dark',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      },
                    }}
                  >
                    <Avatar sx={{ 
                      bgcolor: "primary.main",
                      width: 40,
                      height: 40,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                    }}>
                      {user.name ? (
                        user.name[0].toUpperCase()
                      ) : (
                        <AccountCircleIcon />
                      )}
                    </Avatar>
                  </IconButton>
                </motion.div>
                
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  onClick={handleMenuClose}
                  PaperProps={{
                    sx: {
                      mt: 1.5,
                      minWidth: 200,
                      borderRadius: 2,
                      boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                      border: `1px solid ${muiTheme.palette.divider}`,
                    }
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <MenuItem 
                    onClick={() => navigate("/profile")}
                    sx={{ py: 1.5, borderRadius: 1, mx: 1, my: 0.5 }}
                  >
                    Profile
                  </MenuItem>
                  <MenuItem 
                    onClick={() => navigate("/settings")}
                    sx={{ py: 1.5, borderRadius: 1, mx: 1, my: 0.5 }}
                  >
                    Settings
                  </MenuItem>
                  <Divider sx={{ my: 1 }} />
                  <MenuItem 
                    onClick={handleLogout}
                    sx={{ 
                      py: 1.5, 
                      borderRadius: 1, 
                      mx: 1, 
                      my: 0.5,
                      color: 'error.main',
                      '&:hover': {
                        backgroundColor: 'error.light',
                        color: 'error.dark',
                      }
                    }}
                  >
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: "flex", gap: 2, ml: 2 }}>
                <motion.div
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    component={Link} 
                    to="/login" 
                    color="primary"
                    sx={{
                      px: 3,
                      py: 1,
                      borderRadius: 2,
                      transition: "all 0.2s ease-in-out",
                    }}
                  >
                    Sign In
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    component={Link}
                    to="/register"
                    variant="contained"
                    color="primary"
                    sx={{
                      px: 3,
                      py: 1,
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        boxShadow: '0 6px 20px rgba(59, 130, 246, 0.4)',
                      },
                    }}
                  >
                    Get Started
                  </Button>
                </motion.div>
              </Box>
            )}
          </Box>

          {/* Mobile Menu Icon */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <IconButton
              color="primary"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ 
                display: { md: "none" },
                borderRadius: 2,
                p: 1.5,
              }}
            >
              <MenuIcon />
            </IconButton>
          </motion.div>
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: 300,
            bgcolor: "background.paper",
            borderLeft: `1px solid ${muiTheme.palette.divider}`,
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box
              component="img"
              src="/logo.png"
              alt="Pixieset"
              sx={{ height: 32 }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={mode === 'dark'}
                  onChange={toggleTheme}
                  color="primary"
                />
              }
              label={mode === 'light' ? '🌙' : '☀️'}
            />
          </Box>
          
          <List sx={{ px: 0 }}>
            {filteredMenuItems.map((item, index) => (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ListItem sx={{ px: 0, py: 0.5 }}>
                  <Button
                    fullWidth
                    component={Link}
                    to={item.link}
                    onClick={handleDrawerToggle}
                    sx={{
                      justifyContent: "flex-start",
                      px: 3,
                      py: 2,
                      borderRadius: 2,
                      color: isActive(item.link) ? "primary.main" : "text.primary",
                      bgcolor: isActive(item.link)
                        ? muiTheme.palette.primary.main + '10'
                        : "transparent",
                      "&:hover": {
                        bgcolor: muiTheme.palette.primary.main + '15',
                      },
                    }}
                  >
                    {item.text}
                  </Button>
                </ListItem>
              </motion.div>
            ))}
            
            <Divider sx={{ my: 2 }} />
            
            {user ? (
              <>
                <ListItem sx={{ px: 0, py: 0.5 }}>
                  <Button
                    fullWidth
                    onClick={() => {
                      handleDrawerToggle();
                      navigate("/profile");
                    }}
                    sx={{ justifyContent: "flex-start", px: 3, py: 2, borderRadius: 2 }}
                  >
                    Profile
                  </Button>
                </ListItem>
                <ListItem sx={{ px: 0, py: 0.5 }}>
                  <Button
                    fullWidth
                    onClick={() => {
                      handleDrawerToggle();
                      navigate("/settings");
                    }}
                    sx={{ justifyContent: "flex-start", px: 3, py: 2, borderRadius: 2 }}
                  >
                    Settings
                  </Button>
                </ListItem>
                <ListItem sx={{ px: 0, py: 0.5 }}>
                  <Button
                    fullWidth
                    onClick={() => {
                      handleDrawerToggle();
                      handleLogout();
                    }}
                    sx={{ 
                      justifyContent: "flex-start", 
                      px: 3, 
                      py: 2, 
                      borderRadius: 2,
                      color: 'error.main',
                      '&:hover': {
                        backgroundColor: 'error.light',
                      }
                    }}
                  >
                    Logout
                  </Button>
                </ListItem>
              </>
            ) : (
              <>
                <ListItem sx={{ px: 0, py: 0.5 }}>
                  <Button
                    fullWidth
                    component={Link}
                    to="/login"
                    onClick={handleDrawerToggle}
                    sx={{ justifyContent: "flex-start", px: 3, py: 2, borderRadius: 2 }}
                  >
                    Sign In
                  </Button>
                </ListItem>
                <ListItem sx={{ px: 0, py: 0.5 }}>
                  <Button
                    fullWidth
                    component={Link}
                    to="/register"
                    variant="contained"
                    color="primary"
                    onClick={handleDrawerToggle}
                    sx={{ justifyContent: "flex-start", px: 3, py: 2, borderRadius: 2 }}
                  >
                    Get Started
                  </Button>
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;