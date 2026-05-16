# Boby Frontend - Implementation Guide

## Quick Start Commands

```bash
# Navigate to boby directory
cd boby

# Create Vite React project
npm create vite@latest frontend -- --template react

# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Install additional packages
npm install reactflow lucide-react

# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Start development server
npm run dev
```

## Step-by-Step Implementation

### Step 1: Project Initialization
```bash
cd boby
npm create vite@latest frontend -- --template react
cd frontend
npm install
npm install reactflow lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Step 2: Configure Tailwind CSS

**tailwind.config.js**:
```javascript
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'boby-purple': {
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
        }
      }
    }
  },
  plugins: []
}
```

**src/index.css**:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  background-color: #111827;
  color: #f3f4f6;
}
```

### Step 3: Environment Setup

**.env**:
```
VITE_API_URL=http://localhost:8000
VITE_WORKSPACE_PATH=/home/lasacem/FLO/PROJECTS/Hackaton-IBM-CTN
```

**.env.example**:
```
VITE_API_URL=http://localhost:8000
VITE_WORKSPACE_PATH=/path/to/your/workspace
```

### Step 4: Create API Service

**src/services/api.js**:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = {
  analyze: async (repoPath) => {
    const response = await fetch(`${API_URL}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ repo_path: repoPath })
    });
    if (!response.ok) throw new Error('Failed to analyze repository');
    return response.json();
  },
  
  impact: async (changedFile, graph) => {
    const response = await fetch(`${API_URL}/impact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ changed_file: changedFile, graph })
    });
    if (!response.ok) throw new Error('Failed to analyze impact');
    return response.json();
  },
  
  checklist: async (repoContext) => {
    const response = await fetch(`${API_URL}/checklist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ repo_context: repoContext })
    });
    if (!response.ok) throw new Error('Failed to generate checklist');
    return response.json();
  },
  
  history: async (repoPath) => {
    const response = await fetch(`${API_URL}/history`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ repo_path: repoPath })
    });
    if (!response.ok) throw new Error('Failed to fetch history');
    return response.json();
  }
};
```

### Step 5: Create FloatingWidget Component

**src/widget/FloatingWidget.jsx** (Skeleton):
```javascript
import { useState } from 'react';
import { X, Maximize2 } from 'lucide-react';
import ArchitectureDiagram from './ArchitectureDiagram';
import SmartChecklist from './SmartChecklist';
import ImpactAnalyzer from './ImpactAnalyzer';
import HistoryTracker from './HistoryTracker';

export default function FloatingWidget() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('architecture');

  const tabs = [
    { id: 'architecture', label: 'Architecture' },
    { id: 'checklist', label: 'Checklist' },
    { id: 'impact', label: 'Impact' },
    { id: 'history', label: 'History' }
  ];

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {!isExpanded ? (
        // Collapsed button
        <button
          onClick={() => setIsExpanded(true)}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 
                     shadow-2xl hover:scale-110 transition-transform duration-300 
                     flex items-center justify-center"
        >
          <Maximize2 className="w-8 h-8 text-white" />
        </button>
      ) : (
        // Expanded panel
        <div className="w-[420px] h-[580px] bg-gray-900 border border-purple-700 
                        rounded-2xl shadow-2xl transition-all duration-300 
                        flex flex-col overflow-hidden">
          {/* Header with tabs and close button */}
          <div className="flex items-center justify-between p-4 border-b border-purple-700">
            <div className="flex gap-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                    ${activeTab === tab.id 
                      ? 'bg-purple-600 text-white' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-1 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-auto p-4">
            {activeTab === 'architecture' && <ArchitectureDiagram />}
            {activeTab === 'checklist' && <SmartChecklist />}
            {activeTab === 'impact' && <ImpactAnalyzer />}
            {activeTab === 'history' && <HistoryTracker />}
          </div>
        </div>
      )}
    </div>
  );
}
```

### Step 6: Create Component Skeletons

Create these files with basic structure:
- `src/widget/ArchitectureDiagram.jsx`
- `src/widget/SmartChecklist.jsx`
- `src/widget/ImpactAnalyzer.jsx`
- `src/widget/HistoryTracker.jsx`

### Step 7: Update App.jsx

**src/App.jsx**:
```javascript
import FloatingWidget from './widget/FloatingWidget';

function App() {
  return <FloatingWidget />;
}

export default App;
```

### Step 8: Implement Each Component

Follow the detailed specifications in `FRONTEND_SPEC.md` for each component.

## Component Implementation Order

1. ✅ **FloatingWidget** - Main container (Step 3)
2. ✅ **API Service** - Backend integration (Step 11)
3. 🔄 **ArchitectureDiagram** - React Flow graph (Steps 5-6)
4. 🔄 **SmartChecklist** - Checklist UI (Steps 7-8)
5. 🔄 **ImpactAnalyzer** - Impact analysis (Step 9)
6. 🔄 **HistoryTracker** - Git timeline (Step 10)
7. 🔄 **Styling & Polish** - Theme and animations (Step 12)
8. 🔄 **Testing** - Integration tests (Steps 14-15)

## Key Implementation Tips

### React Flow Setup
```javascript
import ReactFlow, { Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';

const nodeColor = (risk) => {
  switch(risk) {
    case 'HIGH': return '#ef4444';
    case 'MEDIUM': return '#f97316';
    case 'LOW': return '#22c55e';
    default: return '#6b7280';
  }
};
```

### Markdown Export
```javascript
const exportMarkdown = (checklist) => {
  const content = `# Boby Testing Checklist\n\n## Done ✓\n${
    checklist.done.map(item => `- [x] ${item}`).join('\n')
  }\n\n## Todo\n${
    checklist.todo.map(item => `- [ ] ${item}`).join('\n')
  }`;
  
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'boby-checklist.md';
  a.click();
};
```

