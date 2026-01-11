#!/bin/bash
# Verification script to ensure proper setup after cloning

set -e  # Exit on error

echo "🔍 O-Rento Backend Setup Verification"
echo "======================================"

# Check Python version
echo -n "✓ Checking Python version... "
python_version=$(python3 --version 2>&1 | awk '{print $2}')
echo "$python_version"

if ! python3 -c "import sys; sys.exit(0 if sys.version_info >= (3, 9) else 1)"; then
    echo "❌ Python 3.9+ required. Found: $python_version"
    exit 1
fi

# Check virtual environment
echo -n "✓ Checking virtual environment... "
if [ ! -d ".venv" ]; then
    echo "Not found. Creating..."
    python3 -m venv .venv
else
    echo "Found"
fi

# Activate virtual environment
source .venv/bin/activate

# Check dependencies
echo -n "✓ Installing/verifying dependencies... "
pip install -q -r requirements.txt
echo "Done"

# Run tests
echo "✓ Running test suite..."
pytest -v --tb=short

# Check if server can start
echo -n "✓ Verifying server startup... "
timeout 5 uvicorn backend.main:app --host 127.0.0.1 --port 8888 > /dev/null 2>&1 &
SERVER_PID=$!
sleep 2

if curl -s http://127.0.0.1:8888/docs > /dev/null 2>&1; then
    echo "✅ OK"
    kill $SERVER_PID 2>/dev/null || true
else
    echo "❌ Failed"
    kill $SERVER_PID 2>/dev/null || true
    exit 1
fi

echo ""
echo "✅ Setup verification complete!"
echo ""
echo "To run the backend:"
echo "  1. source .venv/bin/activate"
echo "  2. uvicorn backend.main:app --reload"
echo ""
echo "API will be available at: http://localhost:8000"
echo "Swagger UI: http://localhost:8000/docs"
