# Boby Frontend - Technical Specification

## Project Overview
Boby is a floating developer assistant widget built with React + Vite + Tailwind CSS. It provides real-time code analysis, dependency visualization, impact analysis, and Git history tracking.

## Technology Stack
- **Framework**: React 18+ with Vite
- **Styling**: Tailwind CSS (dark purple theme)
- **Visualization**: React Flow (for dependency graphs)
- **HTTP Client**: Fetch API
- **State Management**: React hooks (useState, useEffect)
- **Animations**: Tailwind transitions + CSS transforms

## Project Structure
```
boby/frontend/
├── src/
│   ├── App.jsx                      # Main app component (renders FloatingWidget only)
│   ├── main.jsx                     # Entry point
│   ├── index.css                    # Tailwind imports + custom styles
│   ├── services/
│   │   └── api.js                   # API service layer for backend calls
│   └── widget/
│       ├── FloatingWidget.jsx       # Main widget container with expand/collapse
│       ├── ArchitectureDiagram.jsx  # React Flow dependency graph
│       ├── SmartChecklist.jsx       # Done/Todo checklist with export
│       ├── ImpactAnalyzer.jsx       # File impact analysis
│       └── HistoryTracker.jsx       # Git history timeline
├── .env                             # Environment variables
├── .env.example                     # Example env file
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Component Specifications

### 1. FloatingWidget.jsx
**Purpose**: Main container that manages widget state and tab navigation

**Features**:
- Fixed position: bottom-right corner (20px from edges)
- Collapsed state: 60x60px circular button with purple gradient
- Expanded state: 420x580px rounded panel
- Smooth expand/collapse animation (300ms ease-in-out)
- Tab navigation: Architecture | Checklist | Impact | History
- Collapse button (X icon) in top-right of expanded panel

**State**:
```javascript
const [isExpanded, setIsExpanded] = useState(false);
const [activeTab, setActiveTab] = useState('architecture');
```

**Styling**:
- Collapsed: `bg-gradient-to-br from-purple-600 to-purple-800`
- Expanded: `bg-gray-900 border border-purple-700`
- Shadow: `shadow-2xl`
- Z-index: `z-50`

### 2. ArchitectureDiagram.jsx
**Purpose**: Visualize dependency graph using React Flow

**Props**:
```javascript
{
  nodes: Array<{id: string, label: string, risk: 'HIGH'|'MEDIUM'|'LOW'}>,
  edges: Array<{source: string, target: string}>
}
```

**Features**:
- Auto-fetch graph on mount using `POST /analyze` with current workspace path
- Node colors:
  - GREEN (`bg-green-500`): LOW risk
  - ORANGE (`bg-orange-500`): MEDIUM risk
  - RED (`bg-red-500`): HIGH risk
- Animated edges with arrows
- Click node → show tooltip with:
  - Filename
  - Risk level
  - Number of dependencies
  - Number of dependents
- Loading state while fetching
- Error handling with retry button

**React Flow Configuration**:
```javascript
const nodeTypes = {
  custom: CustomNode // Custom node with risk-based styling
};

const defaultEdgeOptions = {
  animated: true,
  style: { stroke: '#a855f7' } // purple-500
};
```

### 3. SmartChecklist.jsx
**Purpose**: Display and manage testing checklist

**Features**:
- Two sections: "Done ✓" and "Todo □"
- Refresh button → `POST /checklist` with repo context
- Export markdown button → downloads checklist as .md file
- Checkbox styling with purple accent
- Suggestions section (collapsible)

**API Call**:
```javascript
POST /checklist
Body: { repo_context: "Repository description" }
Response: { done: [], todo: [], suggestions: [] }
```

**Markdown Export Format**:
```markdown
# Boby Testing Checklist

## Done ✓
- [x] Item 1
- [x] Item 2

## Todo
- [ ] Item 1
- [ ] Item 2

