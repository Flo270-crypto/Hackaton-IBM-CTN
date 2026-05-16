import { useState, useEffect } from 'react';
import { GitCommit, User, Calendar, FileText, Loader2, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

export default function HistoryTracker() {
  const [commits, setCommits] = useState([]);
  const [mostModifiedFiles, setMostModifiedFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);

    try {
      // Use demo-repo for consistent testing
      const repoPath = './demo-repo';
      const data = await api.history(repoPath);
      setCommits(data.commits || []);
      setMostModifiedFiles(data.most_modified_files || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) {
      return 'Just now';
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
        <p className="text-gray-400">Loading Git history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-red-400 text-center mb-4">{error}</p>
        <button
          onClick={fetchHistory}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg 
                     transition-colors duration-200"
        >
          Retry
        </button>
      </div>
    );
  }

  if (commits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <GitCommit className="w-12 h-12 text-gray-600 mb-4" />
        <p className="text-gray-400 text-center">No Git history found</p>
        <p className="text-gray-500 text-sm text-center mt-2">
          Make sure this is a Git repository
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* High-frequency files section */}
      {mostModifiedFiles.some(f => f.high_frequency) && (
        <div className="mb-4 p-3 bg-orange-900/20 border border-orange-700 rounded-lg">
          <h3 className="text-orange-400 font-semibold text-sm mb-2 flex items-center gap-2">
            🔥 High-Frequency Files
          </h3>
          <div className="space-y-1">
            {mostModifiedFiles
              .filter(f => f.high_frequency)
              .slice(0, 3)
              .map((file, index) => (
                <div key={index} className="flex items-center justify-between text-xs">
                  <span className="text-gray-300 truncate flex-1" title={file.file}>
                    {file.file}
                  </span>
                  <span className="text-orange-400 ml-2 flex-shrink-0">
                    {file.modification_count} changes
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="flex-1 overflow-auto">
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-purple-700"></div>

          {/* Commits */}
          <div className="space-y-6 pb-4">
            {commits.map((commit, index) => (
              <div key={commit.hash} className="relative pl-12">
                {/* Dot on timeline */}
                <div className="absolute left-2.5 top-2 w-3 h-3 rounded-full bg-purple-500 
                                border-2 border-gray-900 z-10"></div>

                {/* Commit card */}
                <div className="bg-gray-800 rounded-lg p-3 border border-gray-700 
                                hover:border-purple-700 transition-colors">
                  {/* Commit header */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <GitCommit className="w-4 h-4 text-purple-400 flex-shrink-0" />
                      <span className="text-purple-400 font-mono text-xs">
                        {commit.hash}
                      </span>
                    </div>
                    <span className="text-gray-500 text-xs flex-shrink-0 ml-2">
                      {formatDate(commit.date)}
                    </span>
                  </div>

                  {/* Commit message */}
                  <p className="text-white text-sm mb-2 leading-relaxed">
                    {commit.message}
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-2 mb-2 text-xs text-gray-400">
                    <User className="w-3 h-3" />
                    <span>{commit.author}</span>
                  </div>

                  {/* Files changed */}
                  {commit.files_changed && commit.files_changed.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-700">
                      <div className="flex items-center gap-2 mb-1 text-xs text-gray-500">
                        <FileText className="w-3 h-3" />
                        <span>{commit.files_changed.length} file{commit.files_changed.length !== 1 ? 's' : ''} changed</span>
                      </div>
                      <div className="space-y-1 max-h-20 overflow-auto">
                        {commit.files_changed.map((file, fileIndex) => {
                          const isHighFrequency = mostModifiedFiles.find(
                            f => f.file === file && f.high_frequency
                          );
                          return (
                            <div
                              key={fileIndex}
                              className={`text-xs px-2 py-1 rounded truncate ${isHighFrequency
                                ? 'bg-orange-900/30 text-orange-300'
                                : 'bg-gray-900 text-gray-400'
                                }`}
                              title={file}
                            >
                              {isHighFrequency && '🔥 '}
                              {file}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer info */}
      <div className="mt-4 pt-3 border-t border-gray-700 text-xs text-gray-500 text-center">
        Showing last {commits.length} commit{commits.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}

// Made with Bob
