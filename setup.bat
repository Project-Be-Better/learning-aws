@echo off
setlocal enabledelayedexpansion

:: Quick Start Script for Learning AWS Microservices (Windows)
:: This script sets up the local development environment

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    Learning AWS Microservices                ║
echo ║                      Quick Start Setup                       ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo [INFO] Starting Learning AWS Microservices Setup...

:: Check Node.js
echo [INFO] Checking prerequisites...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

for /f "tokens=1" %%i in ('node --version') do set NODE_VERSION=%%i
echo [SUCCESS] Node.js %NODE_VERSION% is installed

:: Check npm
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm is not installed.
    pause
    exit /b 1
)

for /f "tokens=1" %%i in ('npm --version') do set NPM_VERSION=%%i
echo [SUCCESS] npm %NPM_VERSION% is installed

:: Check Docker
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Docker is not installed. You'll need it for containerization.
) else (
    for /f "tokens=3" %%i in ('docker --version') do set DOCKER_VERSION=%%i
    echo [SUCCESS] Docker %DOCKER_VERSION% is installed
)

:: Check Docker Compose
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Docker Compose is not installed. You'll need it for multi-container setup.
) else (
    echo [SUCCESS] Docker Compose is installed
)

echo.
echo [INFO] Installing dependencies for all services...

:: Install dependencies for each service
set services=api-gateway user-service product-service

for %%s in (%services%) do (
    echo [INFO] Installing dependencies for %%s...
    cd services\%%s
    
    if exist package.json (
        npm install
        if !errorlevel! equ 0 (
            echo [SUCCESS] Dependencies installed for %%s
        ) else (
            echo [ERROR] Failed to install dependencies for %%s
        )
    ) else (
        echo [ERROR] package.json not found for %%s
    )
    
    cd ..\..
)

echo.
echo [INFO] Setting up environment files...

:: Create environment files
for %%s in (%services%) do (
    if exist services\%%s\.env.example (
        if not exist services\%%s\.env (
            copy services\%%s\.env.example services\%%s\.env >nul
            echo [SUCCESS] Created .env file for %%s
        ) else (
            echo [WARNING] .env file already exists for %%s
        )
    )
)

echo.
echo [INFO] Setup completed! 🎉
echo.
echo [INFO] Next steps:
echo 1. Start services individually with: npm start (in each service directory)
echo 2. Or use Docker Compose: docker-compose up --build
echo 3. Test endpoints with curl or Postman
echo 4. Check out the README.md for detailed learning path
echo.

set /p choice="Would you like to run Docker Compose setup now? (y/n): "
if /i "%choice%"=="y" (
    echo [INFO] Running services with Docker Compose...
    docker-compose up --build -d
    
    timeout /t 10 /nobreak >nul
    
    echo [SUCCESS] Services should be running!
    echo [INFO] Services available at:
    echo   - API Gateway: http://localhost:3000
    echo   - User Service: http://localhost:3001
    echo   - Product Service: http://localhost:3002
    echo.
    echo [INFO] To stop services: docker-compose down
)

echo.
echo [SUCCESS] Happy learning! 🚀
pause