### Date Formatting
```javascript
const formatDate = (isoString) => {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now - date;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  
  if (diffHours < 24) {
    return `${diffHours} hours ago`;
  }
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
};
```

## Testing Checklist

### Manual Testing
- [ ] Start backend: `cd boby/backend && python main.py`
- [ ] Start frontend: `cd boby/frontend && npm run dev`
- [ ] Click widget to expand
- [ ] Switch between all 4 tabs
- [ ] Verify Architecture diagram loads
- [ ] Click nodes to see tooltips
- [ ] Refresh checklist
- [ ] Export checklist as markdown
- [ ] Enter filename in Impact analyzer
- [ ] View commit history in History tab
- [ ] Collapse widget
- [ ] Check console for errors

### Integration Testing
```bash
# Terminal 1: Start backend
cd boby/backend
source venv/bin/activate
python main.py

# Terminal 2: Start frontend
cd boby/frontend
npm run dev

# Open browser to http://localhost:5173
```

## Common Issues & Solutions

### CORS Error
**Problem**: API calls fail with CORS error
**Solution**: Ensure backend CORS allows `http://localhost:5173`

### React Flow Not Rendering
**Problem**: Graph doesn't display
**Solution**: Import CSS: `import 'reactflow/dist/style.css'`

### Environment Variables Not Working
**Problem**: `import.meta.env.VITE_API_URL` is undefined
**Solution**: Restart dev server after creating `.env` file

### Widget Not Visible
**Problem**: Widget doesn't appear
**Solution**: Check z-index and fixed positioning in FloatingWidget

## Production Build

```bash
# Build frontend
cd boby/frontend
npm run build

# Preview production build
npm run preview

# Deploy dist/ folder to hosting service
```

## Next Steps After Implementation

1. Add unit tests with Vitest
2. Add E2E tests with Playwright
3. Optimize bundle size
4. Add error boundaries
5. Implement keyboard shortcuts
6. Add accessibility features
7. Create user documentation
8. Set up CI/CD pipeline

## Resources

- [React Flow Documentation](https://reactflow.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Vite Documentation](https://vitejs.dev/)
- [Lucide Icons](https://lucide.dev/)
- Backend API: `http://localhost:8000/docs`