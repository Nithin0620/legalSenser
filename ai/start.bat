@echo off
REM Quick start script for LegalSenser with Groq API (Windows)

echo ================================
echo LegalSenser - Groq API Quick Start
echo ================================
echo.

REM Check if .env file exists
if not exist .env (
    echo [WARNING] .env file not found!
    echo [INFO] Creating .env from .env.example...
    copy .env.example .env >nul
    echo [SUCCESS] Created .env file
    echo.
    echo [SETUP] Please edit .env and add your Groq API keys:
    echo   - Get keys from: https://console.groq.com/keys
    echo   - You need 5 API keys ^(or use the same key 5 times^)
    echo.
    echo Then run this script again!
    pause
    exit /b 1
)

echo [SUCCESS] Found .env file
echo.

REM Check if virtual environment exists
if not exist venv (
    if not exist .venv (
        echo [INFO] Creating virtual environment...
        python -m venv venv
        echo [SUCCESS] Virtual environment created
        echo.
    )
)

REM Activate virtual environment
echo [INFO] Activating virtual environment...
if exist venv\Scripts\activate.bat (
    call venv\Scripts\activate.bat
) else if exist .venv\Scripts\activate.bat (
    call .venv\Scripts\activate.bat
)
echo.

REM Install dependencies
echo [INFO] Installing dependencies...
pip install -r requirements.txt --quiet
echo [SUCCESS] Dependencies installed
echo.

REM Test setup
echo [INFO] Testing Groq API setup...
python test_groq_setup.py
echo.

REM Ask if user wants to start server
set /p START_SERVER="Start the server now? (y/n): "
if /i "%START_SERVER%"=="y" (
    echo [INFO] Starting LegalSenser server...
    echo [INFO] Server will run on: http://localhost:8000
    echo [INFO] API docs available at: http://localhost:8000/docs
    echo.
    uvicorn app:app --reload --host 0.0.0.0 --port 8000
)

pause
