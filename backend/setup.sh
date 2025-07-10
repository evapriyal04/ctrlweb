#!/bin/bash

# Apartment Management Backend Setup Script
echo "🏠 Setting up Apartment Management Backend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | sed 's/v//')
REQUIRED_VERSION="18.0.0"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    echo "❌ Node.js version $NODE_VERSION is too old. Please install version 18 or higher."
    exit 1
fi

echo "✅ Node.js version $NODE_VERSION detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Create logs directory
echo "📁 Creating logs directory..."
mkdir -p logs

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit the .env file with your database credentials and other settings before proceeding."
    echo "📍 Database URL format: postgresql://username:password@localhost:5432/apartment_management"
    read -p "Press Enter after you've configured the .env file..."
fi

# Check if PostgreSQL is running
echo "🗄️  Checking PostgreSQL connection..."
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL CLI not found. Make sure PostgreSQL is installed and running."
    echo "📖 Visit: https://www.postgresql.org/download/"
fi

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npm run db:generate

if [ $? -ne 0 ]; then
    echo "❌ Failed to generate Prisma client"
    exit 1
fi

echo "✅ Prisma client generated"

# Ask if user wants to run migrations
read -p "🗄️  Do you want to run database migrations now? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Running database migrations..."
    npm run migrate
    
    if [ $? -eq 0 ]; then
        echo "✅ Database migrations completed"
        
        # Ask if user wants to seed the database
        read -p "🌱 Do you want to seed the database with sample data? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo "🌱 Seeding database..."
            npm run db:seed
            if [ $? -eq 0 ]; then
                echo "✅ Database seeded successfully"
            else
                echo "⚠️  Database seeding failed (this is optional)"
            fi
        fi
    else
        echo "❌ Database migrations failed"
        echo "📝 Please check your database connection in the .env file"
        exit 1
    fi
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📚 Next steps:"
echo "   1. Review and update the .env file if needed"
echo "   2. Start the development server: npm run dev"
echo "   3. The API will be available at: http://localhost:5000"
echo "   4. Health check endpoint: http://localhost:5000/health"
echo ""
echo "📖 Read the README.md for detailed API documentation"
echo "🔧 Available scripts:"
echo "   - npm run dev      (Start development server)"
echo "   - npm run build    (Build for production)"
echo "   - npm start        (Start production server)"
echo ""

# Ask if user wants to start the development server
read -p "🚀 Do you want to start the development server now? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Starting development server..."
    npm run dev
fi