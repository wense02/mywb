require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const net = require('net');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.REACT_APP_URL || 'http://localhost:3002',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(helmet());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File is too large. Maximum size is 10MB.' });
    }
    return res.status(400).json({ message: err.message });
  } else if (err) {
    return res.status(500).json({ message: err.message });
  }
  next();
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pixieset-clone', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB successfully');
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});

mongoose.connection.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});

// Models
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const gallerySchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  coverImage: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  images: [{
    url: String,
    description: String,
    likes: { type: Number, default: 0 },
    isLiked: { type: Boolean, default: false }
  }],
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);
const Gallery = mongoose.model('Gallery', gallerySchema);

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only images are allowed'));
  },
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'Server is running', mongoConnection: mongoose.connection.readyState === 1 });
});

app.get('/health', (req, res) => {
  const health = {
    uptime: process.uptime(),
    timestamp: Date.now(),
    mongoConnection: mongoose.connection.readyState === 1,
    message: 'OK',
    date: new Date()
  };
  res.json(health);
});

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  console.log('Register request received:', req.body);
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      console.log('Missing required fields');
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    console.log('User created successfully:', email);

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  console.log('Login request received:', req.body);
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      console.log('Invalid password:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

// Gallery routes
app.post('/api/galleries', authenticateToken, upload.array('images', 50), async (req, res) => {
  console.log('Create gallery request received:', req.body);
  try {
    const { title, date } = req.body;
    const images = req.files?.map(file => ({
      url: `/uploads/${file.filename}`,
      description: ''
    })) || [];

    const gallery = new Gallery({
      title,
      date,
      userId: req.user.id,
      images,
      coverImage: images.length > 0 ? images[0].url : null
    });

    await gallery.save();
    console.log('Gallery created successfully:', title);
    res.json(gallery);
  } catch (error) {
    console.error('Error creating gallery:', error);
    res.status(500).json({ message: 'Error creating gallery' });
  }
});

app.get('/api/galleries', authenticateToken, async (req, res) => {
  console.log('Get galleries request received');
  try {
    const galleries = await Gallery.find({ userId: req.user.id }).sort({ createdAt: -1 });
    console.log('Galleries fetched successfully');
    res.json(galleries);
  } catch (error) {
    console.error('Error fetching galleries:', error);
    res.status(500).json({ message: 'Error fetching galleries' });
  }
});

app.get('/api/galleries/:id', authenticateToken, async (req, res) => {
  console.log('Get gallery request received:', req.params.id);
  try {
    const gallery = await Gallery.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!gallery) {
      console.log('Gallery not found:', req.params.id);
      return res.status(404).json({ message: 'Gallery not found' });
    }

    console.log('Gallery fetched successfully:', req.params.id);
    res.json(gallery);
  } catch (error) {
    console.error('Error fetching gallery:', error);
    res.status(500).json({ message: 'Error fetching gallery' });
  }
});

app.post('/api/galleries/:id/images', authenticateToken, upload.array('images', 50), async (req, res) => {
  console.log('Upload images request received:', req.params.id);
  try {
    const gallery = await Gallery.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!gallery) {
      console.log('Gallery not found:', req.params.id);
      return res.status(404).json({ message: 'Gallery not found' });
    }

    const newImages = req.files.map(file => ({
      url: `/uploads/${file.filename}`,
      description: ''
    }));

    gallery.images.push(...newImages);
    if (!gallery.coverImage && newImages.length > 0) {
      gallery.coverImage = newImages[0].url;
    }

    await gallery.save();
    console.log('Images uploaded successfully:', req.params.id);
    res.json(gallery);
  } catch (error) {
    console.error('Error uploading images:', error);
    res.status(500).json({ message: 'Error uploading images' });
  }
});

app.put('/api/galleries/:id/images/:imageId', authenticateToken, async (req, res) => {
  console.log('Update image request received:', req.params.id, req.params.imageId);
  try {
    const { description } = req.body;
    const gallery = await Gallery.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.id,
        'images._id': req.params.imageId,
      },
      {
        $set: {
          'images.$.description': description,
        },
      },
      { new: true }
    );

    if (!gallery) {
      console.log('Gallery or image not found:', req.params.id, req.params.imageId);
      return res.status(404).json({ message: 'Gallery or image not found' });
    }

    console.log('Image updated successfully:', req.params.id, req.params.imageId);
    res.json(gallery);
  } catch (error) {
    console.error('Error updating image:', error);
    res.status(500).json({ message: 'Error updating image' });
  }
});

app.post('/api/galleries/:galleryId/images/:imageId/like', authenticateToken, async (req, res) => {
  console.log('Like image request received:', req.params.galleryId, req.params.imageId);
  try {
    const gallery = await Gallery.findOne({
      _id: req.params.galleryId,
      userId: req.user.id
    });

    if (!gallery) {
      console.log('Gallery not found:', req.params.galleryId);
      return res.status(404).json({ message: 'Gallery not found' });
    }

    const image = gallery.images.id(req.params.imageId);
    if (!image) {
      console.log('Image not found:', req.params.imageId);
      return res.status(404).json({ message: 'Image not found' });
    }

    image.isLiked = !image.isLiked;
    image.likes = image.isLiked ? (image.likes || 0) + 1 : (image.likes || 1) - 1;

    await gallery.save();
    console.log('Image liked successfully:', req.params.galleryId, req.params.imageId);
    res.json(gallery);
  } catch (error) {
    console.error('Error updating image like:', error);
    res.status(500).json({ message: 'Error updating image like' });
  }
});

app.put('/api/galleries/:id/cover', authenticateToken, async (req, res) => {
  console.log('Update gallery cover request received:', req.params.id);
  try {
    const gallery = await Gallery.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!gallery) {
      console.log('Gallery not found:', req.params.id);
      return res.status(404).json({ message: 'Gallery not found' });
    }

    gallery.coverImage = req.body.coverImage;
    await gallery.save();
    console.log('Gallery cover updated successfully:', req.params.id);
    res.json(gallery);
  } catch (error) {
    console.error('Error updating gallery cover:', error);
    res.status(500).json({ message: 'Error updating gallery cover' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

// Start the server
const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API URL: http://localhost:${PORT}`);
});
