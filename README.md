# Stock Market Prediction - Development Environment Setup Guide

## Table of Contents
1. [Overview](#overview)
2. [System Requirements](#system-requirements)
3. [Prerequisites Installation](#prerequisites-installation)
4. [Project Architecture](#project-architecture)
5. [Step-by-Step Setup Instructions](#step-by-step-setup-instructions)
6. [Running the Application](#running-the-application)
7. [Troubleshooting Guide](#troubleshooting-guide)
8. [Common Issues and Solutions](#common-issues-and-solutions)
9. [Development Workflow](#development-workflow)
10. [Additional Resources](#additional-resources)

---

## Overview

The Stock Market Prediction application is a full-stack system consisting of three main components:

- **Frontend**: React application with Vite build tool for real-time stock prediction visualization
- **Backend**: Node.js/Express API server for handling predictions and data persistence
- **ML Service**: Python FastAPI service for machine learning model inference

This guide provides comprehensive instructions for setting up the complete development environment on your local machine.

---

## System Requirements

### Minimum Hardware Requirements
- **CPU**: Dual-core processor (2.0 GHz or higher)
- **RAM**: 8 GB minimum (16 GB recommended)
- **Disk Space**: 5 GB free space for dependencies and project files
- **Internet Connection**: Required for downloading dependencies and fetching stock data

### Supported Operating Systems
- Windows 10/11 (64-bit)
- macOS 10.14+ (Intel or Apple Silicon)
- Linux (Ubuntu 18.04+, Debian 10+, CentOS 7+)

---

## Prerequisites Installation

### 1. Node.js and npm

**Node.js** is required for both the frontend and backend services.

#### Windows Installation
1. Visit [nodejs.org](https://nodejs.org/)
2. Download the LTS (Long Term Support) version (v18.x or higher)
3. Run the installer and follow the setup wizard
4. Accept the default installation path
5. Ensure "Add to PATH" is checked during installation
6. Restart your computer after installation

#### macOS Installation
```bash
# Using Homebrew (recommended)
brew install node

# Or download from nodejs.org and run the installer
```

#### Linux Installation (Ubuntu/Debian)
```bash
# Update package manager
sudo apt update

# Install Node.js and npm
sudo apt install nodejs npm

# Verify installation
node --version
npm --version
```

**Verification**:
```bash
node --version  # Should output v18.x.x or higher
npm --version   # Should output 9.x.x or higher
```

---

### 2. Python 3.8+

**Python** is required for the ML service.

#### Windows Installation
1. Visit [python.org](https://www.python.org/downloads/)
2. Download Python 3.10 or higher
3. Run the installer
4. **IMPORTANT**: Check "Add Python to PATH" during installation
5. Click "Install Now"
6. Verify installation by opening Command Prompt and running:
   ```bash
   python --version
   pip --version
   ```

#### macOS Installation
```bash
# Using Homebrew
brew install python3

# Verify installation
python3 --version
pip3 --version
```

#### Linux Installation (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install python3 python3-pip python3-venv

# Verify installation
python3 --version
pip3 --version
```

---

### 3. Git (Optional but Recommended)

Git is useful for version control and cloning the repository.

#### Windows Installation
1. Visit [git-scm.com](https://git-scm.com/)
2. Download the Windows installer
3. Run the installer and accept default settings
4. Verify: Open Command Prompt and run `git --version`

#### macOS Installation
```bash
brew install git
```

#### Linux Installation
```bash
sudo apt install git
```

---

### 4. MongoDB (Local or Cloud)

MongoDB is required for data persistence in the backend.

#### Option A: MongoDB Atlas (Cloud - Recommended for Development)
1. Visit [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (M0 free tier is sufficient)
4. Create a database user with username and password
5. Whitelist your IP address (or allow all IPs for development)
6. Copy the connection string (you'll need this later)

#### Option B: Local MongoDB Installation

**Windows**:
1. Visit [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Download the Community Server
3. Run the installer and follow the setup wizard
4. MongoDB will be installed as a Windows Service and start automatically

**macOS**:
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu/Debian)**:
```bash
sudo apt-get install -y mongodb

# Start MongoDB service
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

**Verification**:
```bash
# Connect to MongoDB (if running locally)
mongosh
# Type: exit
```

---

## Project Architecture

```
stock-market-prediction/
├── frontend/                 # React + Vite application
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API integration
│   │   ├── utils/           # Utility functions
│   │   └── styles/          # CSS stylesheets
│   ├── package.json         # Frontend dependencies
│   └── vite.config.js       # Vite configuration
│
├── backend/                  # Node.js/Express API server
│   ├── controllers/         # Request handlers
│   ├── models/              # Database models
│   ├── routes/              # API route definitions
│   ├── package.json         # Backend dependencies
│   └── server.js            # Server entry point
│
├── ml_service/              # Python FastAPI ML service
│   ├── api.py               # FastAPI application
│   ├── data_fetch.py        # Stock data fetching
│   ├── feature_engineer.py  # Feature engineering
│   ├── model.pkl            # Trained ML model
│   ├── requirements.txt     # Python dependencies
│   └── train.py             # Model training script
│
└── README.md                # This file
```

---

## Step-by-Step Setup Instructions

### Step 1: Clone or Download the Repository

```bash
# Using Git (recommended)
git clone https://github.com/yourusername/stock-market-prediction.git
cd stock-market-prediction

# Or download as ZIP and extract
```

### Step 2: Install Backend Dependencies

```bash
# Navigate to backend directory
cd backend

# Install Node.js dependencies
npm install

# Verify installation
npm list
```

**Expected Output**: You should see a tree of installed packages including:
- express
- mongoose
- axios
- cors
- dotenv

### Step 3: Configure Backend Environment Variables

```bash
# In the backend directory, create a .env file
# Windows (Command Prompt)
type nul > .env

# macOS/Linux
touch .env
```

**Edit the `.env` file** with the following content:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/stock-prediction?retryWrites=true&w=majority
# OR for local MongoDB:
# MONGODB_URI=mongodb://localhost:27017/stock-prediction

# ML Service Configuration
ML_SERVICE_URL=http://127.0.0.1:8000

# JWT Configuration (if using authentication)
JWT_SECRET=your_secret_key_here_change_in_production
```

**Important**: Replace `username`, `password`, and `cluster` with your actual MongoDB credentials.

### Step 4: Install Frontend Dependencies

```bash
# Navigate to frontend directory
cd ../frontend

# Install Node.js dependencies
npm install

# Verify installation
npm list
```

**Expected Output**: You should see packages including:
- react
- vite
- axios
- chart.js
- react-chartjs-2

### Step 5: Set Up Python Virtual Environment

A Python virtual environment isolates project dependencies from system Python.

```bash
# Navigate to ml_service directory
cd ../ml_service

# Create virtual environment
# Windows
python -m venv venv

# macOS/Linux
python3 -m venv venv
```

### Step 6: Activate Virtual Environment

```bash
# Windows (Command Prompt)
venv\Scripts\activate

# Windows (PowerShell)
venv\Scripts\Activate.ps1

# macOS/Linux
source venv/bin/activate
```

**Verification**: Your terminal prompt should now show `(venv)` prefix.

### Step 7: Install Python Dependencies

```bash
# Ensure you're in the ml_service directory with venv activated
pip install -r requirements.txt

# Verify installation
pip list
```

**Expected Packages**:
- flask
- flask-cors
- numpy
- pandas
- scikit-learn
- yfinance
- joblib
- fastapi
- uvicorn
- pydantic

---

## Running the Application

### Terminal Setup

You'll need **three separate terminal windows/tabs** to run all services simultaneously:

1. **Terminal 1**: ML Service (Python)
2. **Terminal 2**: Backend API (Node.js)
3. **Terminal 3**: Frontend (Node.js)

### Starting the ML Service (Terminal 1)

```bash
# Navigate to ml_service directory
cd ml_service

# Activate virtual environment
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# Start FastAPI server
uvicorn api:app --reload --port 8000
```

**Expected Output**:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete
```

**Verification**: Open browser and visit `http://127.0.0.1:8000/docs` to see API documentation.

---

### Starting the Backend Server (Terminal 2)

```bash
# Navigate to backend directory
cd backend

# Install dependencies (if not already done)
npm install

# Start the server
npm start
# OR for development with auto-reload
npm run dev
```

**Expected Output**:
```
Server running on port 5000
Connected to MongoDB
```

**Verification**: Open browser and visit `http://localhost:5000/api/health` (if endpoint exists).

---

### Starting the Frontend Application (Terminal 3)

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```

**Expected Output**:
```
  VITE v7.2.4  ready in 123 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

**Verification**: Open browser and visit `http://localhost:5173/`

---

### Accessing the Application

Once all three services are running:

1. **Frontend**: http://localhost:5173/
2. **Backend API**: http://localhost:5000/
3. **ML Service Docs**: http://127.0.0.1:8000/docs

---

## Troubleshooting Guide

### Port Already in Use

**Problem**: Error message like "Port 5000 is already in use" or "EADDRINUSE"

**Solutions**:

**Windows**:
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with the actual process ID)
taskkill /PID <PID> /F

# Or use a different port by modifying .env
PORT=5001
```

**macOS/Linux**:
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or use a different port
PORT=5001 npm start
```

---

### MongoDB Connection Issues

**Problem**: "MongooseError: Cannot connect to MongoDB" or "ECONNREFUSED"

**Solutions**:

1. **Verify MongoDB is running**:
   ```bash
   # Windows (check Services)
   # macOS
   brew services list | grep mongodb
   # Linux
   sudo systemctl status mongodb
   ```

2. **Check connection string in `.env`**:
   - Ensure username and password are correct
   - Verify IP whitelist in MongoDB Atlas
   - Test connection string locally

3. **Restart MongoDB**:
   ```bash
   # macOS
   brew services restart mongodb-community
   # Linux
   sudo systemctl restart mongodb
   ```

4. **Use local MongoDB for testing**:
   ```env
   MONGODB_URI=mongodb://localhost:27017/stock-prediction
   ```

---

### Python Virtual Environment Issues

**Problem**: "Python command not found" or "pip: command not found"

**Solutions**:

1. **Verify Python installation**:
   ```bash
   python --version
   # or
   python3 --version
   ```

2. **Recreate virtual environment**:
   ```bash
   # Remove old venv
   rm -rf venv  # macOS/Linux
   rmdir /s venv  # Windows

   # Create new venv
   python -m venv venv
   # or
   python3 -m venv venv
   ```

3. **Activate virtual environment properly**:
   - Windows Command Prompt: `venv\Scripts\activate`
   - Windows PowerShell: `venv\Scripts\Activate.ps1`
   - macOS/Linux: `source venv/bin/activate`

---

### npm Dependencies Installation Fails

**Problem**: "npm ERR! code ERESOLVE" or "npm ERR! ERESOLVE unable to resolve dependency tree"

**Solutions**:

```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json  # macOS/Linux
rmdir /s node_modules  # Windows
del package-lock.json  # Windows

# Reinstall dependencies
npm install

# If still failing, use legacy peer deps flag
npm install --legacy-peer-deps
```

---

### ML Service Not Responding

**Problem**: "Cannot connect to ML service" or "ECONNREFUSED 127.0.0.1:8000"

**Solutions**:

1. **Verify ML service is running**:
   - Check Terminal 1 for error messages
   - Ensure FastAPI server started successfully

2. **Check port 8000 is available**:
   ```bash
   # Windows
   netstat -ano | findstr :8000
   # macOS/Linux
   lsof -i :8000
   ```

3. **Verify ML_SERVICE_URL in backend `.env`**:
   ```env
   ML_SERVICE_URL=http://127.0.0.1:8000
   ```

4. **Restart ML service**:
   - Stop the service (Ctrl+C in Terminal 1)
   - Reactivate virtual environment
   - Run `uvicorn api:app --reload --port 8000` again

---

### Frontend Not Loading

**Problem**: "Cannot GET /" or blank page in browser

**Solutions**:

1. **Verify Vite server is running**:
   - Check Terminal 3 for error messages
   - Look for "Local: http://localhost:5173/"

2. **Clear browser cache**:
   - Press Ctrl+Shift+Delete (Windows) or Cmd+Shift+Delete (macOS)
   - Clear browsing data

3. **Check for build errors**:
   ```bash
   # In frontend directory
   npm run build
   ```

4. **Restart frontend server**:
   - Stop the server (Ctrl+C in Terminal 3)
   - Run `npm run dev` again

---

## Common Issues and Solutions

### Issue 1: "Cannot find module" Error

**Symptoms**: Error like "Cannot find module 'express'" or "ModuleNotFoundError: No module named 'flask'"

**Root Cause**: Dependencies not installed or installed in wrong directory

**Solution**:
```bash
# For Node.js projects (backend/frontend)
cd backend  # or frontend
npm install

# For Python projects (ml_service)
cd ml_service
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
```

---

### Issue 2: CORS (Cross-Origin Resource Sharing) Errors

**Symptoms**: Browser console shows "Access to XMLHttpRequest blocked by CORS policy"

**Root Cause**: Frontend and backend running on different ports without proper CORS configuration

**Solution**:

Verify backend has CORS enabled in `server.js`:
```javascript
const cors = require('cors');
app.use(cors());
```

Or configure specific origins:
```javascript
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

---

### Issue 3: Model File Not Found

**Symptoms**: "FileNotFoundError: [Errno 2] No such file or directory: 'model.pkl'"

**Root Cause**: ML service cannot locate the trained model file

**Solution**:
```bash
# Verify model.pkl exists in ml_service directory
ls ml_service/model.pkl  # macOS/Linux
dir ml_service\model.pkl  # Windows

# If missing, train a new model
cd ml_service
source venv/bin/activate  # or venv\Scripts\activate on Windows
python train.py
```

---

### Issue 4: Stock Data Fetch Failures

**Symptoms**: "Failed to fetch stock data" or "yfinance error"

**Root Cause**: Network issues or invalid stock symbol

**Solution**:
1. Check internet connection
2. Verify stock symbol is valid (e.g., "AAPL", "GOOGL")
3. Check yfinance service status
4. Retry the request

---

### Issue 5: Out of Memory Errors

**Symptoms**: "JavaScript heap out of memory" or "MemoryError"

**Root Cause**: Large dataset processing or memory leak

**Solution**:
```bash
# Increase Node.js memory limit
node --max-old-space-size=4096 server.js

# Or in npm scripts (package.json)
"start": "node --max-old-space-size=4096 server.js"

# For Python
# Reduce batch size in data processing or use generators
```

---

### Issue 6: Slow Performance or Timeouts

**Symptoms**: Requests taking >30 seconds or timing out

**Root Cause**: 
- Slow network connection
- Large dataset processing
- Inefficient queries

**Solution**:
1. Check network connection speed
2. Monitor CPU and memory usage
3. Optimize database queries
4. Increase timeout values in `.env`:
   ```env
   REQUEST_TIMEOUT=60000
   ```

---

## Development Workflow

### Code Structure Best Practices

#### Backend (Node.js)
```
backend/
├── controllers/          # Business logic
├── models/              # Database schemas
├── routes/              # API endpoints
├── middleware/          # Authentication, validation
└── utils/               # Helper functions
```

#### Frontend (React)
```
frontend/src/
├── components/          # Reusable UI components
├── pages/              # Page-level components
├── services/           # API calls
├── utils/              # Helper functions
└── styles/             # CSS files
```

#### ML Service (Python)
```
ml_service/
├── api.py              # FastAPI application
├── data_fetch.py       # Data retrieval
├── feature_engineer.py # Feature creation
├── model.pkl           # Trained model
└── train.py            # Training script
```

---

### Running Tests

#### Backend Tests
```bash
cd backend
npm test
```

#### Frontend Tests
```bash
cd frontend
npm test
```

#### ML Service Tests
```bash
cd ml_service
source venv/bin/activate
pytest
```

---

### Code Linting and Formatting

#### Frontend ESLint
```bash
cd frontend
npm run lint
```

#### Backend (if configured)
```bash
cd backend
npm run lint
```

---

### Building for Production

#### Frontend Build
```bash
cd frontend
npm run build
# Output: dist/ directory
```

#### Backend Production Start
```bash
cd backend
NODE_ENV=production npm start
```

#### ML Service Production
```bash
cd ml_service
source venv/bin/activate
uvicorn api:app --host 0.0.0.0 --port 8000
```

---

## Additional Resources

### Official Documentation
- [Node.js Documentation](https://nodejs.org/docs/)
- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/)
- [Python Documentation](https://docs.python.org/3/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Vite Documentation](https://vitejs.dev/)

### Useful Tools
- **VS Code**: [code.visualstudio.com](https://code.visualstudio.com/)
- **Postman**: [postman.com](https://www.postman.com/) - API testing
- **MongoDB Compass**: [mongodb.com/products/compass](https://www.mongodb.com/products/compass) - Database GUI
- **Git**: [git-scm.com](https://git-scm.com/)

### Community Support
- GitHub Issues: Report bugs and request features
- Stack Overflow: Search for solutions to common problems
- Discord/Slack Communities: Connect with other developers

---

### Quick Reference Commands

```bash
# Backend
cd backend && npm install && npm start

# Frontend
cd frontend && npm install && npm run dev

# ML Service
cd ml_service && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt && uvicorn api:app --reload --port 8000

# Stop all services
# Press Ctrl+C in each terminal

# Clean up
rm -rf node_modules package-lock.json  # macOS/Linux
rmdir /s node_modules  # Windows
del package-lock.json  # Windows
```

---

## Support and Contribution

For issues, questions, or contributions:
1. Check this troubleshooting guide first
2. Search existing GitHub issues
3. Create a new issue with detailed error messages and steps to reproduce
4. Follow the project's contribution guidelines

---
-------Images for Guidance------------
<img width="1488" height="488" alt="image" src="https://github.com/user-attachments/assets/3fac0b79-b772-4c1a-a76d-751bdbbebb0c" />


**Last Updated**: January 2026
**Version**: 1.0.0
