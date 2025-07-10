import express from 'express';
import { leaseController } from '../controllers/leaseController';
import { authenticateToken, requireLandlordOrManager } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get leases (filtered by user role)
router.get('/', leaseController.getLeases);
router.get('/:id', leaseController.getLeaseById);

// Lease management (landlords and managers only)
router.post('/', requireLandlordOrManager, leaseController.createLease);
router.put('/:id', requireLandlordOrManager, leaseController.updateLease);
router.patch('/:id/status', requireLandlordOrManager, leaseController.updateLeaseStatus);
router.delete('/:id', requireLandlordOrManager, leaseController.deleteLease);

// Lease documents
router.get('/:id/documents', leaseController.getLeaseDocuments);

export default router;