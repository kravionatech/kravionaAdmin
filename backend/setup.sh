#!/bin/bash

# Kraviona Backend Quick Setup Script

echo "🚀 Kraviona Backend Setup"
echo "========================"

# Check if Node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    exit 1
fi

echo "✅ npm version: $(npm --version)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Check if .env exists
if [ ! -f ".env" ]; then
    echo ""
    echo "⚠️  .env file not found"
    echo "📝 Creating .env from .env.example..."
    cp .env.example .env
    echo "✅ .env file created"
    echo ""
    echo "⚠️  IMPORTANT: Edit .env and fill in your credentials:"
    echo "   - MONGODB_URI"
    echo "   - JWT_SECRET_KEY"
    echo "   - CLOUDINARY_CLOUD_NAME, API_KEY, API_SECRET"
    echo "   - RESEND_API_KEY, RESEND_FROM_EMAIL"
    echo ""
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📚 Next steps:"
echo "1. Edit .env with your credentials"
echo "2. Run: npm run dev (for development)"
echo "3. Server will start at: http://localhost:5000"
echo ""
echo "📖 For more info, see: SETUP.md or API_ENDPOINTS.md"
echo ""
