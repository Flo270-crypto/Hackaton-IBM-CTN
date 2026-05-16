import { useState, useEffect, useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState
} from 'reactflow';
import 'reactflow/dist/style.css';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useBoby } from '../context/BobyContext';

const nodeColor = (risk) => {
  switch(risk) {
    case 'HIGH': return '#ef4444'; // red-500
    case 'MEDIUM': return '#f97316'; // orange-500
    case 'LOW': return '#22c55e'; // green-500
    default: return '#6b7280'; // gray-500
  }
};

export default function ArchitectureDiagram() {
  const { graph, loading, error, fetchGraph } = useBoby();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);

  // Auto-fetch on mount
  useEffect(() => {
    if (!graph) {
      fetchGraph();
    }
  }, []);

  // Update React Flow nodes and edges when graph changes
  useEffect(() => {
    if (graph && graph.nodes && graph.edges) {
      // Transform nodes for React Flow
      const flowNodes = graph.nodes.map((node, index) => ({
        id: node.id,
        data: { 
          label: node.label,
          risk: node.risk,
          fullPath: node.id
        },
        position: { 
          x: (index % 3) * 200 + 50, 
          y: Math.floor(index / 3) * 150 + 50 
        },
        style: {
          background: nodeColor(node.risk),
          color: 'white',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '8px',
          padding: '10px',
          fontSize: '12px',
          fontWeight: '500',
          width: 150
        }
      }));

      // Transform edges for React Flow
      const flowEdges = graph.edges.map((edge, index) => ({
        id: `e${index}`,
        source: edge.source,
        target: edge.target,
        animated: true,
        style: { stroke: '#a855f7', strokeWidth: 2 },
        type: 'smoothstep'
      }));

      setNodes(flowNodes);
      setEdges(flowEdges);
    }
  }, [graph]);

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  // Count connections for selected node
  const getNodeConnections = (nodeId) => {
    const incoming = edges.filter(e => e.target === nodeId).length;
    const outgoing = edges.filter(e => e.source === nodeId).length;
    return { incoming, outgoing };
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
        <p className="text-gray-400">Analyzing repository...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-red-400 text-center mb-4">{error}</p>
        <button
          onClick={fetchGraph}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg 
                     transition-colors duration-200"
        >
          Retry
        </button>
      </div>
    );
  }

  if (nodes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <AlertCircle className="w-12 h-12 text-yellow-500 mb-4" />
        <p className="text-gray-400 text-center">No dependencies found in this repository.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        fitView
        attributionPosition="bottom-left"
      >
        <Background color="#4b5563" gap={16} />
        <Controls className="bg-gray-800 border border-gray-700" />
        <MiniMap 
          nodeColor={(node) => nodeColor(node.data.risk)}
          className="bg-gray-800 border border-gray-700"
        />
      </ReactFlow>

      {/* Node tooltip */}
      {selectedNode && (
        <div className="absolute top-4 left-4 bg-gray-800 border border-purple-700 
                        rounded-lg p-4 shadow-xl max-w-xs z-10">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-white text-sm">{selectedNode.data.label}</h3>
            <span className={`px-2 py-1 rounded text-xs font-medium ml-2
              ${selectedNode.data.risk === 'HIGH' ? 'bg-red-500' : 
                selectedNode.data.risk === 'MEDIUM' ? 'bg-orange-500' : 'bg-green-500'} 
              text-white`}>
              {selectedNode.data.risk}
            </span>
          </div>
          <p className="text-gray-400 text-xs mb-3 break-all">{selectedNode.data.fullPath}</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-gray-900 rounded p-2">
              <p className="text-gray-500">Incoming</p>
              <p className="text-white font-semibold">{getNodeConnections(selectedNode.id).incoming}</p>
            </div>
            <div className="bg-gray-900 rounded p-2">
              <p className="text-gray-500">Outgoing</p>
              <p className="text-white font-semibold">{getNodeConnections(selectedNode.id).outgoing}</p>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-gray-800 border border-gray-700 
                      rounded-lg p-3 shadow-xl text-xs">
        <p className="text-gray-400 font-semibold mb-2">Risk Levels</p>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-gray-300">High Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className="text-gray-300">Medium Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-gray-300">Low Risk</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Made with Bob
