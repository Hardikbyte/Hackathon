#!/bin/bash

# Start both backend and frontend servers
# This script opens two terminals and runs each server

echo "🚀 Starting Voice-Activated Browser Automation..."
echo ""

# Check if .env exists and has API key
if [ ! -f "backend/.env" ]; then
    echo "❌ No .env file found!"
    echo "Run ./setup.sh first to configure the project."
    exit 1
fi

if grep -q "GEMINI_API_KEY=$" backend/.env || grep -q "GEMINI_API_KEY=your_gemini_api_key_here" backend/.env; then
    echo "⚠️  WARNING: Gemini API key not configured!"
    echo ""
    echo "You can:"
    echo "1. Run ./configure-api-key.sh to set it up quickly"
    echo "2. Manually edit backend/.env and add your key"
    echo ""
    read -p "Continue anyway? (y/N): " continue
    if [ "$continue" != "y" ] && [ "$continue" != "Y" ]; then
        exit 1
    fi
fi

echo ""
echo "Starting Backend Server..."
echo "=========================="
echo ""

# Start backend in background
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

echo ""
echo "✅ Backend starting... (PID: $BACKEND_PID)"
echo ""

# Wait a bit for backend to start
sleep 3

echo ""
echo "Starting Frontend Server..."
echo "==========================="
echo ""

# Start frontend in background
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ Frontend starting... (PID: $FRONTEND_PID)"
echo ""
echo "========================================"
echo "🎉 Both servers are starting!"
echo "========================================"
echo ""
echo "📡 Backend:  http://localhost:4000"
echo "🌐 Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