## Suggestions
- Item 1
- Item 2
```

### 4. ImpactAnalyzer.jsx
**Purpose**: Analyze impact of file changes

**Features**:
- Text input for filename (with autocomplete suggestions)
- Submit button → `POST /impact`
- Results displayed as cards with risk badges:
  - HIGH: `bg-red-500`
  - MEDIUM: `bg-orange-500`
  - LOW: `bg-green-500`
- Show impact type: Changed | Direct | Indirect
- Show reason for each affected file
- Loading spinner during analysis

**API Call**:
```javascript
POST /impact
Body: { 
  changed_file: "src/app.js",
  graph: { nodes: [...], edges: [...] }
}
Response: {
  affected_modules: [
    { file: string, risk: string, reason: string, type: string }
  ]
}
```

### 5. HistoryTracker.jsx
**Purpose**: Display Git commit history timeline

**Features**:
- Vertical timeline with purple line
- Auto-fetch on mount: `POST /history` with current workspace path
- Each commit card shows:
  - Commit hash (first 8 chars)
  - Message
  - Author
  - Date (formatted: "2 hours ago" or "May 15, 2026")
  - Files changed (list)
- High-frequency files highlighted in orange
- Scroll container (max-height: 450px)
- Loading state

**Timeline Styling**:
- Purple vertical line on left
- Circular dots at each commit
- Cards with hover effect
- Orange badge for high-frequency files (>3 modifications)

## API Service Layer (services/api.js)

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = {
  analyze: async (repoPath) => {
    const response = await fetch(`${API_URL}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ repo_path: repoPath })
    });
    return response.json();
  },
  
  impact: async (changedFile, graph) => {
    const response = await fetch(`${API_URL}/impact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ changed_file: changedFile, graph })
    });
    return response.json();
  },
  
  checklist: async (repoContext) => {
    const response = await fetch(`${API_URL}/checklist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ repo_context: repoContext })
    });
    return response.json();
  },
  
  history: async (repoPath) => {
    const response = await fetch(`${API_URL}/history`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ repo_path: repoPath })
    });
    return response.json();
  }
};
```

## Theme Configuration (tailwind.config.js)

```javascript
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'boby-purple': {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
        }
      }
    }
  },
  plugins: []
}
```

## Environment Variables

**.env.example**:
```
VITE_API_URL=http://localhost:8000
VITE_WORKSPACE_PATH=/path/to/workspace
```

**.env** (gitignored):
```
VITE_API_URL=http://localhost:8000
VITE_WORKSPACE_PATH=/home/lasacem/FLO/PROJECTS/Hackaton-IBM-CTN
```

## Dependencies (package.json)

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "reactflow": "^11.10.0",
    "lucide-react": "^0.300.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.4.0",
    "vite": "^5.0.8"
  }
}
```

## Animation Specifications

### Widget Expand/Collapse
```css
.widget-collapsed {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  transition: all 300ms ease-in-out;
}

.widget-expanded {
  width: 420px;
  height: 580px;
  border-radius: 16px;
  transition: all 300ms ease-in-out;
}
```

### Tab Transitions
```css
.tab-content {
  animation: fadeIn 200ms ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
```

## Error Handling

All API calls should include:
1. Try-catch blocks
2. Loading states
3. Error messages displayed to user
4. Retry buttons for failed requests

Example:
```javascript
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

try {
  setLoading(true);
  const data = await api.analyze(repoPath);
  setData(data);
} catch (err) {
  setError(err.message);
} finally {
  setLoading(false);
}
```

## Testing Checklist

- [ ] Widget expands/collapses smoothly
- [ ] All 4 tabs switch correctly
- [ ] Architecture diagram loads and displays nodes
- [ ] Node colors match risk levels
- [ ] Node tooltips show on click
- [ ] Checklist refreshes on button click
- [ ] Markdown export downloads file
- [ ] Impact analyzer accepts input and shows results
- [ ] History timeline displays commits
- [ ] High-frequency files highlighted in orange
- [ ] All API calls handle errors gracefully
- [ ] Loading states display correctly
- [ ] Dark purple theme applied consistently

## Development Workflow

1. Initialize Vite project: `npm create vite@latest frontend -- --template react`
2. Install dependencies: `npm install`
3. Configure Tailwind CSS
4. Create component structure
5. Implement API service layer
6. Build components one by one (following todo list order)
7. Test each component individually
8. Integration testing with backend
9. Final styling and polish

## Notes

- The widget should be responsive within its fixed dimensions
- Use Tailwind's built-in transitions for smooth animations
- Keep components modular and reusable
- Use proper React patterns (hooks, props, state management)
- Ensure accessibility (keyboard navigation, ARIA labels)
- Add proper error boundaries for production