#!/bin/bash

echo "🚀 Starting Sidra Content Factory..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Start services
echo "📦 Starting Docker services..."
docker-compose up -d postgres

# Wait for database
echo "⏳ Waiting for database to be ready..."
sleep 10

# Check if database is ready
echo "🔍 Checking database connection..."
docker-compose exec postgres pg_isready -U sidra_user -d sidra_factory

if [ $? -eq 0 ]; then
    echo "✅ Database is ready!"
else
    echo "❌ Database connection failed!"
    exit 1
fi

# Initialize database
echo "🗄️ Initializing database schema..."
docker-compose exec -T postgres psql -U sidra_user -d sidra_factory < database/init.sql

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Configure environment variables:"
echo "   - cp backend/.env.example backend/.env"
echo "   - cp .env.example .env"
echo ""
echo "2. Start development servers:"
echo "   npm run dev"
echo ""
echo "3. Access applications:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:3001"
echo "   API Docs: http://localhost:3001/api/docs"