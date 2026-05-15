# Boby - Quick Start Guide

## 🚀 Getting Started in 3 Steps

### Step 1: Start the Backend

```bash
# Navigate to backend directory
cd boby/backend

# Activate virtual environment (if not already activated)
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Start the FastAPI server
python main.py
```

The backend will start on `http://localhost:8000`

### Step 2: Start the Frontend

Open a new terminal:

```bash
# Navigate to frontend directory
cd boby/frontend

# Install dependencies (first time only)
npm install --legacy-peer-deps

# Start the development server
npm run dev
```

The frontend will start on `http://localhost:5173`

### Step 3: Use the Widget

1. Open your browser to `http://localhost:5173`
2. You'll see a purple circular button in the bottom-right corner
3. Click it to expand the widget
4. Explore the 4 tabs:
   - **Architecture**: View dependency graph (auto-loads)
   - **Checklist**: Generate testing checklist
   - **Impact**: Analyze file change impact
   - **History**: View Git commit history (auto-loads)

## 📋 What You Can Do

### Architecture Tab
- ✅ Automatically analyzes your workspace on open
- ✅ Shows dependency graph with color-coded risk levels
- ✅ Click nodes to see details and connections
- 🟢 Green = Low risk | 🟠 Orange = Medium risk | 🔴 Red = High risk

### Checklist Tab
- ✅ Click "Refresh" to generate a smart testing checklist
- ✅ See Done ✓ and Todo items
- ✅ View suggestions (collapsible)
- ✅ Click "Export" to download as markdown

### Impact Tab
- ✅ Enter a filename (e.g., `src/app.js`)
- ✅ Click "Analyze" to see affected modules
- ✅ View risk levels and dependency types
- 🔴 Changed | 🟠 Direct | 🟡 Indirect

### History Tab
- ✅ Automatically loads last 10 commits
- ✅ Shows commit hash, message, author, date
- ✅ Lists files changed in each commit
- ✅ Highlights high-frequency files (>3 changes) with 🔥

## 🎨 Widget Features

### Collapsed State
- 60x60px purple gradient button
- Fixed in bottom-right corner
- Hover to see scale animation

### Expanded State
- 420x580px rounded panel
- Dark theme with purple accents
- Smooth 300ms transition
- Click X to collapse

## 🔧 Configuration

### Environment Variables

Edit `boby/frontend/.env`:

```env
VITE_API_URL=http://localhost:8000
VITE_WORKSPACE_PATH=/home/lasacem/FLO/PROJECTS/Hackaton-IBM-CTN
```

Change `VITE_WORKSPACE_PATH` to your project directory.

### Backend Configuration

The backend is already configured to accept requests from `http://localhost:5173`.

If you need to change the port, edit `boby/backend/main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Change this
    ...
)
```

## 🐛 Troubleshooting

### Backend Not Starting
```bash
# Make sure you're in the backend directory
cd boby/backend

# Check if virtual environment is activated
which python  # Should show path to venv

# Install dependencies if needed
pip install -r requirements.txt
```

### Frontend Not Starting
```bash
# Make sure you're in the frontend directory
cd boby/frontend

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Widget Not Visible
- Check browser console for errors
- Verify both backend and frontend are running
- Check that ports 8000 and 5173 are not in use

### API Errors
- Ensure backend is running on port 8000
- Check CORS configuration
- Verify `VITE_API_URL` in `.env` file

### No Data Showing
- Make sure `VITE_WORKSPACE_PATH` points to a valid directory
- For History tab, ensure the directory is a Git repository
- Check backend logs for errors

## 📚 API Endpoints

The backend provides 4 endpoints:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/analyze` | POST | Get dependency graph |
| `/impact` | POST | Analyze file impact |
| `/checklist` | POST | Generate testing checklist |
| `/history` | POST | Get Git commit history |

API documentation available at: `http://localhost:8000/docs`

## 🎯 Testing the Widget

### Test Architecture Tab
1. Expand widget
2. Architecture tab should auto-load
3. You should see nodes and edges
4. Click a node to see tooltip
5. Check that colors match risk levels

### Test Checklist Tab
1. Switch to Checklist tab
2. Click "Refresh" button
3. Wait for checklist to load
4. Verify Done and Todo sections appear
5. Click "Export" to download markdown

### Test Impact Tab
1. Switch to Impact tab
2. Enter a filename from your project
3. Click "Analyze"
4. Verify affected modules appear
5. Check risk badges are colored correctly

### Test History Tab
1. Switch to History tab
2. Timeline should auto-load
3. Verify commits appear with details
4. Check that high-frequency files are highlighted
5. Scroll through the timeline

## 🚀 Production Build

```bash
# Build frontend
cd boby/frontend
npm run build

# Preview production build
npm run preview

# Deploy dist/ folder to your hosting service
```

## 📖 Additional Documentation

- **FRONTEND_SPEC.md** - Detailed technical specifications
- **ARCHITECTURE.md** - System architecture and data flow
- **IMPLEMENTATION_GUIDE.md** - Step-by-step implementation guide
- **PLAN_SUMMARY.md** - Project overview and plan
- **boby/frontend/README.md** - Frontend-specific documentation
- **boby/backend/README.md** - Backend API documentation

## 💡 Tips

1. **Keep both terminals open** - One for backend, one for frontend
2. **Check browser console** - For debugging frontend issues
3. **Check terminal output** - For backend API logs
4. **Use the widget while coding** - It's designed to be always accessible
5. **Export checklists** - Save them for your testing workflow

## 🎉 You're All Set!

The Boby widget is now running and ready to assist you with:
- 📊 Dependency visualization
- ✅ Testing checklists
- 🎯 Impact analysis
- 📜 Git history tracking

Happy coding! 🚀