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

  const handleSavePath = async () => {
    // Use demo-repo only
    const demoPath = './demo-repo';
    localStorage.setItem('boby_repo_path', demoPath);
    setRepoPath(demoPath);
    setShowOnboarding(false);
  };

  const handleOpenSettings = () => {
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
          className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-blue-800
                     hover:from-blue-500 hover:to-blue-700
                     transition-all duration-300 hover:scale-110
                     flex items-center justify-center shadow-2xl cursor-grab active:cursor-grabbing
                     border-2 border-blue-400/30 hover:border-blue-300/50
                     animate-pulse hover:animate-none"
          aria-label="Open Boby Assistant"
        >
          <Bot className="w-7 h-7 text-white drop-shadow-lg" />
        </button>
      ) : (
        <div className={`bg-slate-900/95 backdrop-blur-xl border-2 border-slate-700/50 shadow-2xl
                        rounded-3xl transition-all duration-300
                        flex flex-col overflow-hidden
                        ${activeModule === 'architecture' ? 'w-[90vw] h-[90vh] max-w-[1400px] max-h-[900px]' : 'w-[420px]'}`}
             style={{ maxHeight: activeModule === 'architecture' ? '900px' : '80vh' }}>
          
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-sm border-b border-slate-700/50">
            {activeModule ? (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-slate-400 hover:text-blue-400
                           transition-all duration-200 text-sm font-medium
                           hover:translate-x-[-2px]"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <div className="flex items-center justify-between flex-1">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-slate-100 font-semibold text-base">Boby Assistant</h2>
                </div>
                {!showOnboarding && (
                  <button
                    onClick={handleOpenSettings}
                    className="p-2 hover:bg-slate-700/50 rounded-lg transition-all duration-200 hover:scale-110"
                    aria-label="Settings"
                  >
                    <Settings className="w-4 h-4 text-slate-400 hover:text-blue-400" />
                  </button>
                )}
              </div>
            )}
            <button
              onClick={() => {
                setIsExpanded(false);
                setActiveModule(null);
              }}
              className="p-2 hover:bg-red-500/20 rounded-lg transition-all duration-200 hover:scale-110"
              aria-label="Close"
            >
              <X className="w-4 h-4 text-slate-400 hover:text-red-400" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {showOnboarding ? (
              <div className="flex flex-col items-center justify-center p-8 gap-6 min-h-[400px]">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-xl shadow-blue-500/30">
                  <Bot className="w-10 h-10 text-white" />
                </div>
                <div className="text-center">
                  <h3 className="text-slate-100 font-bold text-xl mb-2">Welcome to Boby</h3>
                  <p className="text-slate-400 text-sm">Your AI-powered developer assistant</p>
                </div>

                {/* Demo Info */}
                <div className="w-full max-w-sm space-y-3">
                  <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-slate-700/50 rounded-xl p-4 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center">
                        <Bot className="w-5 h-5 text-blue-400" />
                      </div>
                      <h4 className="text-slate-200 font-semibold text-sm">Demo Repository</h4>
                    </div>
                    <p className="text-slate-400 text-xs leading-relaxed mb-2">
                      Using built-in sample repository with pre-cached analysis for instant results.
                    </p>
                    <code className="block px-3 py-2 bg-slate-900/60 border border-slate-700/50 rounded-lg text-xs font-mono text-blue-300">
                      ./demo-repo
                    </code>
                  </div>

                  <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-600/30 rounded-xl p-3 backdrop-blur-sm">
                    <p className="text-yellow-200 text-xs">
                      <strong>💡 Note:</strong> This demo uses cached results for instant responses. In production, Boby analyzes your actual codebase in real-time.
                    </p>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={handleSavePath}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600
                           text-white rounded-xl transition-all duration-300 text-sm font-semibold
                           shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40
                           hover:scale-105 flex items-center gap-2"
                >
                  Start Exploring
                  <Zap className="w-4 h-4" />
                </button>
              </div>
            ) : activeModule ? (
              <div className="h-full overflow-y-auto">
                {ActiveComponent && <ActiveComponent />}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 p-5 pb-6">
                {modules.map((module) => {
                  const Icon = module.icon;
                  return (
                    <button
                      key={module.id}
                      onClick={() => handleModuleClick(module.id)}
                      className="bg-gradient-to-br from-slate-800/80 to-slate-900/80
                               border-2 border-slate-700/50
                               hover:from-blue-900/40 hover:to-slate-900/80
                               hover:border-blue-600/50 hover:shadow-lg hover:shadow-blue-500/20
                               rounded-2xl transition-all duration-300
                               flex flex-col items-center justify-center gap-3 p-5
                               h-32 group hover:scale-105"
                    >
                      <div className="w-10 h-10 rounded-full bg-blue-600/20 group-hover:bg-blue-600/30
                                    flex items-center justify-center transition-all duration-300
                                    group-hover:scale-110">
                        <Icon className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
                      </div>
                      <span className="text-slate-300 group-hover:text-slate-100 text-xs font-medium text-center
                                     transition-colors duration-300">
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
