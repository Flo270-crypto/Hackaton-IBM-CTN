import { useState, useEffect } from 'react';
import { X, Bot, ArrowLeft, Network, CheckSquare, Target, GitBranch, Shield, GitMerge, Settings } from 'lucide-react';
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
  const [inputPath, setInputPath] = useState('');

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
    if (inputPath.trim()) {
      localStorage.setItem('boby_repo_path', inputPath.trim());
      setRepoPath(inputPath.trim());
      setShowOnboarding(false);
      setInputPath('');
    }
  };

  const handleOpenSettings = () => {
    setInputPath(repoPath);
    setShowOnboarding(true);
    setActiveModule(null);
  };

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

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          className="w-14 h-14 rounded-lg bg-slate-800 border border-slate-700
                     hover:bg-slate-700 hover:border-slate-600
                     transition-all duration-200
                     flex items-center justify-center shadow-lg"
          aria-label="Open Boby Assistant"
        >
          <Bot className="w-6 h-6 text-slate-300" />
        </button>
      ) : (
        <div className={`bg-slate-900 border border-slate-700 shadow-2xl
                        rounded-lg transition-all duration-200
                        flex flex-col overflow-hidden
                        ${activeModule === 'architecture' ? 'w-[90vw] h-[90vh] max-w-[1400px] max-h-[900px]' : 'w-[420px] h-auto max-h-[560px]'}`}>
          
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
          <div className="flex-1 overflow-hidden">
            {showOnboarding ? (
              <div className="flex flex-col items-center justify-center p-8 gap-6">
                <Bot className="w-16 h-16 text-blue-400" />
                <div className="text-center">
                  <h3 className="text-slate-200 font-semibold text-lg mb-2">Welcome to Boby</h3>
                  <p className="text-slate-400 text-sm">Enter your local repo path to get started</p>
                </div>
                <div className="w-full max-w-sm">
                  <input
                    type="text"
                    value={inputPath}
                    onChange={(e) => setInputPath(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSavePath()}
                    placeholder="/home/user/my-project"
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg
                             text-slate-200 placeholder-slate-500
                             focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                             transition-colors text-sm"
                  />
                </div>
                <button
                  onClick={handleSavePath}
                  disabled={!inputPath.trim()}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700
                           disabled:text-slate-500 disabled:cursor-not-allowed
                           text-white rounded-lg transition-colors text-sm font-medium"
                >
                  Let's go
                </button>
              </div>
            ) : activeModule ? (
              <div className="h-full overflow-auto">
                {ActiveComponent && <ActiveComponent />}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 p-4">
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
