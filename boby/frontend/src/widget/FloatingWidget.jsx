import { useState } from 'react';
import { X, Sparkles, ArrowLeft, Network, CheckSquare, Target, GitBranch, Shield, GitMerge } from 'lucide-react';
import ArchitectureDiagram from './ArchitectureDiagram';
import SmartChecklist from './SmartChecklist';
import ImpactAnalyzer from './ImpactAnalyzer';
import HistoryTracker from './HistoryTracker';

export default function FloatingWidget() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeModule, setActiveModule] = useState(null);

  const modules = [
    {
      id: 'architecture',
      label: 'Architecture',
      icon: Network,
      gradient: 'from-purple-600 to-purple-800',
      hoverGradient: 'hover:from-purple-500 hover:to-purple-700',
      component: ArchitectureDiagram
    },
    {
      id: 'checklist',
      label: 'Checklist',
      icon: CheckSquare,
      gradient: 'from-green-600 to-green-800',
      hoverGradient: 'hover:from-green-500 hover:to-green-700',
      component: SmartChecklist
    },
    {
      id: 'impact',
      label: 'Impact',
      icon: Target,
      gradient: 'from-orange-600 to-orange-800',
      hoverGradient: 'hover:from-orange-500 hover:to-orange-700',
      component: ImpactAnalyzer
    },
    {
      id: 'history',
      label: 'History',
      icon: GitBranch,
      gradient: 'from-blue-600 to-blue-800',
      hoverGradient: 'hover:from-blue-500 hover:to-blue-700',
      component: HistoryTracker
    },
    {
      id: 'guardian',
      label: 'Push Guardian',
      icon: Shield,
      gradient: 'from-red-600 to-red-800',
      hoverGradient: 'hover:from-red-500 hover:to-red-700',
      component: () => <ComingSoon title="Push Guardian" />
    },
    {
      id: 'merge',
      label: 'Merge Intelligence',
      icon: GitMerge,
      gradient: 'from-teal-600 to-teal-800',
      hoverGradient: 'hover:from-teal-500 hover:to-teal-700',
      component: () => <ComingSoon title="Merge Intelligence" />
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
        // Collapsed button - 60x60px circular with purple gradient and sparkles icon
        <button
          onClick={() => setIsExpanded(true)}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 
                     shadow-2xl hover:scale-110 transition-all duration-300 
                     flex items-center justify-center group"
          aria-label="Open Boby Assistant"
        >
          <Sparkles className="w-8 h-8 text-white group-hover:rotate-12 transition-transform duration-300" />
        </button>
      ) : (
        // Expanded panel - 420x580px
        <div className="w-[420px] h-[580px] bg-gray-900 border border-purple-700 
                        rounded-2xl shadow-2xl widget-transition 
                        flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-purple-700 bg-gray-800">
            {activeModule ? (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-purple-400 hover:text-purple-300 
                           transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <h2 className="text-white font-semibold">Boby Assistant</h2>
              </div>
            )}
            <button
              onClick={() => {
                setIsExpanded(false);
                setActiveModule(null);
              }}
              className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Close Boby Assistant"
            >
              <X className="w-5 h-5 text-gray-400 hover:text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-4">
            {activeModule ? (
              // Module view
              <div className="h-full tab-content">
                {ActiveComponent && <ActiveComponent />}
              </div>
            ) : (
              // Home grid - 2x3 cards
              <div className="grid grid-cols-2 gap-4 h-full content-start">
                {modules.map((module) => {
                  const Icon = module.icon;
                  return (
                    <button
                      key={module.id}
                      onClick={() => handleModuleClick(module.id)}
                      className={`aspect-square rounded-xl bg-gradient-to-br ${module.gradient} 
                                ${module.hoverGradient}
                                shadow-lg hover:shadow-xl hover:scale-105 
                                transition-all duration-300 
                                flex flex-col items-center justify-center gap-3 p-4
                                border border-white/10`}
                    >
                      <Icon className="w-12 h-12 text-white" />
                      <span className="text-white font-medium text-sm text-center">
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

// Coming Soon placeholder component
function ComingSoon({ title }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 
                      flex items-center justify-center mb-6">
        <Sparkles className="w-10 h-10 text-white" />
      </div>
      <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
      <p className="text-gray-400 text-lg mb-2">Coming Soon</p>
      <p className="text-gray-500 text-sm max-w-xs">
        This feature is currently under development and will be available in a future update.
      </p>
    </div>
  );
}

// Made with Bob
