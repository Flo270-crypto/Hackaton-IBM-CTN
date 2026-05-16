# Boby Setup Guide

This guide will help you set up and run both the frontend and backend of the Boby application.

## Prerequisites

- Node.js (v18 or higher)
- Python 3.12
- IBM Watsonx AI account with API credentials

## Backend Setup

### 1. Install Python Dependencies

The backend dependencies should already be installed. If not, run:

```bash
cd boby/backend
python3 -m venv venv
. venv/bin/activate
pip install -r requirements.txt
```

### 2. Configure IBM Watsonx Credentials

Edit the `boby/backend/.env` file and add your IBM Watsonx credentials:

```env
# IBM Watsonx AI Credentials
# Get your API key from: https://cloud.ibm.com/iam/apikeys
WATSONX_API_KEY=your_actual_api_key_here

# Get your project ID from your Watsonx project settings
WATSONX_PROJECT_ID=your_actual_project_id_here

# Watsonx URL (default for US South region)
WATSONX_URL=https://us-south.ml.cloud.ibm.com
```

**How to get your credentials:**

1. **API Key**: 
   - Go to https://cloud.ibm.com/iam/apikeys
   - Click "Create an IBM Cloud API key"
   - Copy the generated key

2. **Project ID**:
   - Go to your Watsonx.ai project
   - Click on "Manage" tab
   - Find "Project ID" in the project details

### 3. Start the Backend

```bash
cd boby/backend
./start.sh
```

The backend will start on `http://localhost:8000`

## Frontend Setup

### 1. Install Node Dependencies

The frontend dependencies should already be installed. If not, run:

```bash
cd boby/frontend
npm install
```

### 2. Configure Environment Variables

The `boby/frontend/.env` file has been created with default values:

```env
# Backend API URL
VITE_API_URL=http://localhost:8000

# Workspace path (set to your project directory)
VITE_WORKSPACE_PATH=/home/sylvio-challa/Projets-perso/Hackaton-IBM-CTN
```

You can modify `VITE_WORKSPACE_PATH` if needed.

### 3. Start the Frontend

```bash
cd boby/frontend
npm run dev
```

The frontend will start on `http://localhost:5173` (or another port if 5173 is busy)

## Troubleshooting

### Backend Issues

**Error: "`api_key` for IAM token is not provided"**
- Make sure you've added your actual IBM Watsonx API key to `boby/backend/.env`
- The key should not have quotes around it
- Restart the backend after updating the `.env` file

**Error: "Module not found"**
- Make sure you've activated the virtual environment: `. venv/bin/activate`
- Reinstall dependencies: `pip install -r requirements.txt`

### Frontend Issues

**Blank screen or no output**
- Make sure all dependencies are installed: `npm install`
- Check the browser console for errors
- Verify the backend is running on `http://localhost:8000`

**Port already in use**
- Vite will automatically use the next available port
- Check the terminal output for the actual URL

## Verification

Once both services are running:

1. Frontend should be accessible at `http://localhost:5173`
2. Backend API should be accessible at `http://localhost:8000`
3. You can test the backend API at `http://localhost:8000/docs` (FastAPI Swagger UI)

## Next Steps

After successful setup:

1. Open the frontend in your browser
2. The Boby widget should appear
3. Try analyzing your git repository
4. Use the various features like Push Guardian, Impact Analyzer, etc.

## Support

If you encounter any issues not covered here, please check:
- Backend logs in the terminal where you ran `./start.sh`
- Frontend logs in the browser console
- Network tab in browser developer tools for API call issues