#!/bin/bash

echo "🚀 Setting up Clinker Optimization Dashboard..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOL
# Frontend Configuration
VITE_API_URL=http://localhost:3002

# Backend Configuration
PORT=3003
NODE_ENV=development
EOL
    echo "✅ .env file created"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To start the development servers:"
echo "  npm run dev"
echo ""
echo "The application will be available at:"
echo "  Frontend: http://localhost:5173 (or next available port)"
echo "  Backend:  http://localhost:3003"
echo ""
echo "Features:"
echo "  ✨ Dual theme system (Normal/Premium)"
echo "  📊 Interactive dashboard with charts"
echo "  ⚙️  Configuration management"
echo "  📱 Fully responsive design"
echo "  🎨 Modern animations and effects"
echo ""