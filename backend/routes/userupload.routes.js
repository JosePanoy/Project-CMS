import express from 'express';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import path from 'path';

const router = express.Router();
const upload = multer({ dest: 'usersUpload/' }); 

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401); 

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); 
    req.user = user;
    next();
  });
};

router.post('/upload', authenticateToken, upload.single('contentFile'), (req, res) => {
  try {
    const { caption, contentType, userId } = req.body;
    const file = req.file;

    if (!file || !caption || !contentType || !userId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    res.status(200).json({ message: 'File uploaded successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
