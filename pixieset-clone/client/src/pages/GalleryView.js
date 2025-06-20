import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  ImageList,
  ImageListItem,
  CircularProgress,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  LinearProgress,
  ImageListItemBar,
  Menu,
  MenuItem,
  Tooltip,
  Zoom,
  Fade
} from '@mui/material';
import { motion } from 'framer-motion';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useDropzone } from 'react-dropzone';
// import { useAuth } from '../contexts/AuthContext';

const GalleryView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  const [gallery, setGallery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploadingImages, setUploadingImages] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedImageForMenu, setSelectedImageForMenu] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const fetchGallery = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/galleries/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch gallery');
      }

      const data = await response.json();
      setGallery(data);
    } catch (err) {
      setError('Failed to load gallery');
      console.error('Error fetching gallery:', err);
    } finally {
      setLoading(false);
    }
  }, [API_URL, id]);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  const handleLikeImage = async (imageId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/galleries/${id}/images/${imageId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to like image');
      }

      const updatedGallery = await response.json();
      setGallery(updatedGallery);
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to update like',
        severity: 'error'
      });
    }
  };

  const handleSetAsCover = async (imageUrl) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/galleries/${id}/cover`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ coverImage: imageUrl })
      });

      if (!response.ok) {
        throw new Error('Failed to set cover image');
      }

      const updatedGallery = await response.json();
      setGallery(updatedGallery);
      setSnackbar({
        open: true,
        message: 'Cover image updated successfully',
        severity: 'success'
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to update cover image',
        severity: 'error'
      });
    }
    handleCloseMenu();
  };

  const handleOpenMenu = (event, image) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedImageForMenu(image);
  };

  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
    setSelectedImageForMenu(null);
  };

  const onDrop = useCallback((acceptedFiles) => {
    setSelectedFiles(prev => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    }
  });

  const handleUploadImages = async (e) => {
    e?.preventDefault();
    if (selectedFiles.length === 0) return;

    try {
      setUploadingImages(true);
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      selectedFiles.forEach(file => {
        formData.append('images', file);
      });

      const response = await fetch(`${API_URL}/api/galleries/${id}/images`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload images');
      }

      const updatedGallery = await response.json();
      setGallery(updatedGallery);
      setSelectedFiles([]);
      setOpenUploadDialog(false);
      setSnackbar({
        open: true,
        message: 'Images uploaded successfully!',
        severity: 'success'
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
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !gallery) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error">{error || 'Gallery not found'}</Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/gallery')}
          sx={{ mt: 2 }}
        >
          Back to Galleries
        </Button>
      </Container>
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
            <Box>
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/gallery')}
                sx={{ mb: 2 }}
              >
                Back to Galleries
              </Button>
              <Typography variant="h3" component="h1" sx={{ fontWeight: 700 }}>
                {gallery.title}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {new Date(gallery.date).toLocaleDateString()} • {gallery.images?.length || 0} images
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              startIcon={<CloudUploadIcon />}
              onClick={() => setOpenUploadDialog(true)}
            >
              Upload Images
            </Button>
          </Box>

          {gallery.images?.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No images in this gallery
              </Typography>
              <Typography color="text.secondary">
                Upload images by clicking the button above
              </Typography>
            </Box>
          ) : (
            <ImageList variant="masonry" cols={3} gap={16}>
              {gallery.images.map((image, index) => (
                <ImageListItem 
                  key={index}
                  sx={{
                    cursor: 'pointer',
                    overflow: 'hidden',
                    borderRadius: 2,
                    position: 'relative',
                    '&:hover .MuiImageListItemBar-root': {
                      opacity: 1
                    }
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <img
                      src={`${API_URL}${image.url}`}
                      alt={image.description || `Image ${index + 1}`}
                      loading="lazy"
                      crossOrigin="anonymous"
                      style={{
                        borderRadius: 8,
                        width: '100%',
                        height: 'auto',
                        display: 'block'
                      }}
                      onClick={() => {
                        setSelectedImage(image);
                        setPreviewOpen(true);
                      }}
                    />
                    <ImageListItemBar
                      sx={{
                        background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
                        opacity: 0,
                        transition: 'opacity 0.2s',
                      }}
                      actionIcon={
                        <Box sx={{ display: 'flex', gap: 1, pr: 1 }}>
                          <Tooltip title="Preview" TransitionComponent={Zoom}>
                            <IconButton
                              onClick={() => {
                                setSelectedImage(image);
                                setPreviewOpen(true);
                              }}
                              sx={{ color: 'white' }}
                            >
                              <RemoveRedEyeIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={image.isLiked ? 'Unlike' : 'Like'} TransitionComponent={Zoom}>
                            <IconButton
                              onClick={() => handleLikeImage(image._id)}
                              sx={{ color: 'white' }}
                            >
                              {image.isLiked ? (
                                <FavoriteIcon sx={{ color: '#ff1744' }} />
                              ) : (
                                <FavoriteBorderIcon />
                              )}
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="More options" TransitionComponent={Zoom}>
                            <IconButton
                              onClick={(e) => handleOpenMenu(e, image)}
                              sx={{ color: 'white' }}
                            >
                              <MoreVertIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      }
                    />
                  </motion.div>
                </ImageListItem>
              ))}
            </ImageList>
          )}
        </motion.div>
      </Container>

      {/* Image Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="xl"
        fullWidth
      >
        <DialogContent sx={{ p: 0, position: 'relative' }}>
          <IconButton
            onClick={() => setPreviewOpen(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              bgcolor: 'rgba(0,0,0,0.5)',
              color: 'white',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
            }}
          >
            <CloseIcon />
          </IconButton>
          {selectedImage && (
            <Box
              component="img"
              src={`${API_URL}${selectedImage.url}`}
              alt={selectedImage.description}
              sx={{
                width: '100%',
                height: 'auto',
                display: 'block',
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Image Options Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleCloseMenu}
        TransitionComponent={Fade}
      >
        <MenuItem onClick={() => handleSetAsCover(selectedImageForMenu?.url)}>
          Set as Gallery Cover
        </MenuItem>
      </Menu>

      {/* Upload Dialog */}
      <Dialog open={openUploadDialog} onClose={() => setOpenUploadDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Upload Images
          <IconButton
            onClick={() => setOpenUploadDialog(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleUploadImages} sx={{ mt: 2 }}>
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
                        crossOrigin="anonymous"
                        style={{ height: '100%', objectFit: 'cover' }}
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              </Box>
            )}

            {uploadingImages && (
              <Box sx={{ mb: 3 }}>
                <LinearProgress />
              </Box>
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={uploadingImages || selectedFiles.length === 0}
            >
              {uploadingImages ? 'Uploading...' : 'Upload Images'}
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

export default GalleryView;
