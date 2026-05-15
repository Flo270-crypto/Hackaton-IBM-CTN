const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = {
  /**
   * Analyze repository and get dependency graph
   * @param {string} repoPath - Path to repository
   * @returns {Promise<{nodes: Array, edges: Array}>}
   */
  analyze: async (repoPath) => {
    try {
      const response = await fetch(`${API_URL}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repo_path: repoPath })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to analyze repository: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Error (analyze):', error);
      throw error;
    }
  },

  /**
   * Analyze impact of file changes
   * @param {string} changedFile - Path to changed file
   * @param {Object} graph - Dependency graph {nodes, edges}
   * @returns {Promise<{affected_modules: Array}>}
   */
  impact: async (changedFile, graph) => {
    try {
      const response = await fetch(`${API_URL}/impact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ changed_file: changedFile, graph })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to analyze impact: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Error (impact):', error);
      throw error;
    }
  },

  /**
   * Generate testing checklist
   * @param {string} repoContext - Repository context description
   * @returns {Promise<{done: Array, todo: Array, suggestions: Array}>}
   */
  checklist: async (repoContext) => {
    try {
      const response = await fetch(`${API_URL}/checklist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repo_context: repoContext })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to generate checklist: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Error (checklist):', error);
      throw error;
    }
  },

  /**
   * Get Git history for repository
   * @param {string} repoPath - Path to repository
   * @returns {Promise<{commits: Array, most_modified_files: Array}>}
   */
  history: async (repoPath) => {
    try {
      const response = await fetch(`${API_URL}/history`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repo_path: repoPath })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch history: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Error (history):', error);
      throw error;
    }
  }
};

// Made with Bob
