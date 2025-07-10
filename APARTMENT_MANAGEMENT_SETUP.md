# 🏠 Apartment Management System - Setup Guide

## Overview

I've created a comprehensive apartment management backend system for you with the following features:

### ✨ Key Features
- **User Management**: Role-based system (Admin, Property Manager, Landlord, Tenant)
- **Property Management**: Full CRUD operations with search and filtering
- **Lease Management**: Rental agreements and tenant assignment
- **Maintenance Requests**: Ticket system for property maintenance
- **Payment Tracking**: Rent payments and financial management
- **Document Management**: File uploads and storage
- **Dashboard Analytics**: Reports and statistics

### 🛠 Technology Stack
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based with role-based access control
- **Security**: Helmet, CORS, rate limiting, input validation
- **File Upload**: Multer support
- **Payment Processing**: Stripe integration ready

## 🚀 Quick Start

### Prerequisites
1. **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
2. **PostgreSQL** (v12 or higher) - [Download here](https://www.postgresql.org/download/)
3. **Git** - [Download here](https://git-scm.com/)

### Setup Instructions

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Run the automated setup script**:
   ```bash
   ./setup.sh
   ```
   
   This script will:
   - Check system requirements
   - Install all dependencies
   - Set up environment variables
   - Generate Prisma client
   - Run database migrations
   - Optionally seed with sample data

3. **Manual setup (if you prefer)**:
   ```bash
   # Install dependencies
   npm install
   
   # Copy environment file
   cp .env.example .env
   # Edit .env with your database credentials
   
   # Generate Prisma client
   npm run db:generate
   
   # Run migrations
   npm run migrate
   
   # Seed database (optional)
   npm run db:seed
   
   # Start development server
   npm run dev
   ```

### 🗄️ Database Setup

1. **Create PostgreSQL database**:
   ```sql
   CREATE DATABASE apartment_management;
   ```

2. **Update your .env file**:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/apartment_management"
   JWT_SECRET="your-super-secret-jwt-key-here"
   PORT=5000
   ```

### 🎯 Testing the API

Once the server is running, you can test it:

1. **Health Check**:
   ```
   GET http://localhost:5000/health
   ```

2. **Register a new user**:
   ```bash
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "password": "password123",
       "firstName": "John",
       "lastName": "Doe",
       "role": "TENANT"
     }'
   ```

3. **Login**:
   ```bash
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "password": "password123"
     }'
   ```

### 📋 Sample User Accounts (if seeded)

If you ran the database seed, these accounts are available:

- **Admin**: `admin@example.com` / `admin123`
- **Property Manager**: `manager@example.com` / `manager123`
- **Landlord**: `landlord@example.com` / `landlord123`
- **Tenant 1**: `tenant1@example.com` / `tenant123`
- **Tenant 2**: `tenant2@example.com` / `tenant123`

## 📚 API Documentation

### Core Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile

#### Properties
- `GET /api/properties` - List properties (role-filtered)
- `POST /api/properties` - Create property (Landlord/Manager)
- `GET /api/properties/search` - Search properties with filters
- `PUT /api/properties/:id` - Update property

#### Leases
- `GET /api/leases` - List leases
- `POST /api/leases` - Create lease agreement
- `PATCH /api/leases/:id/status` - Update lease status

#### Maintenance
- `GET /api/maintenance` - List maintenance requests
- `POST /api/maintenance` - Create maintenance request
- `PATCH /api/maintenance/:id/status` - Update request status

#### Payments
- `GET /api/payments` - List payments
- `POST /api/payments` - Record payment
- `PATCH /api/payments/:id/status` - Update payment status

### 🔐 Authentication

All protected endpoints require a Bearer token:

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:5000/api/properties
```

## 🎨 Frontend Integration

To connect your Next.js frontend to this backend:

1. **Update your frontend API calls** to point to `http://localhost:5000/api`
2. **Store JWT tokens** from login responses
3. **Include Authorization headers** in protected requests
4. **Handle role-based UI** based on user roles

Example API service:
```typescript
// utils/api.ts
const API_BASE = 'http://localhost:5000/api';

export const api = {
  auth: {
    login: (credentials) => 
      fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      }),
    
    register: (userData) =>
      fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })
  },
  
  properties: {
    list: (token) =>
      fetch(`${API_BASE}/properties`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
  }
};
```

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data

### Project Structure
```
backend/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── controllers/           # Route handlers
│   ├── middleware/           # Authentication, error handling
│   ├── routes/               # API routes
│   ├── utils/                # Utilities and helpers
│   └── server.ts             # Main server file
├── package.json
└── README.md
```

## 🚀 Production Deployment

For production deployment:

1. Set up a PostgreSQL database
2. Configure environment variables
3. Build the application: `npm run build`
4. Run migrations: `npm run migrate:deploy`
5. Start the server: `npm start`

## 🆘 Troubleshooting

### Common Issues

1. **Database connection error**:
   - Check PostgreSQL is running
   - Verify DATABASE_URL in .env file
   - Ensure database exists

2. **Port already in use**:
   - Change PORT in .env file
   - Kill process using the port: `lsof -ti:5000 | xargs kill -9`

3. **JWT errors**:
   - Ensure JWT_SECRET is set in .env
   - Use a strong, random secret in production

4. **CORS issues**:
   - Update CLIENT_URL in .env to match your frontend
   - Check CORS configuration in server.ts

### Getting Help

- Check the logs in the `logs/` directory
- Review the console output for specific error messages
- Ensure all environment variables are properly configured

## 🎉 Next Steps

1. **Test all API endpoints** using the provided examples
2. **Integrate with your frontend** React components
3. **Customize the database schema** if needed
4. **Add additional features** like email notifications
5. **Set up proper logging** and monitoring for production

The backend is fully functional and ready to power your apartment management application! 🏠✨