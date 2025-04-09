const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Enable CORS (important for frontend-backend connection)
app.use(cors());

// Serve the frontend folder as static files (optional now)
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Serve uploaded images publicly
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer config - store uploaded files in /uploads/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname,'..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueName = `capture-${Date.now()}.png`;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// Upload route
app.post('/upload', upload.single('image'), (req, res) => {

    if (!req.file) {
        return res.status(400).json({ error: 'No image uploaded' });
      }
  console.log('📸 Image received:', req.file.filename);
  res.json({ message: 'Image uploaded successfully', filename: req.file.filename });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Backend running at: http://localhost:${PORT}`);
});
