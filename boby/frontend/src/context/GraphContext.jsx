import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const GraphContext = createContext();

export const useGraph = () => {
  const context = useContext(GraphContext);
  if (!context) {
    throw new Error('useGraph must be used within GraphProvider');
  }
  return context;
};

export const GraphProvider = ({ children }) => {
  const [graph, setGraph] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchGraph = async () => {
    setLoading(true);
    setError(null);
    
    try {
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
    <GraphContext.Provider value={value}>
      {children}
    </GraphContext.Provider>
  );
};

// Made with Bob
