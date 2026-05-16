import FloatingWidget from './widget/FloatingWidget';
import { BobyProvider } from './context/BobyContext';
import { Bot, Zap, Shield, GitBranch } from 'lucide-react';

function App() {
  return (
    <BobyProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Demo Instructions Page */}
        <div className="container mx-auto px-6 py-12 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Bot className="w-12 h-12 text-blue-400" />
              <h1 className="text-4xl font-bold text-slate-100">Boby Assistant</h1>
            </div>
            <p className="text-slate-400 text-lg">
              AI-Powered Developer Assistant for Code Analysis
            </p>
            <div className="mt-4 inline-block px-4 py-2 bg-yellow-900/30 border border-yellow-700/50 rounded-lg">
              <p className="text-yellow-200 text-sm">
                🎯 <strong>Demo Version</strong> - Using built-in demo repository
              </p>
            </div>
          </div>

          {/* Quick Start */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-semibold text-slate-100 mb-4 flex items-center gap-2">
              <Zap className="w-6 h-6 text-blue-400" />
              Quick Start
            </h2>
            <ol className="space-y-4 text-slate-300">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">1</span>
                <div>
                  <p className="font-medium text-slate-200">Click the Boby icon</p>
                  <p className="text-sm text-slate-400">Look for the floating robot icon in the bottom-right corner (you can drag it anywhere!)</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">2</span>
                <div>
                  <p className="font-medium text-slate-200">Complete onboarding</p>
                  <p className="text-sm text-slate-400">Click "Let's go" to use the demo repository (<code className="px-2 py-1 bg-slate-900 rounded text-blue-300">./demo-repo</code>)</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">3</span>
                <div>
                  <p className="font-medium text-slate-200">Explore features</p>
                  <p className="text-sm text-slate-400">Try Architecture, Checklist, Impact Analysis, and more!</p>
                </div>
              </li>
            </ol>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                  <Bot className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-100">Architecture Diagram</h3>
              </div>
              <p className="text-slate-400 text-sm">
                Visualize your codebase structure with an interactive dependency graph powered by AI
              </p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-100">Push Guardian</h3>
              </div>
              <p className="text-slate-400 text-sm">
                Analyze your changes before pushing to catch potential issues and missing items
              </p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
                  <GitBranch className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-100">Smart Checklist</h3>
              </div>
              <p className="text-slate-400 text-sm">
                Get AI-generated testing checklists tailored to your repository context
              </p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-orange-600/20 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-orange-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-100">Impact Analyzer</h3>
              </div>
              <p className="text-slate-400 text-sm">
                Understand the ripple effects of your code changes across the entire project
              </p>
            </div>
          </div>

          {/* Demo Info */}
          <div className="bg-blue-900/20 border border-blue-700/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-200 mb-3">📝 About This Demo</h3>
            <div className="space-y-2 text-sm text-blue-100">
              <p>
                <strong>Repository Path:</strong> This demo uses a pre-configured repository at <code className="px-2 py-1 bg-slate-900 rounded">./demo-repo</code>
              </p>
              <p>
                <strong>Why?</strong> For the hackathon demo, we use cached results to provide instant responses without calling IBM Watsonx AI on every request.
              </p>
              <p>
                <strong>Production:</strong> The full version supports any local repository path and makes real-time AI analysis calls to IBM Watsonx.
              </p>
            </div>
          </div>
        </div>
      </div>
      <FloatingWidget />
    </BobyProvider>
  );
}

export default App;

// Made with Bob
