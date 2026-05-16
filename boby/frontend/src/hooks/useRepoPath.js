import { useState, useEffect } from 'react';

/**
 * Hook to get the saved repository path from localStorage
 * @returns {string} The saved repository path or empty string
 */
export const useRepoPath = () => {
  const [repoPath, setRepoPath] = useState('');

  useEffect(() => {
    const savedPath = localStorage.getItem('boby_repo_path');
    if (savedPath) {
      setRepoPath(savedPath);
    }
  }, []);

  return repoPath;
};

// Made with Bob
