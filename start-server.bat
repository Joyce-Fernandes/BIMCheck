@echo off
echo ========================================
echo    BIMCheck - Starting Server
echo ========================================
echo.

echo Checking if Node.js is installed...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found!
    echo Please install Node.js at: https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js found!
echo.

echo Starting server on port 3000...
echo.
echo Available URLs:
echo - Main page: http://localhost:3000/
echo - Test page: http://localhost:3000/test
echo.
echo To stop the server, press Ctrl+C
echo.

node server.js

pause 