import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  IconButton,
  LinearProgress,
  Snackbar,
  Alert,
  CircularProgress,
  ImageList,
  ImageListItem,
  Fab,
  Tooltip,
  Zoom,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import { useDropzone } from 'react-dropzone';
import { useTheme } from '@mui/material/styles';
import { useScrollReveal, animationVariants } from '../hooks/useScrollAnimation';

const Gallery = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const API_URL = process.env.REACT_APP_API_URL;

  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [newGallery, setNewGallery] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Scroll animations
  const headerReveal = useScrollReveal({ delay: 0.2 });
  const fabReveal = useScrollReveal({ delay: 0.4, direction: 'up' });

  const fetchGalleries = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/galleries`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch galleries');
      }

      const data = await response.json();
      setGalleries(data);
    } catch (err) {
      setError('Failed to load galleries');
      console.error('Error fetching galleries:', err);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchGalleries();
  }, [fetchGalleries]);

  const onDrop = useCallback((acceptedFiles) => {
    setSelectedFiles(prev => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    }
  });

  const handleCreateGallery = async (e) => {
    e.preventDefault();
    try {
      if (!newGallery.title || !newGallery.date) {
        setSnackbar({
          open: true,
          message: 'Title and date are required',
          severity: 'error'
        });
        return;
      }

      setUploadingImages(true);
      setUploadProgress(0);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }

      const formData = new FormData();
      formData.append('title', newGallery.title);
      formData.append('date', newGallery.date);
      
      if (selectedFiles.length === 0) {
        setSnackbar({
          open: true,
          message: 'Please select at least one image',
          severity: 'error'
        });
        return;
      }

      selectedFiles.forEach(file => {
        if (file.size > 10 * 1024 * 1024) {
          throw new Error(`File ${file.name} is too large. Maximum size is 10MB.`);
        }
        formData.append('images', file);
      });

      const xhr = new XMLHttpRequest();
      
      return new Promise((resolve, reject) => {
        xhr.open('POST', `${API_URL}/api/galleries`);
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(progress);
          }
        };

        xhr.onload = () => {
          try {
            const response = JSON.parse(xhr.response);
            
            if (xhr.status === 200) {
              setGalleries([response, ...galleries]);
              setOpenDialog(false);
              setNewGallery({ title: '', date: new Date().toISOString().split('T')[0] });
              setSelectedFiles([]);
              setSnackbar({
                open: true,
                message: 'Gallery created successfully!',
                severity: 'success'
              });
              resolve(response);
            } else {
              throw new Error(response.message || 'Failed to create gallery');
            }
          } catch (error) {
            reject(new Error(error.message || 'Failed to create gallery'));
          }
        };

        xhr.onerror = () => {
          reject(new Error('Network error occurred while creating gallery'));
        };

        xhr.send(formData);
      });
    } catch (err) {
      console.error('Error creating gallery:', err);
      setSnackbar({
        open: true,
        message: err.message || 'Failed to create gallery',
        severity: 'error'
      });
    } finally {
      setUploadingImages(false);
      setUploadProgress(0);
    }
  };

  const handleViewGallery = (galleryId) => {
    navigate(`/gallery/${galleryId}`);
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        bgcolor: 'background.default'
      }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <CircularProgress size={60} thickness={4} />
        </motion.div>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      py: 8, 
      bgcolor: 'background.default',
      minHeight: '100vh',
      position: 'relative'
    }}>
      <Container maxWidth="lg">
        <motion.div
          ref={headerReveal.ref}
          variants={animationVariants.fadeInUp}
          initial="hidden"
          animate={headerReveal.animate}
        >
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 6,
            flexDirection: { xs: 'column', md: 'row' },
            gap: { xs: 3, md: 0 }
          }}>
            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Typography 
                variant="h2" 
                component="h1" 
                sx={{ 
                  fontWeight: 800,
                  mb: 2,
                  background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, #f8fafc 0%, #3b82f6 50%, #8b5cf6 100%)'
                    : 'linear-gradient(135deg, #111827 0%, #2563eb 50%, #7c3aed 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Client Galleries
              </Typography>
              <Typography 
                variant="h6" 
                color="text.secondary"
                sx={{ maxWidth: 500 }}
              >
                Manage and share your beautiful photo collections with clients
              </Typography>
            </Box>
          </Box>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Alert 
              severity="error" 
              sx={{ 
                mb: 4, 
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.15)'
              }}
            >
              {error}
            </Alert>
          </motion.div>
        )}

        {galleries.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Box sx={{ 
              textAlign: 'center', 
              py: 12,
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(145deg, #1e293b 0%, #334155 100%)'
                : 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
              borderRadius: 4,
              border: `1px solid ${theme.palette.divider}`,
            }}>
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <PhotoLibraryIcon 
                  sx={{ 
                    fontSize: 80, 
                    color: 'primary.main',
                    mb: 3,
                    opacity: 0.7
                  }} 
                />
              </motion.div>
              <Typography variant="h4" color="text.secondary" gutterBottom>
                No galleries found
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
                Create your first gallery to start sharing your amazing photos with clients
              </Typography>
              <Button
                variant="contained"
                size="large"
                startIcon={<AddIcon />}
                onClick={() => setOpenDialog(true)}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)',
                }}
              >
                Create First Gallery
              </Button>
            </Box>
          </motion.div>
        ) : (
          <motion.div
            variants={animationVariants.staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <Grid container spacing={4}>
              <AnimatePresence>
                {galleries.map((gallery, index) => (
                  <Grid item xs={12} sm={6} lg={4} key={gallery._id}>
                    <motion.div
                      variants={animationVariants.staggerItem}
                      layout
                      whileHover={{ 
                        y: -8,
                        transition: { duration: 0.2 }
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card
                        sx={{
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          borderRadius: 3,
                          overflow: 'hidden',
                          background: theme.palette.mode === 'dark'
                            ? 'linear-gradient(145deg, #1e293b 0%, #334155 100%)'
                            : 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                          border: `1px solid ${theme.palette.divider}`,
                          boxShadow: theme.palette.mode === 'dark'
                            ? '0 8px 32px rgba(0,0,0,0.3)'
                            : '0 8px 25px rgba(0,0,0,0.08)',
                          transition: 'all 0.3s ease-in-out',
                          '&:hover': {
                            boxShadow: theme.palette.mode === 'dark'
                              ? '0 12px 40px rgba(0,0,0,0.4)'
                              : '0 12px 35px rgba(0,0,0,0.15)',
                          }
                        }}
                      >
                        <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                          <CardMedia
                            component="img"
                            height="200"
                            src={`${API_URL}${gallery.coverImage}`}
                            alt={gallery.title}
                            crossOrigin="anonymous"
                            loading="lazy"
                            sx={{
                              transition: 'transform 0.3s ease-in-out',
                              '&:hover': {
                                transform: 'scale(1.05)'
                              }
                            }}
                          />
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 12,
                              right: 12,
                              bgcolor: 'rgba(0,0,0,0.7)',
                              color: 'white',
                              px: 2,
                              py: 0.5,
                              borderRadius: 2,
                              fontSize: '0.875rem',
                              fontWeight: 500,
                            }}
                          >
                            {gallery.images?.length || 0} photos
                          </Box>
                        </Box>
                        
                        <CardContent sx={{ flexGrow: 1, p: 3 }}>
                          <Typography 
                            variant="h6" 
                            gutterBottom
                            sx={{ 
                              fontWeight: 600,
                              mb: 2,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {gallery.title}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ mb: 1 }}
                          >
                            📅 {new Date(gallery.date).toLocaleDateString()}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ mb: 3 }}
                          >
                            📸 {gallery.images?.length || 0} images
                          </Typography>
                          
                          <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={() => handleViewGallery(gallery._id)}
                            sx={{
                              borderRadius: 2,
                              py: 1.2,
                              fontWeight: 600,
                              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                              '&:hover': {
                                transform: 'translateY(-1px)',
                                boxShadow: '0 6px 20px rgba(59, 130, 246, 0.4)',
                              }
                            }}
                          >
                            View Gallery
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </AnimatePresence>
            </Grid>
          </motion.div>
        )}
      </Container>

      {/* Floating Action Button */}
      <motion.div
        ref={fabReveal.ref}
        variants={animationVariants.scaleIn}
        initial="hidden"
        animate={fabReveal.animate}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
        }}
      >
        <Tooltip title="Create New Gallery" TransitionComponent={Zoom}>
          <Fab
            color="primary"
            onClick={() => setOpenDialog(true)}
            sx={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              boxShadow: '0 8px 25px rgba(59, 130, 246, 0.4)',
              '&:hover': {
                transform: 'scale(1.1)',
                boxShadow: '0 12px 35px rgba(59, 130, 246, 0.5)',
              },
              transition: 'all 0.2s ease-in-out'
            }}
          >
            <AddIcon />
          </Fab>
        </Tooltip>
      </motion.div>

      {/* Create Gallery Dialog */}
      <AnimatePresence>
        {openDialog && (
          <Dialog 
            open={openDialog} 
            onClose={() => setOpenDialog(false)} 
            maxWidth="sm" 
            fullWidth
            PaperProps={{
              component: motion.div,
              initial: { opacity: 0, scale: 0.9, y: 50 },
              animate: { opacity: 1, scale: 1, y: 0 },
              exit: { opacity: 0, scale: 0.9, y: 50 },
              transition: { duration: 0.3, ease: "easeOut" },
              sx: {
                borderRadius: 3,
                background: theme.palette.mode === 'dark'
                  ? 'linear-gradient(145deg, #1e293b 0%, #334155 100%)'
                  : 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                border: `1px solid ${theme.palette.divider}`,
              }
            }}
          >
            <DialogTitle sx={{ 
              pb: 2, 
              position: 'relative',
              fontSize: '1.5rem',
              fontWeight: 700
            }}>
              Create New Gallery
              <IconButton
                onClick={() => setOpenDialog(false)}
                sx={{ 
                  position: 'absolute', 
                  right: 8, 
                  top: 8,
                  borderRadius: 2,
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            
            <DialogContent>
              <Box component="form" onSubmit={handleCreateGallery} sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  label="Gallery Title"
                  name="title"
                  value={newGallery.title}
                  onChange={(e) => setNewGallery({ ...newGallery, title: e.target.value })}
                  required
                  sx={{ mb: 3 }}
                />
                <TextField
                  fullWidth
                  label="Date"
                  type="date"
                  name="date"
                  value={newGallery.date}
                  onChange={(e) => setNewGallery({ ...newGallery, date: e.target.value })}
                  required
                  sx={{ mb: 3 }}
                  InputLabelProps={{ shrink: true }}
                />
                
                <Box
                  {...getRootProps()}
                  sx={{
                    p: 4,
                    border: '2px dashed',
                    borderColor: isDragActive ? 'primary.main' : 'grey.300',
                    borderRadius: 2,
                    textAlign: 'center',
                    cursor: 'pointer',
                    mb: 3,
                    background: isDragActive 
                      ? theme.palette.primary.main + '10'
                      : theme.palette.background.default,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      borderColor: 'primary.main',
                      background: theme.palette.primary.main + '05',
                    }
                  }}
                >
                  <input {...getInputProps()} />
                  <motion.div
                    animate={isDragActive ? { scale: 1.05 } : { scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                    <Typography color="primary.main" fontWeight={600}>
                      {isDragActive
                        ? 'Drop the images here'
                        : 'Drag & drop images here, or click to select files'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Supports JPG, PNG files up to 10MB each
                    </Typography>
                  </motion.div>
                </Box>

                {selectedFiles.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                  >
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle1" gutterBottom fontWeight={600}>
                        Selected Images ({selectedFiles.length})
                      </Typography>
                      <ImageList sx={{ maxHeight: 200 }} cols={4} rowHeight={100}>
                        {selectedFiles.map((file, index) => (
                          <ImageListItem key={index}>
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Selected ${index + 1}`}
                              loading="lazy"
                              style={{ 
                                height: '100%', 
                                objectFit: 'cover',
                                borderRadius: 8
                              }}
                              crossOrigin="anonymous"
                            />
                          </ImageListItem>
                        ))}
                      </ImageList>
                    </Box>
                  </motion.div>
                )}

                {uploadingImages && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Box sx={{ mb: 3 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={uploadProgress}
                        sx={{ 
                          height: 8, 
                          borderRadius: 4,
                          backgroundColor: theme.palette.grey[200],
                          '& .MuiLinearProgress-bar': {
                            background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
                          }
                        }}
                      />
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        align="right" 
                        sx={{ mt: 1 }}
                      >
                        {uploadProgress}% uploaded
                      </Typography>
                    </Box>
                  </motion.div>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={uploadingImages}
                  sx={{ 
                    mt: 3,
                    py: 1.5,
                    borderRadius: 2,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                    '&:disabled': {
                      background: theme.palette.grey[300],
                    }
                  }}
                >
                  {uploadingImages ? 'Creating Gallery...' : 'Create Gallery'}
                </Button>
              </Box>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ 
            width: '100%',
            borderRadius: 2,
            boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Gallery;