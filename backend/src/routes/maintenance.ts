import express from 'express';
import { maintenanceController } from '../controllers/maintenanceController';
import { authenticateToken, requireLandlordOrManager } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get maintenance requests (filtered by user role)
router.get('/', maintenanceController.getMaintenanceRequests);
router.get('/:id', maintenanceController.getMaintenanceRequestById);

// Create maintenance request (tenants can create)
router.post('/', maintenanceController.createMaintenanceRequest);

// Update maintenance request (landlords and managers only)
router.put('/:id', requireLandlordOrManager, maintenanceController.updateMaintenanceRequest);
router.patch('/:id/status', requireLandlordOrManager, maintenanceController.updateRequestStatus);
router.patch('/:id/assign', requireLandlordOrManager, maintenanceController.assignRequest);

export default router;