#!/bin/bash

# Inventory System Backend - Setup Script
# This script handles initial setup of the project

echo "================================"
echo "Inventory System API - Setup"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✓ Node.js version: $(node --version)"
echo "✓ npm version: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✓ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📋 Creating .env file..."
    cp .env.example .env
    echo "✓ .env file created"
    echo ""
    echo "⚠️  IMPORTANT: Update .env with your MySQL credentials:"
    echo "   - DB_HOST"
    echo "   - DB_USER"
    echo "   - DB_PASSWORD"
    echo "   - DB_NAME"
    echo "   - SESSION_SECRET"
else
    echo "✓ .env file already exists"
fi

echo ""
echo "================================"
echo "Setup Complete!"
echo "================================"
echo ""
echo "Next steps:"
echo "1. Update .env with your MySQL credentials"
echo "2. Ensure MySQL is running"
echo "3. Create the database: CREATE DATABASE inventory_system;"
echo "4. Start the server: npm run dev"
echo ""
echo "Server will run on http://localhost:3000"
echo ""
