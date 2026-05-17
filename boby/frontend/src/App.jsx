import FloatingWidget from './widget/FloatingWidget';
import { BobyProvider } from './context/BobyContext';
import { Bot, Zap, Shield, GitBranch } from 'lucide-react';

function App() {
  return (
    <BobyProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950/20 to-slate-900 flex">
        {/* Left Sidebar Panel - Compact, no scroll */}
        <div className="w-64 h-screen overflow-hidden border-r border-slate-700/50 bg-slate-900/30 backdrop-blur-xl px-4 py-4 flex flex-col">
          {/* Header */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Boby</h1>
                <p className="text-slate-400 text-[10px]">AI Assistant</p>
              </div>
            </div>
            <div className="px-2 py-1.5 bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-600/30 rounded-lg backdrop-blur-sm">
              <p className="text-yellow-200 text-[10px] font-medium">
                🎯 Demo Mode
              </p>
            </div>
          </div>

          {/* Repository URL Section - Demo mode (not editable) */}
          <div className="mb-4 bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-slate-700/50 rounded-lg p-3 backdrop-blur-sm">
            <h3 className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wide">Repository</h3>
            <input
              type="text"
              value="./demo-repo"
              disabled
              className="w-full px-2 py-1.5 bg-slate-900/60 border border-slate-700/50 rounded text-[10px]
                       text-slate-400 font-mono cursor-not-allowed"
              placeholder="Repository URL"
            />
            <p className="text-[9px] text-slate-500 mt-1.5">🔒 Demo mode - Fixed repository</p>
          </div>

          {/* Features - Compact */}
          <div className="space-y-2 flex-1">
            <div className="h-8 bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-blue-700/30 rounded-lg px-3 backdrop-blur-sm hover:border-blue-600/50 transition-all duration-200 group cursor-pointer flex items-center gap-2">
              <div className="w-5 h-5 bg-gradient-to-br from-blue-600/30 to-blue-700/30 rounded flex items-center justify-center group-hover:scale-110 transition-transform">
                <Bot className="w-3 h-3 text-blue-400" />
              </div>
              <h3 className="text-[11px] font-semibold text-slate-100 group-hover:text-blue-300 transition-colors">Architecture</h3>
            </div>

            <div className="h-8 bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-green-700/30 rounded-lg px-3 backdrop-blur-sm hover:border-green-600/50 transition-all duration-200 group cursor-pointer flex items-center gap-2">
              <div className="w-5 h-5 bg-gradient-to-br from-green-600/30 to-green-700/30 rounded flex items-center justify-center group-hover:scale-110 transition-transform">
                <Shield className="w-3 h-3 text-green-400" />
              </div>
              <h3 className="text-[11px] font-semibold text-slate-100 group-hover:text-green-300 transition-colors">Push Guardian</h3>
            </div>

            <div className="h-8 bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-purple-700/30 rounded-lg px-3 backdrop-blur-sm hover:border-purple-600/50 transition-all duration-200 group cursor-pointer flex items-center gap-2">
              <div className="w-5 h-5 bg-gradient-to-br from-purple-600/30 to-purple-700/30 rounded flex items-center justify-center group-hover:scale-110 transition-transform">
                <GitBranch className="w-3 h-3 text-purple-400" />
              </div>
              <h3 className="text-[11px] font-semibold text-slate-100 group-hover:text-purple-300 transition-colors">Smart Checklist</h3>
            </div>

            <div className="h-8 bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-orange-700/30 rounded-lg px-3 backdrop-blur-sm hover:border-orange-600/50 transition-all duration-200 group cursor-pointer flex items-center gap-2">
              <div className="w-5 h-5 bg-gradient-to-br from-orange-600/30 to-orange-700/30 rounded flex items-center justify-center group-hover:scale-110 transition-transform">
                <Zap className="w-3 h-3 text-orange-400" />
              </div>
              <h3 className="text-[11px] font-semibold text-slate-100 group-hover:text-orange-300 transition-colors">Impact Analyzer</h3>
            </div>
          </div>

          {/* Demo Info - Compact */}
          <div className="mt-auto bg-gradient-to-br from-blue-900/30 to-indigo-900/30 border border-blue-600/40 rounded-lg p-3 backdrop-blur-sm">
            <h3 className="text-[10px] font-bold text-blue-200 mb-2">📝 Demo Info</h3>
            <div className="space-y-1 text-[10px] text-blue-100">
              <div className="flex items-center gap-1">
                <span className="text-blue-400 font-semibold">Path:</span>
                <code className="px-1 py-0.5 bg-slate-900/60 rounded text-[9px] font-mono">./demo-repo</code>
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
