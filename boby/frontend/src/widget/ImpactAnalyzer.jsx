import { useState, useEffect } from 'react';
import { Search, AlertTriangle, Loader2, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

export default function ImpactAnalyzer() {
  const [filename, setFilename] = useState('');
  const [affectedModules, setAffectedModules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [graph, setGraph] = useState(null);

  // Fetch graph on mount for impact analysis
  useEffect(() => {
    fetchGraph();
  }, []);

  const fetchGraph = async () => {
    try {
      const workspacePath = import.meta.env.VITE_WORKSPACE_PATH || '';
      const data = await api.analyze(workspacePath);
      setGraph(data);
    } catch (err) {
      console.error('Failed to fetch graph:', err);
    }
  };

  const analyzeImpact = async (e) => {
    e.preventDefault();

    if (!filename.trim()) {
      setError('Please enter a filename');
      return;
    }

    if (!graph) {
      setError('Dependency graph not loaded. Please try again.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await api.impact(filename.trim(), graph);
      setAffectedModules(data.affected_modules || []);

      if (data.affected_modules.length === 0) {
        setError('No affected modules found. File may not exist in the dependency graph.');
      }
    } catch (err) {
      setError(err.message);
      setAffectedModules([]);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'HIGH': return 'bg-red-500';
      case 'MEDIUM': return 'bg-orange-500';
      case 'LOW': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'changed': return '🔴';
      case 'direct': return '🟠';
      case 'indirect': return '🟡';
      default: return '⚪';
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Search form */}
      <form onSubmit={analyzeImpact} className="mb-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="Enter filename (e.g., src/app.js)"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg 
                         text-white placeholder-gray-500 focus:outline-none focus:border-purple-500
                         transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !graph}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 
                       text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            <span>Analyze</span>
          </button>
        </div>
      </form>

      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      {/* Loading graph indicator */}
      {!graph && !error && (
        <div className="mb-4 p-3 bg-blue-900/30 border border-blue-700 rounded-lg flex items-start gap-2">
          <Loader2 className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5 animate-spin" />
          <p className="text-blue-300 text-sm">Loading dependency graph...</p>
        </div>
      )}

      {/* Results */}
      {affectedModules.length > 0 ? (
        <div className="flex-1 overflow-auto">
          <div className="mb-3 flex items-center gap-2 text-sm">
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
            <span className="text-gray-400">
              Found {affectedModules.length} affected module{affectedModules.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="space-y-3">
            {affectedModules.map((module, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-lg p-4 border border-gray-700 
                           hover:border-purple-700 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-lg">{getTypeIcon(module.type)}</span>
                    <h3 className="font-medium text-white text-sm truncate" title={module.file}>
                      {module.file}
                    </h3>
                  </div>
                  <span className={`${getRiskColor(module.risk)} text-white text-xs font-medium 
                                    px-2 py-1 rounded ml-2 flex-shrink-0`}>
                    {module.risk}
                  </span>
                </div>

                <div className="space-y-1 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-gray-500 flex-shrink-0">Type:</span>
                    <span className="text-gray-300 capitalize">{module.type}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-gray-500 flex-shrink-0">Reason:</span>
                    <span className="text-gray-300">{module.reason}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : !loading && !error && (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
          <Search className="w-12 h-12 text-gray-600 mb-4" />
          <p className="text-gray-400 mb-2">No analysis yet</p>
          <p className="text-gray-500 text-sm">
            Enter a filename to see which modules will be affected by changes
          </p>
        </div>
      )}

      {/* Legend */}
      {affectedModules.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <p className="text-xs text-gray-500 mb-2">Impact Types:</p>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="flex items-center gap-1">
              <span>🔴</span>
              <span className="text-gray-400">Changed</span>
            </div>
            <div className="flex items-center gap-1">
              <span>🟠</span>
              <span className="text-gray-400">Direct</span>
            </div>
            <div className="flex items-center gap-1">
              <span>🟡</span>
              <span className="text-gray-400">Indirect</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Made with Bob
