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

  const fetchGraph = async () => {
    setLoading(true);
    setError(null);

    try {
      // Use demo-repo for consistent testing
      const repoPath = './demo-repo';
      const data = await api.analyze(repoPath);
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
    setGraph
  };

  return (
    <BobyContext.Provider value={value}>
      {children}
    </BobyContext.Provider>
  );
};

// Made with Bob
