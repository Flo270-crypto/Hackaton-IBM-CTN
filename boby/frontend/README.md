# Boby Frontend - Floating Developer Assistant Widget

A React + Vite + Tailwind CSS application that provides a floating widget for code analysis, dependency visualization, impact analysis, and Git history tracking.

## Features

- **Architecture Diagram**: Visualize dependency graphs with risk-colored nodes
- **Smart Checklist**: Generate and export testing checklists
- **Impact Analyzer**: Analyze the impact of file changes
- **History Tracker**: View Git commit history with high-frequency file highlights

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Backend API running on `http://localhost:8000`

### Installation

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Environment Variables

Create a `.env` file (see `.env.example`):

```env
VITE_API_URL=http://localhost:8000
VITE_WORKSPACE_PATH=/path/to/your/workspace
```

## Project Structure

```
src/
├── App.jsx                      # Main app component
├── main.jsx                     # React entry point
├── index.css                    # Tailwind CSS + custom styles
├── services/
│   └── api.js                   # API service layer
└── widget/
    ├── FloatingWidget.jsx       # Main widget container
    ├── ArchitectureDiagram.jsx  # React Flow dependency graph
    ├── SmartChecklist.jsx       # Testing checklist
    ├── ImpactAnalyzer.jsx       # Impact analysis
    └── HistoryTracker.jsx       # Git history timeline
```

## Widget Usage

### Collapsed State
- 60x60px circular button in bottom-right corner
- Click to expand

### Expanded State
- 420x580px panel with 4 tabs
- Click X to collapse

### Tabs

#### 1. Architecture
- Auto-loads dependency graph on open
- Color-coded nodes: 🟢 Low | 🟠 Medium | 🔴 High risk
- Click nodes to see details and connections

#### 2. Checklist
- Click "Refresh" to generate testing checklist
- Click "Export" to download as markdown

#### 3. Impact
- Enter filename to analyze impact
- Shows affected modules with risk levels
- Types: Changed | Direct | Indirect

#### 4. History
- Auto-loads last 10 commits
- Shows commit details and changed files
- Highlights high-frequency files (>3 changes)

## Development

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## API Integration

The widget connects to the backend API at `VITE_API_URL`:

- `POST /analyze` - Get dependency graph
- `POST /impact` - Analyze file impact
- `POST /checklist` - Generate testing checklist
- `POST /history` - Get Git history

## Styling

- **Theme**: Dark purple with Tailwind CSS
- **Colors**: Purple gradient (600-800)
- **Risk Levels**: Red (High), Orange (Medium), Green (Low)

## Troubleshooting

### Widget Not Visible
- Check that the widget is rendered in App.jsx
- Verify z-index and positioning

### API Errors
- Ensure backend is running on port 8000
- Check CORS configuration in backend
- Verify environment variables

### React Flow Not Rendering
- Ensure `reactflow/dist/style.css` is imported
- Check that nodes and edges are properly formatted

## Technologies

- React 18
- Vite 5
- Tailwind CSS 3
- React Flow 11
- Lucide React (icons)

## License

MIT
