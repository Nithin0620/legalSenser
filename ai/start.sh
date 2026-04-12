#!/bin/bash
# Quick start script for LegalSenser with Groq API

echo "🚀 LegalSenser - Groq API Quick Start"
echo "======================================"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found!"
    echo "📋 Creating .env from .env.example..."
    cp .env.example .env
    echo "✅ Created .env file"
    echo ""
    echo "⚙️  Please edit .env and add your Groq API keys:"
    echo "   - Get keys from: https://console.groq.com/keys"
    echo "   - You need 5 API keys (or use the same key 5 times)"
    echo ""
    echo "Then run this script again!"
    exit 1
fi

echo "✅ Found .env file"
echo ""

# Check if virtual environment exists
if [ ! -d "venv" ] && [ ! -d ".venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
    echo "✅ Virtual environment created"
    echo ""
fi

# Activate virtual environment
echo "🔌 Activating virtual environment..."
if [ -d "venv" ]; then
    source venv/bin/activate || source venv/Scripts/activate 2>/dev/null
elif [ -d ".venv" ]; then
    source .venv/bin/activate || source .venv/Scripts/activate 2>/dev/null
fi
echo ""

# Install dependencies
echo "📥 Installing dependencies..."
pip install -r requirements.txt --quiet
echo "✅ Dependencies installed"
echo ""

# Test setup
echo "🧪 Testing Groq API setup..."
python test_groq_setup.py
echo ""

# Ask if user wants to start server
read -p "🌐 Start the server now? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Starting LegalSenser server..."
    echo "📍 Server will run on: http://localhost:8000"
    echo "📚 API docs available at: http://localhost:8000/docs"
    echo ""
    uvicorn app:app --reload --host 0.0.0.0 --port 8000
fi
