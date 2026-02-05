#!/bin/bash

# Quick API Key Configuration Helper
# This script helps you configure your Gemini API key easily

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo ""
echo -e "${YELLOW}==================================================${NC}"
echo -e "${YELLOW}  Gemini API Key Configuration Helper${NC}"
echo -e "${YELLOW}==================================================${NC}"
echo ""

# Check if .env exists
if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}Creating .env file from example...${NC}"
    cp backend/.env.example backend/.env
    echo -e "${GREEN}✅ Created backend/.env${NC}"
    echo ""
fi

# Read current value
CURRENT_KEY=$(grep "^GEMINI_API_KEY=" backend/.env | cut -d '=' -f2)

if [ -z "$CURRENT_KEY" ] || [ "$CURRENT_KEY" = "your_gemini_api_key_here" ]; then
    echo -e "${RED}❌ No Gemini API key configured${NC}"
else
    echo -e "${GREEN}✅ Gemini API key already configured${NC}"
    echo ""
    echo -e "${YELLOW}Current key starts with: ${CURRENT_KEY:0:10}...${NC}"
    echo ""
    read -p "Do you want to update it? (y/N): " update
    if [ "$update" != "y" ] && [ "$update" != "Y" ]; then
        echo "Keeping existing key. Exiting."
        exit 0
    fi
fi

echo ""
echo -e "${YELLOW}To get your FREE Gemini API key:${NC}"
echo "1. Visit: https://aistudio.google.com/app/apikey"
echo "2. Click 'Create API Key'"
echo "3. Copy the generated key"
echo ""
echo -e "${YELLOW}Paste your Gemini API key below:${NC}"
read -p "API Key: " new_key

if [ -z "$new_key" ]; then
    echo -e "${RED}❌ No key provided. Exiting.${NC}"
    exit 1
fi

# Update the .env file
if [ "$(uname)" = "Darwin" ]; then
    # macOS
    sed -i '' "s/^GEMINI_API_KEY=.*/GEMINI_API_KEY=$new_key/" backend/.env
else
    # Linux
    sed -i "s/^GEMINI_API_KEY=.*/GEMINI_API_KEY=$new_key/" backend/.env
fi

echo ""
echo -e "${GREEN}✅ API key configured successfully!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Start the backend: cd backend && npm run dev"
echo "2. Start the frontend: cd frontend && npm run dev"
echo "3. Open http://localhost:5173 in your browser"
echo ""
echo -e "${GREEN}You're all set! 🚀${NC}"
echo ""
