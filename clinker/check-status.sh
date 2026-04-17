#!/bin/bash

echo "🔍 Checking Clinker Optimization Dashboard Status..."
echo ""

# Check if frontend is running
echo "📱 Frontend Status:"
if curl -s http://localhost:5174 > /dev/null 2>&1; then
    echo "  ✅ Frontend is running at http://localhost:5174"
else
    echo "  ❌ Frontend is not running"
fi

# Check if backend is running
echo ""
echo "🖥️  Backend Status:"
if curl -s http://localhost:3003/api/optimization-results > /dev/null 2>&1; then
    echo "  ✅ Backend API is running at http://localhost:3003"
    echo "  ✅ API endpoints are responding"
else
    echo "  ❌ Backend API is not running or not responding"
fi

# Test API endpoints
echo ""
echo "🔌 API Endpoint Tests:"

# Test integrated units
if curl -s http://localhost:3003/api/integrated-units | grep -q "IU-001"; then
    echo "  ✅ Integrated Units endpoint working"
else
    echo "  ❌ Integrated Units endpoint failed"
fi

# Test grinding units
if curl -s http://localhost:3003/api/grinding-units | grep -q "GU-001"; then
    echo "  ✅ Grinding Units endpoint working"
else
    echo "  ❌ Grinding Units endpoint failed"
fi

# Test transport modes
if curl -s http://localhost:3003/api/transport-modes | grep -q "Truck"; then
    echo "  ✅ Transport Modes endpoint working"
else
    echo "  ❌ Transport Modes endpoint failed"
fi

# Test optimization
if curl -s -X POST http://localhost:3003/api/optimize -H "Content-Type: application/json" -d '{}' | grep -q "success"; then
    echo "  ✅ Optimization endpoint working"
else
    echo "  ❌ Optimization endpoint failed"
fi

echo ""
echo "🎉 Status check complete!"
echo ""
echo "If all services are running, you can access:"
echo "  🌐 Dashboard: http://localhost:5174"
echo "  🔧 API: http://localhost:3003/api/"
echo ""