import express from 'express';
import { dashboardController } from '../controllers/dashboardController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Dashboard overview
router.get('/overview', dashboardController.getOverview);
router.get('/stats', dashboardController.getStats);

// Financial data
router.get('/revenue', dashboardController.getRevenue);
router.get('/expenses', dashboardController.getExpenses);

// Reports
router.get('/reports/occupancy', dashboardController.getOccupancyReport);
router.get('/reports/maintenance', dashboardController.getMaintenanceReport);
router.get('/reports/payments', dashboardController.getPaymentReport);

export default router;