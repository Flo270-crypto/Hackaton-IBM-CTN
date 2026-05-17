import { useState, useEffect, useRef } from 'react';
import { X, Bot, ArrowLeft, Network, CheckSquare, Target, GitBranch, Shield, GitMerge } from 'lucide-react';
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
      label: 'Architecture Diagram',
      icon: Network,
      color: 'from-purple-500 to-purple-600',
      component: ArchitectureDiagram
    },
    {
      id: 'guardian',
      label: 'Push Guardian',
      icon: Shield,
      color: 'from-green-500 to-green-600',
      component: PushGuardian
    },
    {
      id: 'checklist',
      label: 'Smart Checklist',
      icon: CheckSquare,
      color: 'from-blue-500 to-blue-600',
      component: SmartChecklist
    },
    {
      id: 'impact',
      label: 'Impact Analyzer',
      icon: Target,
      color: 'from-orange-500 to-orange-600',
      component: ImpactAnalyzer
    },
    {
      id: 'merge',
      label: 'Merge Intelligence',
      icon: GitMerge,
      color: 'from-cyan-500 to-cyan-600',
      component: MergeIntelligence
    },
    {
      id: 'history',
      label: 'History Tracker',
      icon: GitBranch,
      color: 'from-pink-500 to-pink-600',
      component: HistoryTracker
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
                        rounded-2xl transition-all duration-300
                        flex flex-col overflow-hidden
                        ${activeModule === 'architecture' ? 'w-[90vw] h-[90vh] max-w-[1400px] max-h-[900px]' : 'w-[280px]'}`}
             style={{ maxHeight: activeModule === 'architecture' ? '900px' : activeModule ? '80vh' : '400px' }}>
          
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2.5 bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-sm border-b border-slate-700/50">
            {activeModule ? (
              <button
                onClick={handleBack}
                className="flex items-center gap-1.5 text-slate-400 hover:text-blue-400
                           transition-all duration-200 text-xs font-medium
                           hover:translate-x-[-2px]"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5 text-white" />
                </div>
                <div>
                  <h2 className="text-slate-100 font-semibold text-xs leading-tight">Boby</h2>
                  <p className="text-slate-400 text-[10px] leading-tight">AI Developer Assistant</p>
                </div>
              </div>
            )}
            <button
              onClick={() => {
                setIsExpanded(false);
                setActiveModule(null);
              }}
              className="p-1.5 hover:bg-red-500/20 rounded-lg transition-all duration-200 hover:scale-110"
              aria-label="Close"
            >
              <X className="w-3.5 h-3.5 text-slate-400 hover:text-red-400" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            {showOnboarding ? (
              <div className="flex flex-col p-3 gap-3">
                {/* Demo Mode Banner */}
                <div className="bg-gradient-to-r from-blue-900/40 to-blue-800/40 border border-blue-600/30 rounded-lg p-2.5">
                  <p className="text-blue-200 text-[10px] leading-relaxed">
                    <strong>Demo Mode:</strong> Using sample repo with cached analysis
                  </p>
                </div>

                {/* Action Button */}
                <button
                  onClick={handleSavePath}
                  className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600
                           text-white rounded-lg transition-all duration-200 text-xs font-semibold
                           shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30
                           hover:scale-[1.02]"
                >
                  Start Exploring
                </button>
              </div>
            ) : activeModule ? (
              <div className="h-full overflow-y-auto">
                {ActiveComponent && <ActiveComponent />}
              </div>
            ) : (
              <div className="flex flex-col">
                {/* Demo Mode Banner */}
                <div className="mx-3 mt-3 mb-2 bg-gradient-to-r from-blue-900/40 to-blue-800/40 border border-blue-600/30 rounded-lg p-2">
                  <p className="text-blue-200 text-[10px] leading-tight">
                    <strong>Demo Mode</strong> • Sample repo
                  </p>
                </div>

                {/* Features List */}
                <div className="px-2 pb-2 space-y-0.5">
                  {modules.map((module) => {
                    const Icon = module.icon;
                    return (
                      <button
                        key={module.id}
                        onClick={() => handleModuleClick(module.id)}
                        className="w-full flex items-center gap-2.5 px-2.5 py-2
                                 bg-slate-800/40 hover:bg-slate-700/60
                                 border border-slate-700/30 hover:border-slate-600/50
                                 rounded-lg transition-all duration-200
                                 group hover:scale-[1.02]"
                      >
                        <div className={`w-7 h-7 rounded-md bg-gradient-to-br ${module.color}
                                      flex items-center justify-center flex-shrink-0
                                      shadow-sm group-hover:shadow-md transition-all duration-200`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-slate-200 group-hover:text-white text-xs font-medium text-left
                                       transition-colors duration-200 leading-tight">
                          {module.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Made with Bob
