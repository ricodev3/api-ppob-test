#!/bin/bash

echo "🚀 Setting up Nutech API Project"

# Check if .env exists
if [ -f .env ]; then
    echo "⚠️  .env already exists. Backing up..."
    cp .env .env.backup
fi

# Copy .env.example to .env
echo "📋 Creating .env from template..."
cp .env.example .env

echo ""
echo "📝 Please edit the .env file with your values:"
echo "   1. Update SUPABASE_DB_URL with your database connection"
echo "   2. Set a secure JWT_SECRET"
echo "   3. Update any other values as needed"
echo ""
echo "🛠️  Next steps:"
echo "   1. Edit .env file"
echo "   2. Run: npm install"
echo "   3. Run: npm run migrate"
echo "   4. Run: npm run seed"
echo "   5. Run: npm run dev"
echo ""