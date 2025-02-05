import express from 'express';
import { registerUser, loginUser, getUsers, deleteUser } from '../controllers/userController.js';  // Ajout de deleteUser
import { authenticateUser, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/', authenticateUser, getUsers);
router.delete('/:id', authenticateUser, isAdmin, deleteUser);

export default router;
