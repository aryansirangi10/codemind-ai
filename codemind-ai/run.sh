#!/bin/bash

# CodeMind AI - Developer Startup Launcher for macOS

# Colors for terminal output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}====================================================${NC}"
echo -e "${BLUE}   CodeMind AI — Developer Launcher for macOS       ${NC}"
echo -e "${BLUE}====================================================${NC}"

# 1. Clean existing server ports if occupied
echo -e "Checking port allocations (3000 & 8000)..."
PORT_3000_PID=$(lsof -t -i:3000)
PORT_8000_PID=$(lsof -t -i:8000)

if [ ! -z "$PORT_3000_PID" ] || [ ! -z "$PORT_8000_PID" ]; then
    echo -e "${RED}Ports 3000 or 8000 are already in use by background processes.${NC}"
    read -p "Do you want this script to clear them automatically? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "Clearing active ports..."
        [ ! -z "$PORT_3000_PID" ] && kill -9 $PORT_3000_PID
        [ ! -z "$PORT_8000_PID" ] && kill -9 $PORT_8000_PID
        echo -e "${GREEN}✓ Ports cleared successfully!${NC}"
    else
        echo -e "${RED}Aborted. Please free the ports manually and run again.${NC}"
        exit 1
    fi
fi

# 2. Boot Backend FastAPI Server
echo -e "\nBooting FastAPI backend server..."
if [ -d "backend/.venv" ]; then
    source backend/.venv/bin/activate
    cd backend
    uvicorn app.main:app --host 127.0.0.1 --port 8000 > backend.log 2>&1 &
    BACKEND_PID=$!
    cd ..
    echo -e "${GREEN}✓ Backend running on PID $BACKEND_PID (Port 8000)${NC}"
else
    echo -e "${RED}Error: Virtual env backend/.venv folder not found.${NC}"
    exit 1
fi

# 3. Boot Frontend Web Server
echo -e "\nBooting Python static web server..."
if [ -d "frontend" ]; then
    cd frontend
    python3 -m http.server 3000 > frontend.log 2>&1 &
    FRONTEND_PID=$!
    cd ..
    echo -e "${GREEN}✓ Frontend running on PID $FRONTEND_PID (Port 3000)${NC}"
else
    echo -e "${RED}Error: frontend/ assets folder not found.${NC}"
    kill $BACKEND_PID
    exit 1
fi

# 4. Open Default Browser
echo -e "\n${BLUE}Opening web browser to http://localhost:3000 ...${NC}"
sleep 2
open http://localhost:3000

echo -e "\n${GREEN}====================================================${NC}"
echo -e "${GREEN}CodeMind AI is fully active!${NC}"
echo -e "Press ${RED}[Ctrl+C]${NC} at any time to stop both servers."
echo -e "${GREEN}====================================================${NC}"

# 5. Trap SIGINT to clean shutdown child servers
cleanup() {
    echo -e "\n\n${RED}Stopping servers...${NC}"
    kill $BACKEND_PID
    kill $FRONTEND_PID
    echo -e "${GREEN}✓ Clean shutdown complete. Goodbye!${NC}"
    exit 0
}
trap cleanup SIGINT

# Loop block to keep session alive
while true; do
    sleep 1
done
