#!/bin/bash

# Create scripts directory
mkdir -p scripts

cat > scripts/setup.sh << 'EOF'
#!/bin/bash

set -e  # Exit on any error

echo "🚀 Setting up Issue Store..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python3 is not installed. Please install Python3 first.${NC}"
    exit 1
fi

# Check if pip is installed
if ! command -v pip3 &> /dev/null; then
    echo -e "${RED}❌ pip3 is not installed. Please install pip3 first.${NC}"
    exit 1
fi

echo -e "${YELLOW}📦 Installing root dependencies...${NC}"
yarn install

echo -e "${YELLOW}🐍 Installing Python backend dependencies...${NC}"
cd apps/llm-backend
if [ -f "requirements.txt" ]; then
    pip3 install -r requirements.txt
else
    echo -e "${RED}❌ requirements.txt not found in apps/llm-backend${NC}"
    exit 1
fi
cd ../..

echo -e "${YELLOW}🎯 Checking if apps/web exists...${NC}"
if [ -d "apps/web" ]; then
    echo -e "${GREEN}✅ Web app found in apps/web${NC}"
else
    echo -e "${RED}❌ Web app not found in apps/web${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Setup completed successfully!${NC}"
echo -e "${GREEN}🎉 You can now run: ${YELLOW}yarn dev${NC}"
EOF

chmod +x scripts/setup.sh