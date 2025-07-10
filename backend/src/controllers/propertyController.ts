import { Request, Response } from 'express';
import { PrismaClient, PropertyType, PropertyStatus, UserRole } from '@prisma/client';
import { z } from 'zod';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

// Validation schemas
const createPropertySchema = z.object({
  name: z.string().min(1, 'Property name is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(1, 'ZIP code is required'),
  country: z.string().default('US'),
  type: z.enum(['APARTMENT', 'HOUSE', 'CONDO', 'STUDIO', 'TOWNHOUSE']),
  bedrooms: z.number().int().min(0, 'Bedrooms must be 0 or more'),
  bathrooms: z.number().min(0, 'Bathrooms must be 0 or more'),
  sqft: z.number().int().min(1, 'Square footage must be positive').optional(),
  rent: z.number().min(0, 'Rent must be 0 or more'),
  deposit: z.number().min(0, 'Deposit must be 0 or more'),
  description: z.string().optional(),
  amenities: z.array(z.string()).optional(),
  petPolicy: z.string().optional(),
  smokingPolicy: z.string().optional(),
  managerId: z.string().optional(),
});

const updatePropertySchema = createPropertySchema.partial();

const searchPropertiesSchema = z.object({
  city: z.string().optional(),
  state: z.string().optional(),
  type: z.enum(['APARTMENT', 'HOUSE', 'CONDO', 'STUDIO', 'TOWNHOUSE']).optional(),
  minRent: z.number().min(0).optional(),
  maxRent: z.number().min(0).optional(),
  bedrooms: z.number().int().min(0).optional(),
  bathrooms: z.number().min(0).optional(),
  status: z.enum(['AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'UNAVAILABLE']).optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
});

export const propertyController = {
  async getProperties(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 10, status } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const where: any = {};

      // Filter by status if provided
      if (status && typeof status === 'string') {
        where.status = status;
      }

      // For tenants, only show available properties
      if (req.user?.role === UserRole.TENANT) {
        where.status = PropertyStatus.AVAILABLE;
      }

      // For property managers, only show properties they manage
      if (req.user?.role === UserRole.PROPERTY_MANAGER) {
        where.managerId = req.user.id;
      }

      // For landlords, only show properties they own
      if (req.user?.role === UserRole.LANDLORD) {
        where.ownerId = req.user.id;
      }

      const [properties, total] = await Promise.all([
        prisma.property.findMany({
          where,
          skip,
          take: Number(limit),
          include: {
            manager: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
              },
            },
            owner: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
              },
            },
            _count: {
              select: {
                leases: true,
                maintenanceRequests: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.property.count({ where }),
      ]);

      res.json({
        properties,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error) {
      throw error;
    }
  },

  async getPropertyById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const where: any = { id };

      // Apply role-based filters
      if (req.user?.role === UserRole.PROPERTY_MANAGER) {
        where.managerId = req.user.id;
      } else if (req.user?.role === UserRole.LANDLORD) {
        where.ownerId = req.user.id;
      }

      const property = await prisma.property.findFirst({
        where,
        include: {
          manager: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            },
          },
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            },
          },
          leases: {
            include: {
              tenant: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                  phone: true,
                },
              },
            },
            orderBy: { createdAt: 'desc' },
          },
          maintenanceRequests: {
            include: {
              tenant: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
            orderBy: { createdAt: 'desc' },
            take: 10,
          },
        },
      });

      if (!property) {
        res.status(404).json({ error: 'Property not found' });
        return;
      }

      res.json({ property });
    } catch (error) {
      throw error;
    }
  },

  async createProperty(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = createPropertySchema.parse(req.body);
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      // Set owner based on user role
      let ownerId = userId;
      if (req.user.role === UserRole.PROPERTY_MANAGER && validatedData.managerId) {
        // Property managers need to specify the owner
        ownerId = validatedData.managerId;
      }

      const property = await prisma.property.create({
        data: {
          ...validatedData,
          ownerId,
          managerId: req.user.role === UserRole.PROPERTY_MANAGER ? userId : validatedData.managerId,
        },
        include: {
          manager: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });

      logger.info(`Property created: ${property.name} by user ${userId}`);

      res.status(201).json({
        message: 'Property created successfully',
        property,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: 'Validation failed',
          details: error.errors,
        });
        return;
      }
      throw error;
    }
  },

  async updateProperty(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const validatedData = updatePropertySchema.parse(req.body);
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      // Check if user has permission to update this property
      const existingProperty = await prisma.property.findFirst({
        where: {
          id,
          OR: [
            { ownerId: userId },
            { managerId: userId },
          ],
        },
      });

      if (!existingProperty) {
        res.status(404).json({ error: 'Property not found or access denied' });
        return;
      }

      const updatedProperty = await prisma.property.update({
        where: { id },
        data: validatedData,
        include: {
          manager: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });

      logger.info(`Property updated: ${updatedProperty.name} by user ${userId}`);

      res.json({
        message: 'Property updated successfully',
        property: updatedProperty,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: 'Validation failed',
          details: error.errors,
        });
        return;
      }
      throw error;
    }
  },

  async deleteProperty(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      // Check if user has permission to delete this property
      const existingProperty = await prisma.property.findFirst({
        where: {
          id,
          OR: [
            { ownerId: userId },
            { managerId: userId },
          ],
        },
      });

      if (!existingProperty) {
        res.status(404).json({ error: 'Property not found or access denied' });
        return;
      }

      // Check if property has active leases
      const activeLeases = await prisma.lease.count({
        where: {
          propertyId: id,
          status: 'ACTIVE',
        },
      });

      if (activeLeases > 0) {
        res.status(400).json({ 
          error: 'Cannot delete property with active leases' 
        });
        return;
      }

      await prisma.property.delete({
        where: { id },
      });

      logger.info(`Property deleted: ${existingProperty.name} by user ${userId}`);

      res.json({ message: 'Property deleted successfully' });
    } catch (error) {
      throw error;
    }
  },

  async updatePropertyStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      if (!Object.values(PropertyStatus).includes(status)) {
        res.status(400).json({ error: 'Invalid status' });
        return;
      }

      // Check if user has permission to update this property
      const existingProperty = await prisma.property.findFirst({
        where: {
          id,
          OR: [
            { ownerId: userId },
            { managerId: userId },
          ],
        },
      });

      if (!existingProperty) {
        res.status(404).json({ error: 'Property not found or access denied' });
        return;
      }

      const updatedProperty = await prisma.property.update({
        where: { id },
        data: { status },
      });

      logger.info(`Property status updated: ${updatedProperty.name} to ${status} by user ${userId}`);

      res.json({
        message: 'Property status updated successfully',
        property: updatedProperty,
      });
    } catch (error) {
      throw error;
    }
  },

  async searchProperties(req: Request, res: Response): Promise<void> {
    try {
      const validatedQuery = searchPropertiesSchema.parse(req.query);
      const skip = (validatedQuery.page - 1) * validatedQuery.limit;

      const where: any = {};

      // Build search filters
      if (validatedQuery.city) {
        where.city = { contains: validatedQuery.city, mode: 'insensitive' };
      }

      if (validatedQuery.state) {
        where.state = { contains: validatedQuery.state, mode: 'insensitive' };
      }

      if (validatedQuery.type) {
        where.type = validatedQuery.type;
      }

      if (validatedQuery.bedrooms !== undefined) {
        where.bedrooms = validatedQuery.bedrooms;
      }

      if (validatedQuery.bathrooms !== undefined) {
        where.bathrooms = { gte: validatedQuery.bathrooms };
      }

      if (validatedQuery.minRent !== undefined || validatedQuery.maxRent !== undefined) {
        where.rent = {};
        if (validatedQuery.minRent !== undefined) {
          where.rent.gte = validatedQuery.minRent;
        }
        if (validatedQuery.maxRent !== undefined) {
          where.rent.lte = validatedQuery.maxRent;
        }
      }

      if (validatedQuery.status) {
        where.status = validatedQuery.status;
      }

      // Apply role-based filters
      if (req.user?.role === UserRole.TENANT) {
        where.status = PropertyStatus.AVAILABLE;
      } else if (req.user?.role === UserRole.PROPERTY_MANAGER) {
        where.managerId = req.user.id;
      } else if (req.user?.role === UserRole.LANDLORD) {
        where.ownerId = req.user.id;
      }

      const [properties, total] = await Promise.all([
        prisma.property.findMany({
          where,
          skip,
          take: validatedQuery.limit,
          include: {
            manager: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
              },
            },
            owner: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.property.count({ where }),
      ]);

      res.json({
        properties,
        pagination: {
          page: validatedQuery.page,
          limit: validatedQuery.limit,
          total,
          pages: Math.ceil(total / validatedQuery.limit),
        },
        filters: validatedQuery,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: 'Invalid search parameters',
          details: error.errors,
        });
        return;
      }
      throw error;
    }
  },

  async uploadImages(req: Request, res: Response): Promise<void> {
    try {
      // TODO: Implement image upload functionality with multer
      res.json({ message: 'Image upload functionality to be implemented' });
    } catch (error) {
      throw error;
    }
  },

  async deleteImage(req: Request, res: Response): Promise<void> {
    try {
      // TODO: Implement image deletion functionality
      res.json({ message: 'Image deletion functionality to be implemented' });
    } catch (error) {
      throw error;
    }
  },
};