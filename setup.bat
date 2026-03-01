@echo off
echo ========================================
echo Career Compass - Setup Script
echo ========================================
echo.

REM Check if Node.js is installed
echo [1/5] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please download and install Node.js from: https://nodejs.org/
    echo After installation, run this script again.
    pause
    exit /b 1
)
echo ✓ Node.js is installed

REM Check if .env file exists
echo.
echo [2/5] Checking environment configuration...
if not exist ".env" (
    echo ! .env file not found. Creating from template...
    copy .env.example .env
    echo.
    echo ========================================
    echo IMPORTANT: Configure your Supabase credentials!
    echo ========================================
    echo.
    echo Please edit the .env file and add your Supabase anon key:
    echo 1. Open .env file in Notepad
    echo 2. Go to https://supabase.com/dashboard
    echo 3. Click "Project - Career Counselling"
    echo 4. Go to Settings → API
    echo 5. Copy the anon/public key
    echo 6. Paste it in .env file replacing YOUR_ANON_KEY_HERE
    echo.
    notepad .env
    echo.
    echo Press any key after saving your .env file...
    pause >nul
) else (
    echo ✓ .env file exists
)

REM Install dependencies
echo.
echo [3/5] Installing dependencies...
echo This may take 2-3 minutes...
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo ✓ Dependencies installed successfully

REM Verify Supabase configuration
echo.
echo [4/5] Verifying Supabase configuration...
findstr /C:"YOUR_ANON_KEY_HERE" .env >nul
if not errorlevel 1 (
    echo.
    echo ========================================
    echo WARNING: Supabase key not configured!
    echo ========================================
    echo.
    echo Your .env file still contains "YOUR_ANON_KEY_HERE"
    echo Please update it with your actual Supabase anon key.
    echo.
    echo Opening .env file now...
    notepad .env
    echo.
    echo Press any key after saving...
    pause >nul
)

REM Final instructions
echo.
echo [5/5] Setup complete!
echo.
echo ========================================
echo ✓ Career Compass is ready to run!
echo ========================================
echo.
echo To start the application, run:
echo     npm run dev
echo.
echo Then open your browser to:
echo     http://localhost:5173
echo.
echo Press any key to start the development server now...
pause >nul

echo.
echo Starting Career Compass...
echo.
call npm run dev

pause
