@echo off
REM Voice-Activated Browser Automation Setup Script for Windows
REM This script will install all dependencies and prepare the project for running

echo.
echo Setting up Voice-Activated Browser Automation...
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

echo [OK] Node.js is installed
node --version
echo.

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm is not installed.
    pause
    exit /b 1
)

echo [OK] npm is installed
npm --version
echo.

REM Install backend dependencies
echo Installing backend dependencies...
cd backend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install backend dependencies
    pause
    exit /b 1
)
cd ..
echo [OK] Backend dependencies installed
echo.

REM Install frontend dependencies
echo Installing frontend dependencies...
cd frontend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install frontend dependencies
    pause
    exit /b 1
)
cd ..
echo [OK] Frontend dependencies installed
echo.

REM Install Playwright browsers
echo Installing Playwright Chromium browser...
cd backend
call npx playwright install chromium
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install Playwright browsers
    pause
    exit /b 1
)
cd ..
echo [OK] Playwright browser installed
echo.

REM Check if .env file exists
if not exist "backend\.env" (
    echo [WARNING] No .env file found. Creating from .env.example...
    copy backend\.env.example backend\.env
    echo [OK] Created backend\.env
    echo.
    echo [IMPORTANT] You need to add your Gemini API key to backend\.env
    echo   1. Get your free API key from: https://aistudio.google.com/app/apikey
    echo   2. Open backend\.env in your editor
    echo   3. Replace GEMINI_API_KEY= with your actual key
    echo.
) else (
    echo [OK] .env file exists
    echo.
)

echo.
echo ===============================================
echo Setup complete!
echo ===============================================
echo.
echo Next steps:
echo.
echo 1. Configure your Gemini API key (if you haven't already):
echo    - Get key from: https://aistudio.google.com/app/apikey
echo    - Edit backend\.env and set GEMINI_API_KEY
echo.
echo 2. Start the backend server:
echo    cd backend
echo    npm run dev
echo.
echo 3. In a NEW terminal, start the frontend:
echo    cd frontend
echo    npm run dev
echo.
echo 4. Open your browser to:
echo    http://localhost:5173
echo.
echo 5. Scroll to the Live Demo section and try a voice command!
echo.
echo Example command: "Book a train from Delhi to Mumbai tomorrow"
echo.
echo For detailed instructions, see QUICKSTART.md
echo.
pause
