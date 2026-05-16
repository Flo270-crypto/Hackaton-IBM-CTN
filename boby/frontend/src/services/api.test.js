import { describe, it, expect, beforeEach, vi } from 'vitest';
import { api } from './api';

// Mock fetch globally
global.fetch = vi.fn();

describe('API Service', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  describe('analyze', () => {
    it('should fetch repository analysis successfully', async () => {
      const mockData = {
        nodes: [{ id: '1', label: 'test.js' }],
        edges: [{ source: '1', target: '2' }]
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData
      });

      const result = await api.analyze('./test-repo');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/analyze'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ repo_path: './test-repo' })
        })
      );
      expect(result).toEqual(mockData);
    });

    it('should handle errors gracefully', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'Not Found',
        text: async () => 'Repository not found'
      });

      await expect(api.analyze('./invalid-repo')).rejects.toThrow();
    });
  });

  describe('impact', () => {
    it('should analyze impact successfully', async () => {
      const mockImpact = {
        affected_modules: ['module1', 'module2'],
        risk_level: 'medium'
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockImpact
      });

      const graph = { nodes: [], edges: [] };
      const result = await api.impact('test.js', graph);

      expect(result).toEqual(mockImpact);
    });
  });

  describe('predictBugs', () => {
    it('should predict bugs successfully', async () => {
      const mockPrediction = {
        files_analyzed: 5,
        results: [
          {
            file: 'test.js',
            analysis: {
              potential_bugs: [{ line: 10, severity: 'high', description: 'Null pointer' }]
            }
          }
        ]
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPrediction
      });

      const result = await api.predictBugs('./test-repo');

      expect(result.files_analyzed).toBe(5);
      expect(result.results).toHaveLength(1);
    });
  });

  describe('generateDocs', () => {
    it('should generate documentation successfully', async () => {
      const mockDocs = {
        readme: '# Test Project',
        architecture_doc: '## Architecture',
        api_docs: '## API',
        sequence_diagrams: []
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockDocs
      });

      const result = await api.generateDocs('./test-repo');

      expect(result.readme).toContain('# Test Project');
      expect(result.architecture_doc).toBeDefined();
    });
  });
});

// Made with Bob
