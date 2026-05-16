import { createContext, useContext, useState } from 'react';
import { api } from '../services/api';

const BobyContext = createContext();

export const useBoby = () => {
  const context = useContext(BobyContext);
  if (!context) {
    throw new Error('useBoby must be used within BobyProvider');
  }
  return context;
};

export const BobyProvider = ({ children }) => {
  const [graph, setGraph] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [repoPath, setRepoPath] = useState('');

  const fetchGraph = async (customPath) => {
    setLoading(true);
    setError(null);

    try {
      // Use saved path from localStorage or custom path
      const pathToUse = customPath || localStorage.getItem('boby_repo_path') || './demo-repo';
      const data = await api.analyze(pathToUse);
      setGraph(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    graph,
    loading,
    error,
    fetchGraph,
    setGraph,
    repoPath,
    setRepoPath
  };

  return (
    <BobyContext.Provider value={value}>
      {children}
    </BobyContext.Provider>
  );
};

// Made with Bob
