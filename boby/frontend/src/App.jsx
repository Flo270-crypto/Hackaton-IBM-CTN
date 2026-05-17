import FloatingWidget from './widget/FloatingWidget';
import { BobyProvider } from './context/BobyContext';
import { Bot, Zap, Shield, GitBranch } from 'lucide-react';

function App() {
  return (
    <BobyProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950/20 to-slate-900 flex">
        {/* Left Sidebar Panel */}
        <div className="w-80 h-screen overflow-y-auto border-r border-slate-700/50 bg-slate-900/30 backdrop-blur-xl px-5 py-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Bot className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Boby</h1>
                <p className="text-slate-400 text-xs">AI Developer Assistant</p>
              </div>
            </div>
            <div className="px-3 py-2 bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-600/30 rounded-xl backdrop-blur-sm">
              <p className="text-yellow-200 text-xs font-medium">
                🎯 <strong>Demo Mode</strong> - Built-in repository
              </p>
            </div>
          </div>

          {/* Quick Start */}
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-slate-700/50 rounded-2xl p-5 mb-5 backdrop-blur-sm shadow-lg">
            <h2 className="text-sm font-bold text-slate-100 mb-4 flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-blue-600/20 flex items-center justify-center">
                <Zap className="w-4 h-4 text-blue-400" />
              </div>
              Quick Start
            </h2>
            <ol className="space-y-3 text-slate-300">
              <li className="flex gap-3 group">
                <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md group-hover:scale-110 transition-transform">1</span>
                <div>
                  <p className="text-xs font-semibold text-slate-200">Click Boby icon</p>
                  <p className="text-xs text-slate-400">Bottom-right corner</p>
                </div>
              </li>
              <li className="flex gap-3 group">
                <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md group-hover:scale-110 transition-transform">2</span>
                <div>
                  <p className="text-xs font-semibold text-slate-200">Complete onboarding</p>
                  <p className="text-xs text-slate-400">Use demo repo</p>
                </div>
              </li>
              <li className="flex gap-3 group">
                <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md group-hover:scale-110 transition-transform">3</span>
                <div>
                  <p className="text-xs font-semibold text-slate-200">Explore features</p>
                  <p className="text-xs text-slate-400">Try all tools below</p>
                </div>
              </li>
            </ol>
          </div>

          {/* Features */}
          <div className="space-y-3 mb-5">
            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-blue-700/30 rounded-xl p-4 backdrop-blur-sm hover:border-blue-600/50 transition-all duration-300 group cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600/30 to-blue-700/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Bot className="w-4 h-4 text-blue-400" />
                </div>
                <h3 className="text-xs font-bold text-slate-100 group-hover:text-blue-300 transition-colors">Architecture Diagram</h3>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Visualize codebase structure with interactive dependency graph
              </p>
            </div>

            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-green-700/30 rounded-xl p-4 backdrop-blur-sm hover:border-green-600/50 transition-all duration-300 group cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-green-600/30 to-green-700/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Shield className="w-4 h-4 text-green-400" />
                </div>
                <h3 className="text-xs font-bold text-slate-100 group-hover:text-green-300 transition-colors">Push Guardian</h3>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Analyze changes before pushing to catch issues
              </p>
            </div>

            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-purple-700/30 rounded-xl p-4 backdrop-blur-sm hover:border-purple-600/50 transition-all duration-300 group cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600/30 to-purple-700/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <GitBranch className="w-4 h-4 text-purple-400" />
                </div>
                <h3 className="text-xs font-bold text-slate-100 group-hover:text-purple-300 transition-colors">Smart Checklist</h3>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                AI-generated testing checklists for your repo
              </p>
            </div>

            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-orange-700/30 rounded-xl p-4 backdrop-blur-sm hover:border-orange-600/50 transition-all duration-300 group cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-600/30 to-orange-700/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Zap className="w-4 h-4 text-orange-400" />
                </div>
                <h3 className="text-xs font-bold text-slate-100 group-hover:text-orange-300 transition-colors">Impact Analyzer</h3>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Understand ripple effects of code changes
              </p>
            </div>
          </div>

          {/* Demo Info */}
          <div className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 border border-blue-600/40 rounded-2xl p-4 backdrop-blur-sm shadow-lg">
            <h3 className="text-xs font-bold text-blue-200 mb-3 flex items-center gap-2">
              <span className="text-base">📝</span>
              About Demo
            </h3>
            <div className="space-y-2 text-xs text-blue-100">
              <div className="flex items-start gap-2">
                <span className="text-blue-400 font-semibold min-w-[60px]">Path:</span>
                <code className="px-2 py-1 bg-slate-900/60 border border-slate-700/50 rounded-lg text-xs font-mono flex-1">./demo-repo</code>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-400 font-semibold min-w-[60px]">Why?</span>
                <span className="flex-1">Cached results for instant responses</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-400 font-semibold min-w-[60px]">Production:</span>
                <span className="flex-1">Real-time AI with IBM Watsonx</span>
              </div>
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
