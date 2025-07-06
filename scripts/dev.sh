#!/bin/bash

set -e

echo "🚀 Starting development servers..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}Starting Next.js (port 3000) and FastAPI (port 8000)...${NC}"
echo -e "${GREEN}Frontend: http://localhost:3000${NC}"
echo -e "${GREEN}Backend: http://localhost:8000${NC}"
# echo -e "${GREEN}API Docs: http://localhost:8000/docs${NC}"

# Kill any existing processes on ports 3000 and 8000
echo "🔍 Checking for existing processes..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:8000 | xargs kill -9 2>/dev/null || true

# Start both servers
concurrently \
  --prefix "[{name}]" \
  --names "WEB,LLM" \
  --prefix-colors "cyan,yellow" \
  "yarn workspace web dev" \
  "cd apps/llm-backend && python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload"
