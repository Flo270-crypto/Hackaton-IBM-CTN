# Boby Backend

FastAPI backend for code analysis and dependency tracking.

## Features

- **Dependency Graph Analysis**: Scans repositories and builds dependency graphs
- **Impact Analysis**: Identifies affected modules when files change
- **Testing Checklist**: Generates intelligent testing checklists
- **Git History Tracking**: Analyzes commit history and file modifications

## Setup

### 1. Create Virtual Environment

```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Run the Server

```bash
python main.py
```

Or use the startup script:

```bash
chmod +x start.sh
./start.sh
```

The server will start on `http://localhost:8000`

## API Endpoints

### 1. POST /analyze

Analyzes a repository and returns a dependency graph.

**Request:**
```json
{
  "repo_path": "/path/to/repository"
}
```

**Response:**
```json
{
  "nodes": [
    {
      "id": "src/app.js",
      "label": "app.js",
      "risk": "HIGH"
    }
  ],
  "edges": [
    {
      "source": "src/app.js",
      "target": "src/utils.js"
    }
  ]
}
```

### 2. POST /impact

Analyzes the impact of changes to a file.

**Request:**
```json
{
  "changed_file": "src/utils.js",
  "graph": {
    "nodes": [...],
    "edges": [...]
  }
}
```

**Response:**
```json
{
  "affected_modules": [
    {
      "file": "src/utils.js",
      "risk": "HIGH",
      "reason": "Modified file",
      "type": "changed"
    },
    {
      "file": "src/app.js",
      "risk": "HIGH",
      "reason": "Direct dependency",
      "type": "direct"
    }
  ]
}
```

### 3. POST /checklist

Generates a testing checklist based on repository context.

**Request:**
```json
{
  "repo_context": "Repository with tests and documentation"
}
```

**Response:**
```json
{
  "done": [
    "Test files exist",
    "Documentation exists"
  ],
  "todo": [
    "Run unit tests",
    "Test API endpoints",
    "Verify error handling"
  ],
  "suggestions": [
    "Test with different input scenarios",
    "Verify backward compatibility",
    "Check performance impact"
  ]
}
```

### 4. POST /history

Gets Git history for a repository.

**Request:**
```json
{
  "repo_path": "/path/to/repository"
}
```

**Response:**
```json
{
  "commits": [
    {
      "hash": "abc12345",
      "message": "Fix bug in authentication",
      "author": "John Doe",
      "date": "2026-05-15T10:30:00",
      "files_changed": ["src/auth.js", "src/utils.js"]
    }
  ],
  "most_modified_files": [
    {
      "file": "src/utils.js",
      "modification_count": 5,
      "high_frequency": true
    }
  ]
}
```

## CORS Configuration

The backend is configured to accept requests from `http://localhost:5173` (default Vite dev server).

To modify CORS settings, edit the `allow_origins` list in `main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Add your frontend URL here
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## File Structure

```
backend/
├── main.py              # FastAPI application with 4 endpoints
├── analyzer.py          # Dependency graph analysis
├── git_tracker.py       # Git history tracking
├── requirements.txt     # Python dependencies
├── start.sh            # Startup script
└── README.md           # This file
```

## Supported File Types

The analyzer supports the following file types:
- JavaScript (`.js`, `.jsx`)
- TypeScript (`.ts`, `.tsx`)
- Python (`.py`)

## Development

### Running Tests

```bash
pytest
```

### API Documentation

Once the server is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Troubleshooting

### Port Already in Use

If port 8000 is already in use, modify the port in `main.py`:

```python
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)  # Change port here
```

### Git Repository Not Found

Ensure the repository path contains a `.git` folder. The `/history` endpoint requires a valid Git repository.

## License

MIT