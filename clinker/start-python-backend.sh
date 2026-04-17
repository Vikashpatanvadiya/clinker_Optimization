#!/bin/bash

echo "🐍 Starting Python FastAPI Backend..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3 first."
    exit 1
fi

# Check if pip is installed
if ! command -v pip3 &> /dev/null; then
    echo "❌ pip3 is not installed. Please install pip3 first."
    exit 1
fi

# Navigate to python backend directory
cd python-backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install requirements
echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

# Check if OR-Tools installation was successful
echo "🔍 Checking OR-Tools installation..."
python3 -c "from ortools.linear_solver import pywraplp; print('✅ OR-Tools installed successfully')" || {
    echo "❌ OR-Tools installation failed. Trying alternative installation..."
    pip install --upgrade ortools
}

# Create data directory
mkdir -p data

echo "🚀 Starting FastAPI server..."
echo "📍 Server will be available at: http://localhost:8000"
echo "📖 API documentation: http://localhost:8000/docs"
echo ""

# Start the server
python3 main.py