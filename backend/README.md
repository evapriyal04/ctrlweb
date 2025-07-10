# Apartment Management Backend

A comprehensive Node.js/Express backend API for apartment management software with TypeScript, Prisma ORM, and PostgreSQL.

## Features

### 🏠 **Property Management**
- CRUD operations for properties
- Property search and filtering
- Property status management (Available, Occupied, Maintenance, Unavailable)
- Image upload and management
- Property details (bedrooms, bathrooms, rent, amenities, etc.)

### 👥 **User Management**
- Role-based authentication (Admin, Property Manager, Landlord, Tenant)
- JWT-based authentication
- User registration and login
- Profile management
- Password change and reset

### 📋 **Lease Management**
- Create and manage rental agreements
- Lease status tracking (Active, Expired, Terminated, Pending)
- Tenant assignment to properties
- Lease document management

### 🔧 **Maintenance Requests**
- Tenants can create maintenance requests
- Priority levels (Low, Medium, High, Urgent)
- Category-based organization (Plumbing, Electrical, HVAC, etc.)
- Status tracking (Pending, In Progress, Completed, Cancelled)
- Assignment to maintenance staff

### 💰 **Payment Management**
- Rent payment tracking
- Multiple payment types (Rent, Deposit, Utilities, etc.)
- Payment status management (Pending, Paid, Overdue, etc.)
- Late fee calculation
- Payment history

### 📄 **Document Management**
- File upload and storage
- Document categorization
- Access control based on user roles
- Document download and viewing

### 📊 **Dashboard & Analytics**
- Property occupancy reports
- Revenue and expense tracking
- Maintenance request analytics
- Payment status overview

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT
- **Validation**: Zod
- **Security**: Helmet, CORS, Rate Limiting
- **Logging**: Winston
- **File Upload**: Multer
- **Payment Processing**: Stripe (ready for integration)

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

1. **Clone the repository and navigate to backend**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` file with your database credentials and other settings.

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Run database migrations
   npm run migrate
   
   # Seed the database (optional)
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env` file with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/apartment_management"

# JWT
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="7d"

# Server
PORT=5000
NODE_ENV="development"

# Email Configuration (for password reset)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH="./uploads"

# Stripe (for payments)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Frontend URL
CLIENT_URL="http://localhost:3000"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Properties
- `GET /api/properties` - Get all properties (filtered by role)
- `GET /api/properties/search` - Search properties with filters
- `GET /api/properties/:id` - Get property by ID
- `POST /api/properties` - Create new property (Landlord/Manager)
- `PUT /api/properties/:id` - Update property (Landlord/Manager)
- `DELETE /api/properties/:id` - Delete property (Landlord/Manager)
- `PATCH /api/properties/:id/status` - Update property status

### Leases
- `GET /api/leases` - Get leases (filtered by role)
- `GET /api/leases/:id` - Get lease by ID
- `POST /api/leases` - Create new lease (Landlord/Manager)
- `PUT /api/leases/:id` - Update lease (Landlord/Manager)
- `PATCH /api/leases/:id/status` - Update lease status

### Maintenance
- `GET /api/maintenance` - Get maintenance requests (filtered by role)
- `GET /api/maintenance/:id` - Get maintenance request by ID
- `POST /api/maintenance` - Create maintenance request (All users)
- `PUT /api/maintenance/:id` - Update maintenance request (Landlord/Manager)
- `PATCH /api/maintenance/:id/status` - Update request status
- `PATCH /api/maintenance/:id/assign` - Assign request to staff

### Payments
- `GET /api/payments` - Get payments (filtered by role)
- `GET /api/payments/:id` - Get payment by ID
- `POST /api/payments` - Create payment record (Landlord/Manager)
- `PUT /api/payments/:id` - Update payment (Landlord/Manager)
- `PATCH /api/payments/:id/status` - Update payment status
- `POST /api/payments/:id/process` - Process payment

### Users (Admin/Manager only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user (Admin)
- `PUT /api/users/:id` - Update user (Admin)
- `PATCH /api/users/:id/status` - Update user status (Admin)

### Documents
- `GET /api/documents` - Get documents (filtered by access)
- `GET /api/documents/:id` - Get document by ID
- `POST /api/documents/upload` - Upload document
- `PUT /api/documents/:id` - Update document metadata
- `DELETE /api/documents/:id` - Delete document

### Dashboard
- `GET /api/dashboard/overview` - Get dashboard overview
- `GET /api/dashboard/stats` - Get statistics
- `GET /api/dashboard/revenue` - Get revenue data
- `GET /api/dashboard/reports/occupancy` - Get occupancy report

## Database Schema

The system uses the following main entities:

- **Users** - System users with different roles
- **Properties** - Rental properties with details and amenities
- **Leases** - Rental agreements between landlords and tenants
- **MaintenanceRequests** - Property maintenance and repair requests
- **Payments** - Rent and other payment records
- **Documents** - File attachments for leases, properties, etc.

## Role-Based Access Control

### Admin
- Full system access
- User management
- All CRUD operations

### Property Manager
- Manage assigned properties
- Handle maintenance requests
- View tenant information
- Process payments

### Landlord
- Manage owned properties
- Create and manage leases
- View property analytics
- Handle maintenance for owned properties

### Tenant
- View assigned property details
- Create maintenance requests
- View payment history
- Access lease documents

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting to prevent abuse
- CORS protection
- Helmet for security headers
- Input validation with Zod
- Role-based access control

## Development Scripts

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Database operations
npm run migrate          # Run database migrations
npm run migrate:deploy   # Deploy migrations to production
npm run db:generate      # Generate Prisma client
npm run db:seed          # Seed database with sample data
```

## Production Deployment

1. Set up PostgreSQL database
2. Configure environment variables
3. Build the application: `npm run build`
4. Run migrations: `npm run migrate:deploy`
5. Start the server: `npm start`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please contact the development team or create an issue in the repository.