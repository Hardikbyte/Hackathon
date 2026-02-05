#!/bin/bash

# Voice-Activated Browser Automation Setup Script
# This script will install all dependencies and prepare the project for running

set -e  # Exit on any error

echo "🚀 Setting up Voice-Activated Browser Automation..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18+ first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js version: $(node --version)${NC}"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed. Please install npm first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ npm version: $(npm --version)${NC}"
echo ""

# Install backend dependencies
echo -e "${YELLOW}📦 Installing backend dependencies...${NC}"
cd backend
npm install
cd ..
echo -e "${GREEN}✅ Backend dependencies installed${NC}"
echo ""

# Install frontend dependencies
echo -e "${YELLOW}📦 Installing frontend dependencies...${NC}"
cd frontend
npm install
cd ..
echo -e "${GREEN}✅ Frontend dependencies installed${NC}"
echo ""

# Install Playwright browsers
echo -e "${YELLOW}🌐 Installing Playwright Chromium browser...${NC}"
cd backend
npx playwright install chromium
cd ..
echo -e "${GREEN}✅ Playwright browser installed${NC}"
echo ""

# Check if .env file exists
if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}⚠️  No .env file found. Creating from .env.example...${NC}"
    cp backend/.env.example backend/.env
    echo -e "${GREEN}✅ Created backend/.env${NC}"
    echo ""
    echo -e "${RED}⚠️  IMPORTANT: You need to add your Gemini API key to backend/.env${NC}"
    echo -e "${YELLOW}   1. Get your free API key from: https://aistudio.google.com/app/apikey${NC}"
    echo -e "${YELLOW}   2. Open backend/.env in your editor${NC}"
    echo -e "${YELLOW}   3. Replace GEMINI_API_KEY= with your actual key${NC}"
    echo ""
else
    # Check if API key is configured
    if grep -q "GEMINI_API_KEY=$" backend/.env || grep -q "GEMINI_API_KEY=your_gemini_api_key_here" backend/.env; then
        echo -e "${RED}⚠️  WARNING: Gemini API key not configured in backend/.env${NC}"
        echo -e "${YELLOW}   1. Get your free API key from: https://aistudio.google.com/app/apikey${NC}"
        echo -e "${YELLOW}   2. Open backend/.env in your editor${NC}"
        echo -e "${YELLOW}   3. Replace GEMINI_API_KEY= with your actual key${NC}"
        echo ""
    else
        echo -e "${GREEN}✅ .env file exists and appears to be configured${NC}"
        echo ""
    fi
fi

echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo -e "${YELLOW}📚 Next steps:${NC}"
echo ""
echo "1. Configure your Gemini API key (if you haven't already):"
echo "   - Get key from: https://aistudio.google.com/app/apikey"
echo "   - Edit backend/.env and set GEMINI_API_KEY"
echo ""
echo "2. Start the backend server:"
echo "   cd backend && npm run dev"
echo ""
echo "3. In a NEW terminal, start the frontend:"
echo "   cd frontend && npm run dev"
echo ""
echo "4. Open your browser to:"
echo "   http://localhost:5173"
echo ""
echo "5. Scroll to the Live Demo section and try a voice command!"
echo ""
echo -e "${GREEN}🎤 Example command: 'Book a train from Delhi to Mumbai tomorrow'${NC}"
echo ""
echo -e "${YELLOW}📖 For detailed instructions, see QUICKSTART.md${NC}"
echo ""
