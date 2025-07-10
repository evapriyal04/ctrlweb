import express from 'express';
import { paymentController } from '../controllers/paymentController';
import { authenticateToken, requireLandlordOrManager } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get payments (filtered by user role)
router.get('/', paymentController.getPayments);
router.get('/:id', paymentController.getPaymentById);

// Payment management
router.post('/', requireLandlordOrManager, paymentController.createPayment);
router.put('/:id', requireLandlordOrManager, paymentController.updatePayment);
router.patch('/:id/status', paymentController.updatePaymentStatus);

// Payment processing
router.post('/:id/process', paymentController.processPayment);

export default router;