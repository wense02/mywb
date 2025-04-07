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
  ImageListItem
} from '@mui/material';
import { motion } from 'framer-motion';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useDropzone } from 'react-dropzone';
// import { useAuth } from '../contexts/AuthContext';

const Gallery = () => {
  const navigate = useNavigate();
  // const { user } = useAuth(); // We'll keep this for future use
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
        if (file.size > 10 * 1024 * 1024) { // 10MB
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

  const handleUploadImages = async (galleryId) => {
    if (selectedFiles.length === 0) return;

    try {
      setUploadingImages(true);
      setUploadProgress(0);
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      selectedFiles.forEach(file => {
        formData.append('images', file);
      });

      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${API_URL}/api/galleries/${galleryId}/images`);
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(progress);
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200) {
            const updatedGallery = JSON.parse(xhr.response);
            setGalleries(galleries.map(g => 
              g._id === updatedGallery._id ? updatedGallery : g
            ));
            setSelectedFiles([]);
            setSnackbar({
              open: true,
              message: 'Images uploaded successfully!',
              severity: 'success'
            });
            resolve();
          } else {
            reject(new Error('Failed to upload images'));
          }
        };

        xhr.onerror = () => {
          reject(new Error('Failed to upload images'));
        };

        xhr.send(formData);
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to upload images',
        severity: 'error'
      });
      console.error('Error uploading images:', err);
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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }}>
            <Typography variant="h3" component="h1" sx={{ fontWeight: 700 }}>
              Client Galleries
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setOpenDialog(true)}
              sx={{
                px: 3,
                py: 1.5,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  transition: 'transform 0.2s ease-in-out'
                }
              }}
            >
              Create New Gallery
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 4 }}>
              {error}
            </Alert>
          )}

          {galleries.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No galleries found
              </Typography>
              <Typography color="text.secondary">
                Create your first gallery by clicking the button above
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={4}>
              {galleries.map((gallery, index) => (
                <Grid item xs={12} sm={6} md={4} key={gallery._id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                  >
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          transition: 'transform 0.3s ease-in-out'
                        }
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="200"
                        image={gallery.coverImage ? `${API_URL}${gallery.coverImage}` : 'https://source.unsplash.com/800x600/?photography'}
                        alt={gallery.title}
                      />
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {gallery.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Date: {new Date(gallery.date).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {gallery.images?.length || 0} images
                        </Typography>
                        <Button
                          variant="outlined"
                          color="primary"
                          fullWidth
                          sx={{ mt: 2 }}
                          onClick={() => handleViewGallery(gallery._id)}
                        >
                          View Gallery
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          )}
        </motion.div>
      </Container>

      {/* Create Gallery Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Create New Gallery
          <IconButton
            onClick={() => setOpenDialog(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
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
                p: 3,
                border: '2px dashed',
                borderColor: isDragActive ? 'primary.main' : 'grey.300',
                borderRadius: 2,
                textAlign: 'center',
                cursor: 'pointer',
                mb: 3
              }}
            >
              <input {...getInputProps()} />
              <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography>
                {isDragActive
                  ? 'Drop the images here'
                  : 'Drag & drop images here, or click to select files'}
              </Typography>
            </Box>

            {selectedFiles.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Selected Images ({selectedFiles.length})
                </Typography>
                <ImageList sx={{ maxHeight: 200 }} cols={4} rowHeight={100}>
                  {selectedFiles.map((file, index) => (
                    <ImageListItem key={index}>
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Selected ${index + 1}`}
                        loading="lazy"
                        style={{ height: '100%', objectFit: 'cover' }}
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              </Box>
            )}

            {uploadingImages && (
              <Box sx={{ mb: 3 }}>
                <LinearProgress variant="determinate" value={uploadProgress} />
                <Typography variant="body2" color="text.secondary" align="right" sx={{ mt: 1 }}>
                  {uploadProgress}%
                </Typography>
              </Box>
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={uploadingImages}
              sx={{ mt: 3 }}
            >
              {uploadingImages ? 'Creating Gallery...' : 'Create Gallery'}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Gallery;
