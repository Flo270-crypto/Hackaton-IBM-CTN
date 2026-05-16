const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

console.log('🔧 Boby API URL:', API_URL);

export const api = {
  /**
   * Analyze repository and get dependency graph
   * @param {string} repoPath - Path to repository
   * @returns {Promise<{nodes: Array, edges: Array}>}
   */
  analyze: async (repoPath) => {
    const url = `${API_URL}/analyze`;
    const body = { repo_path: repoPath };

    console.log('📡 [analyze] Fetching:', url);
    console.log('📦 [analyze] Body:', body);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      console.log('✅ [analyze] Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ [analyze] Error response:', errorText);
        throw new Error(`Failed to analyze repository: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('📥 [analyze] Response data:', data);
      return data;
    } catch (error) {
      console.error('❌ [analyze] Error:', error);
      throw new Error(`Failed to fetch: ${error.message}`);
    }
  },

  /**
   * Analyze impact of file changes
   * @param {string} changedFile - Path to changed file
   * @param {Object} graph - Dependency graph {nodes, edges}
   * @returns {Promise<{affected_modules: Array}>}
   */
  impact: async (changedFile, graph) => {
    const url = `${API_URL}/impact`;
    const body = { changed_file: changedFile, graph };

    console.log('📡 [impact] Fetching:', url);
    console.log('📦 [impact] Body:', { changed_file: changedFile, graph_nodes: graph?.nodes?.length, graph_edges: graph?.edges?.length });

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      console.log('✅ [impact] Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ [impact] Error response:', errorText);
        throw new Error(`Failed to analyze impact: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('📥 [impact] Response data:', data);
      return data;
    } catch (error) {
      console.error('❌ [impact] Error:', error);
      throw new Error(`Failed to fetch: ${error.message}`);
    }
  },

  /**
   * Generate testing checklist
   * @param {string|Object} repoContext - Repository context description or object
   * @returns {Promise<{done: Array, todo: Array, suggestions: Array}>}
   */
  checklist: async (repoContext) => {
    const url = `${API_URL}/checklist`;
    const body = { repo_context: repoContext };

    console.log('📡 [checklist] Fetching:', url);
    console.log('📦 [checklist] Body:', body);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      console.log('✅ [checklist] Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ [checklist] Error response:', errorText);
        throw new Error(`Failed to generate checklist: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('📥 [checklist] Response data:', data);
      return data;
    } catch (error) {
      console.error('❌ [checklist] Error:', error);
      throw new Error(`Failed to fetch: ${error.message}`);
    }
  },

  /**
   * Get Git history for repository
   * @param {string} repoPath - Path to repository
   * @returns {Promise<{commits: Array, most_modified_files: Array}>}
   */
  history: async (repoPath) => {
    const url = `${API_URL}/history`;
    const body = { repo_path: repoPath };

    console.log('📡 [history] Fetching:', url);
    console.log('📦 [history] Body:', body);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      console.log('✅ [history] Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ [history] Error response:', errorText);
        throw new Error(`Failed to fetch history: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('📥 [history] Response data:', data);
      return data;
    } catch (error) {
      console.error('❌ [history] Error:', error);
      throw new Error(`Failed to fetch: ${error.message}`);
    }
  },

  /**
   * Run push guardian
   */
  pushGuardian: async (repoPath) => {
    const url = `${API_URL}/push-guardian`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ repo_path: repoPath })
    });
    if (!response.ok) throw new Error(`Failed to run push guardian: ${await response.text()}`);
    return await response.json();
  },

  /**
   * Run merge intelligence
   */
  mergeIntelligence: async (repoPath, targetBranch) => {
    const url = `${API_URL}/merge-intelligence`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ repo_path: repoPath, target_branch: targetBranch })
    });
    if (!response.ok) throw new Error(`Failed to analyze merge: ${await response.text()}`);
    return await response.json();
  }
};

// Made with Bob
