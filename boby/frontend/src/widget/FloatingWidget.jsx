import { useState, useEffect, useRef } from 'react';
import { X, Bot, ArrowLeft, Network, CheckSquare, Target, GitBranch, Shield, GitMerge, Settings, AlertTriangle } from 'lucide-react';
import ArchitectureDiagram from './ArchitectureDiagram';
import SmartChecklist from './SmartChecklist';
import ImpactAnalyzer from './ImpactAnalyzer';
import HistoryTracker from './HistoryTracker';
import PushGuardian from './PushGuardian';
import MergeIntelligence from './MergeIntelligence';

export default function FloatingWidget() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeModule, setActiveModule] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [repoPath, setRepoPath] = useState('');
  const [inputPath, setInputPath] = useState('./demo-repo');
  const [position, setPosition] = useState({ x: window.innerWidth - 90, y: window.innerHeight - 90 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const buttonRef = useRef(null);

  useEffect(() => {
    const savedPath = localStorage.getItem('boby_repo_path');
    if (savedPath) {
      setRepoPath(savedPath);
      setShowOnboarding(false);
    } else {
      setShowOnboarding(true);
    }
  }, []);

  const handleSavePath = () => {
    // Always use demo-repo for hackathon demo
    const demoPath = './demo-repo';
    localStorage.setItem('boby_repo_path', demoPath);
    setRepoPath(demoPath);
    setShowOnboarding(false);
  };

  const handleOpenSettings = () => {
    setInputPath('./demo-repo');
    setShowOnboarding(true);
    setActiveModule(null);
  };

  const handleMouseDown = (e) => {
    if (isExpanded) return; // Don't drag when expanded
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    
    // Keep button within viewport bounds
    const maxX = window.innerWidth - 56;
    const maxY = window.innerHeight - 56;
    
    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY))
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  const modules = [
    {
      id: 'architecture',
      label: 'Architecture',
      icon: Network,
      component: ArchitectureDiagram
    },
    {
      id: 'checklist',
      label: 'Checklist',
      icon: CheckSquare,
      component: SmartChecklist
    },
    {
      id: 'impact',
      label: 'Impact',
      icon: Target,
      component: ImpactAnalyzer
    },
    {
      id: 'history',
      label: 'History',
      icon: GitBranch,
      component: HistoryTracker
    },
    {
      id: 'guardian',
      label: 'Push Guardian',
      icon: Shield,
      component: PushGuardian
    },
    {
      id: 'merge',
      label: 'Merge Intelligence',
      icon: GitMerge,
      component: MergeIntelligence
    }
  ];

  const handleModuleClick = (moduleId) => {
    setActiveModule(moduleId);
  };

  const handleBack = () => {
    setActiveModule(null);
  };

  const ActiveComponent = activeModule
    ? modules.find(m => m.id === activeModule)?.component
    : null;

  // Calculate widget position to keep it on screen
  const getWidgetStyle = () => {
    if (!isExpanded) {
      return {
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'default'
      };
    }

    // When expanded, position based on button location
    const widgetWidth = activeModule === 'architecture' ? Math.min(window.innerWidth * 0.9, 1400) : 420;
    const widgetHeight = activeModule === 'architecture' ? Math.min(window.innerHeight * 0.9, 900) : 560;
    
    let left = position.x;
    let top = position.y;

    // Adjust if widget would go off right edge
    if (left + widgetWidth > window.innerWidth) {
      left = Math.max(0, window.innerWidth - widgetWidth - 20);
    }

    // Adjust if widget would go off bottom edge
    if (top + widgetHeight > window.innerHeight) {
      top = Math.max(0, window.innerHeight - widgetHeight - 20);
    }

    return {
      left: `${left}px`,
      top: `${top}px`,
      cursor: 'default'
    };
  };

  return (
    <div
      className="fixed z-50 transition-all duration-300 ease-out"
      style={getWidgetStyle()}
    >
      {!isExpanded ? (
        <button
          ref={buttonRef}
          onMouseDown={handleMouseDown}
          onClick={() => !isDragging && setIsExpanded(true)}
          className="w-14 h-14 rounded-lg bg-slate-800 border border-slate-700
                     hover:bg-slate-700 hover:border-slate-600
                     transition-all duration-200
                     flex items-center justify-center shadow-lg cursor-grab active:cursor-grabbing"
          aria-label="Open Boby Assistant"
        >
          <Bot className="w-6 h-6 text-slate-300" />
        </button>
      ) : (
        <div className={`bg-slate-900 border border-slate-700 shadow-2xl
                        rounded-lg transition-all duration-300
                        flex flex-col
                        ${activeModule === 'architecture' ? 'w-[90vw] h-[90vh] max-w-[1400px] max-h-[900px]' : 'w-[420px]'}`}
             style={{ maxHeight: activeModule === 'architecture' ? '900px' : '80vh' }}>
          
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700">
            {activeModule ? (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-slate-400 hover:text-slate-200
                           transition-colors text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <div className="flex items-center justify-between flex-1">
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-slate-400" />
                  <h2 className="text-slate-200 font-medium text-sm">Boby Assistant</h2>
                </div>
                {!showOnboarding && (
                  <button
                    onClick={handleOpenSettings}
                    className="p-1 hover:bg-slate-700 rounded transition-colors"
                    aria-label="Settings"
                  >
                    <Settings className="w-4 h-4 text-slate-400 hover:text-slate-200" />
                  </button>
                )}
              </div>
            )}
            <button
              onClick={() => {
                setIsExpanded(false);
                setActiveModule(null);
              }}
              className="p-1 hover:bg-slate-700 rounded transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4 text-slate-400 hover:text-slate-200" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {showOnboarding ? (
              <div className="flex flex-col items-center justify-center p-8 gap-6 min-h-[400px]">
                {/* Demo Mode Warning Banner */}
                <div className="w-full bg-yellow-900/30 border border-yellow-700/50 rounded-lg p-3 flex gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                  <p className="text-yellow-200 text-xs leading-relaxed">
                    <strong>⚠️ Demo mode:</strong> Only the built-in demo repo is supported in this version.
                    Production version supports any local repository via the Boby local agent.
                  </p>
                </div>
                
                <Bot className="w-16 h-16 text-blue-400" />
                <div className="text-center">
                  <h3 className="text-slate-200 font-semibold text-lg mb-2">Welcome to Boby</h3>
                  <p className="text-slate-400 text-sm">Demo repository ready to analyze</p>
                </div>
                <div className="w-full max-w-sm">
                  <input
                    type="text"
                    value={inputPath}
                    disabled
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg
                             text-slate-400 cursor-not-allowed
                             transition-colors text-sm"
                  />
                </div>
                <button
                  onClick={handleSavePath}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700
                           text-white rounded-lg transition-colors text-sm font-medium"
                >
                  Let's go
                </button>
              </div>
            ) : activeModule ? (
              <div className="h-full overflow-y-auto">
                {ActiveComponent && <ActiveComponent />}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 p-4 pb-6">
                {modules.map((module) => {
                  const Icon = module.icon;
                  return (
                    <button
                      key={module.id}
                      onClick={() => handleModuleClick(module.id)}
                      className="bg-slate-800 border border-blue-900/50
                               hover:bg-blue-900/30 hover:border-blue-700/50
                               rounded-lg transition-all duration-200
                               flex flex-col items-center justify-center gap-2 p-4
                               h-28"
                    >
                      <Icon className="w-6 h-6 text-blue-400" />
                      <span className="text-slate-300 text-xs font-medium text-center">
                        {module.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Made with Bob
