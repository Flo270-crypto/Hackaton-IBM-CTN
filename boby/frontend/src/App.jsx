import FloatingWidget from './widget/FloatingWidget';
import { BobyProvider } from './context/BobyContext';
import { Bot, Zap, Shield, GitBranch } from 'lucide-react';

function App() {
  return (
    <BobyProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex">
        {/* Left Sidebar Panel */}
        <div className="w-80 h-screen overflow-y-auto border-r border-slate-700 bg-slate-900/50 px-4 py-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Bot className="w-8 h-8 text-blue-400" />
              <h1 className="text-2xl font-bold text-slate-100">Boby</h1>
            </div>
            <p className="text-slate-400 text-xs mb-3">
              AI-Powered Developer Assistant
            </p>
            <div className="px-3 py-1.5 bg-yellow-900/30 border border-yellow-700/50 rounded-lg">
              <p className="text-yellow-200 text-xs">
                🎯 <strong>Demo</strong> - Built-in repo
              </p>
            </div>
          </div>

          {/* Quick Start */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 mb-4">
            <h2 className="text-sm font-semibold text-slate-100 mb-3 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-blue-400" />
              Quick Start
            </h2>
            <ol className="space-y-2.5 text-slate-300">
              <li className="flex gap-2">
                <span className="flex-shrink-0 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">1</span>
                <div>
                  <p className="text-xs font-medium text-slate-200">Click Boby icon</p>
                  <p className="text-xs text-slate-400">Bottom-right corner</p>
                </div>
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">2</span>
                <div>
                  <p className="text-xs font-medium text-slate-200">Complete onboarding</p>
                  <p className="text-xs text-slate-400">Use demo repo</p>
                </div>
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">3</span>
                <div>
                  <p className="text-xs font-medium text-slate-200">Explore features</p>
                  <p className="text-xs text-slate-400">Try all tools below</p>
                </div>
              </li>
            </ol>
          </div>

          {/* Features */}
          <div className="space-y-3 mb-4">
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-6 h-6 bg-blue-600/20 rounded flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <h3 className="text-xs font-semibold text-slate-100">Architecture Diagram</h3>
              </div>
              <p className="text-slate-400 text-xs">
                Visualize codebase structure with interactive dependency graph
              </p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-6 h-6 bg-green-600/20 rounded flex items-center justify-center">
                  <Shield className="w-3.5 h-3.5 text-green-400" />
                </div>
                <h3 className="text-xs font-semibold text-slate-100">Push Guardian</h3>
              </div>
              <p className="text-slate-400 text-xs">
                Analyze changes before pushing to catch issues
              </p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-6 h-6 bg-purple-600/20 rounded flex items-center justify-center">
                  <GitBranch className="w-3.5 h-3.5 text-purple-400" />
                </div>
                <h3 className="text-xs font-semibold text-slate-100">Smart Checklist</h3>
              </div>
              <p className="text-slate-400 text-xs">
                AI-generated testing checklists for your repo
              </p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-6 h-6 bg-orange-600/20 rounded flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5 text-orange-400" />
                </div>
                <h3 className="text-xs font-semibold text-slate-100">Impact Analyzer</h3>
              </div>
              <p className="text-slate-400 text-xs">
                Understand ripple effects of code changes
              </p>
            </div>
          </div>

          {/* Demo Info */}
          <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-3">
            <h3 className="text-xs font-semibold text-blue-200 mb-2">📝 About Demo</h3>
            <div className="space-y-1.5 text-xs text-blue-100">
              <p>
                <strong>Path:</strong> <code className="px-1 py-0.5 bg-slate-900 rounded text-xs">./demo-repo</code>
              </p>
              <p>
                <strong>Why?</strong> Cached results for instant responses
              </p>
              <p>
                <strong>Production:</strong> Real-time AI with IBM Watsonx
              </p>
            </div>
          </div>
        </div>
        
        {/* Main Content Area (Right Side) */}
        <div className="flex-1 h-screen overflow-hidden">
          {/* Empty space for future content or visualization */}
        </div>
      </div>
      <FloatingWidget />
    </BobyProvider>
  );
}

export default App;

// Made with Bob
