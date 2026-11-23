@echo off
echo.
echo ═══════════════════════════════════════════════════════
echo   ECHIDNA - The Witch of Greed's Wallet Hunter
echo   Installation Script for Windows
echo ═══════════════════════════════════════════════════════
echo.

echo [1/3] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from: https://nodejs.org/
    echo.
    pause
    exit /b 1
)
echo ✓ Node.js is installed

echo.
echo [2/3] Installing dependencies...
echo This may take a few minutes...
call npm install --legacy-peer-deps
if errorlevel 1 (
    echo.
    echo ERROR: Installation failed!
    echo Try running: npm install --legacy-peer-deps
    pause
    exit /b 1
)

echo.
echo [3/3] Setting up environment...
if not exist .env (
    copy .env.example .env
    echo ✓ Created .env file
) else (
    echo ✓ .env file already exists
)

echo.
echo ═══════════════════════════════════════════════════════
echo   Installation Complete! 🎉
echo ═══════════════════════════════════════════════════════
echo.
echo To start Echidna, run:
echo   npm start
echo.
echo Then open your browser to:
echo   http://localhost:3000
echo.
echo For detailed instructions, see:
echo   - QUICKSTART.md (fastest way to get started)
echo   - SETUP.md (detailed setup guide)
echo   - README.md (full documentation)
echo.
pause
