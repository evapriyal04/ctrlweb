import express from 'express';
import { userController } from '../controllers/userController';
import { authenticateToken, requireAdmin, requirePropertyManager } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get users (admin and property managers only)
router.get('/', requirePropertyManager, userController.getUsers);
router.get('/:id', requirePropertyManager, userController.getUserById);

// User management (admin only)
router.post('/', requireAdmin, userController.createUser);
router.put('/:id', requireAdmin, userController.updateUser);
router.patch('/:id/status', requireAdmin, userController.updateUserStatus);
router.delete('/:id', requireAdmin, userController.deleteUser);

export default router;