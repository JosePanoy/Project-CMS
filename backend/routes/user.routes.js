// user.routes.js
import express from 'express';
import { createUser, login, getUserInfo, getAllUsers, getUserById } from '../controllers/user.controller.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.post('/register', upload.single('profilePic'), createUser);
router.post('/login', login);
router.get('/info', getUserInfo);
router.get('/', getAllUsers);
router.get('/:id', getUserById);

export default router;
