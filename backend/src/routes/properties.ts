import express from 'express';
import { propertyController } from '../controllers/propertyController';
import { authenticateToken, requireLandlordOrManager } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Public property browsing (for tenants)
router.get('/', propertyController.getProperties);
router.get('/search', propertyController.searchProperties);
router.get('/:id', propertyController.getPropertyById);

// Property management (landlords and managers only)
router.post('/', requireLandlordOrManager, propertyController.createProperty);
router.put('/:id', requireLandlordOrManager, propertyController.updateProperty);
router.delete('/:id', requireLandlordOrManager, propertyController.deleteProperty);

// Property status management
router.patch('/:id/status', requireLandlordOrManager, propertyController.updatePropertyStatus);

// Property images
router.post('/:id/images', requireLandlordOrManager, propertyController.uploadImages);
router.delete('/:id/images/:imageId', requireLandlordOrManager, propertyController.deleteImage);

export default router;