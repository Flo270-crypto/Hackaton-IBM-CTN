import { useState, useEffect, useCallback, useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';
import { AlertCircle, Loader2, ArrowRight, Zap, Clock } from 'lucide-react';
import { useBoby } from '../context/BobyContext';

const nodeColor = (risk) => {
  switch (risk) {
    case 'HIGH': return '#1e3a5f';
    case 'MEDIUM': return '#2d5a7b';
    case 'LOW': return '#3b82f6';
    default: return '#475569';
  }
};

const riskBorderColor = (risk) => {
  switch (risk) {
    case 'HIGH': return '#dc2626';
    case 'MEDIUM': return '#ea580c';
    case 'LOW': return '#16a34a';
    default: return '#64748b';
  }
};

// Déterminer le type de connexion basé sur les noms de fichiers
const getConnectionType = (source, target) => {
  const sourceName = source.toLowerCase();
  const targetName = target.toLowerCase();
  
  // API Gateway -> Services = Synchronous HTTP
  if (sourceName.includes('gateway') || sourceName.includes('api')) {
    return { type: 'sync', label: 'HTTP', color: '#60a5fa' };
  }
  
  // Auth/Session -> Others = Authentication Flow
  if (sourceName.includes('auth') || sourceName.includes('session')) {
    return { type: 'auth', label: 'Auth', color: '#a78bfa' };
  }
  
  // Payment -> Others = Transaction Flow
  if (sourceName.includes('payment') || sourceName.includes('stripe')) {
    return { type: 'transaction', label: 'Transaction', color: '#34d399' };
  }
  
  // Default: Data Flow
  return { type: 'data', label: 'Data', color: '#60a5fa' };
};

export default function ArchitectureDiagram() {
  const { graph, loading, error, fetchGraph } = useBoby();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);

  useEffect(() => {
    if (!graph) {
      fetchGraph();
    }
  }, []);

  useEffect(() => {
    if (graph && graph.nodes && graph.edges) {
      const flowNodes = graph.nodes.map((node, index) => {
        const row = Math.floor(index / 4);
        const col = index % 4;
        
        return {
          id: node.id,
          data: {
            label: node.label,
            risk: node.risk,
            fullPath: node.id
          },
          position: {
            x: col * 280 + 100,
            y: row * 200 + 100
          },
          style: {
            background: nodeColor(node.risk),
            color: '#e2e8f0',
            border: `2px solid ${riskBorderColor(node.risk)}`,
            borderRadius: '8px',
            padding: '14px 18px',
            fontSize: '13px',
            fontWeight: '500',
            width: 200,
            height: 70,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4)'
          }
        };
      });

      const flowEdges = graph.edges.map((edge, index) => {
        const connectionInfo = getConnectionType(edge.source, edge.target);
        
        return {
          id: `e${index}`,
          source: edge.source,
          target: edge.target,
          label: connectionInfo.label,
          animated: connectionInfo.type === 'sync',
          style: { 
            stroke: connectionInfo.color,
            strokeWidth: 2.5
          },
          labelStyle: {
            fill: connectionInfo.color,
            fontSize: 11,
            fontWeight: 600
          },
          labelBgStyle: {
            fill: '#1e293b',
            fillOpacity: 0.9
          },
          labelBgPadding: [4, 6],
          labelBgBorderRadius: 4,
          type: 'smoothstep',
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: connectionInfo.color,
            width: 20,
            height: 20
          },
          data: {
            connectionType: connectionInfo.type,
            description: getConnectionDescription(connectionInfo.type)
          }
        };
      });

      setNodes(flowNodes);
      setEdges(flowEdges);
    }
  }, [graph]);

  const getConnectionDescription = (type) => {
    const descriptions = {
      sync: 'Synchronous HTTP request/response',
      auth: 'Authentication & authorization flow',
      transaction: 'Payment transaction processing',
      data: 'Data flow between components'
    };
    return descriptions[type] || 'Component dependency';
  };

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
    setSelectedEdge(null);
  }, []);

  const onEdgeClick = useCallback((event, edge) => {
    setSelectedEdge(edge);
    setSelectedNode(null);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setSelectedEdge(null);
  }, []);

  const getNodeConnections = (nodeId) => {
    const incoming = edges.filter(e => e.target === nodeId);
    const outgoing = edges.filter(e => e.source === nodeId);
    return { incoming, outgoing };
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-slate-900">
        <Loader2 className="w-10 h-10 text-blue-400 animate-spin mb-3" />
        <p className="text-slate-400 text-sm">Analyzing repository...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 bg-slate-900">
        <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
        <p className="text-red-400 text-center mb-4 text-sm">{error}</p>
        <button
          onClick={fetchGraph}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded
                     transition-colors duration-200 text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  if (nodes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 bg-slate-900">
        <AlertCircle className="w-10 h-10 text-slate-500 mb-3" />
        <p className="text-slate-400 text-center text-sm">No dependencies found</p>
      </div>
    );
  }

  return (
    <div className="flex w-full h-full relative bg-slate-900">
      <div className="relative flex-1 h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          onPaneClick={onPaneClick}
          fitView
          attributionPosition="bottom-left"
          defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        >
          <Background 
            color="#475569"
            gap={16}
            size={1}
          />
          <Controls className="bg-slate-800 border border-slate-700 rounded" />
        </ReactFlow>

        {/* Node Info Panel */}
        {selectedNode && (
          <div className="absolute top-4 left-4 bg-slate-800 border border-blue-700
                        rounded-lg p-4 shadow-xl max-w-sm z-10">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-medium text-slate-200 text-sm">{selectedNode.data.label}</h3>
              <span className={`px-2 py-0.5 rounded text-xs font-medium ml-2
                ${selectedNode.data.risk === 'HIGH' ? 'bg-red-900/50 text-red-300 border border-red-700' :
                  selectedNode.data.risk === 'MEDIUM' ? 'bg-orange-900/50 text-orange-300 border border-orange-700' : 
                  'bg-green-900/50 text-green-300 border border-green-700'}`}>
                {selectedNode.data.risk}
              </span>
            </div>
            <p className="text-slate-400 text-xs mb-3 break-all font-mono">{selectedNode.data.fullPath}</p>
            
            <div className="space-y-2">
              <div className="bg-slate-900 rounded p-2 border border-slate-700">
                <p className="text-slate-500 text-xs mb-1">Incoming Dependencies</p>
                <p className="text-blue-400 font-medium text-sm">{getNodeConnections(selectedNode.id).incoming.length}</p>
                {getNodeConnections(selectedNode.id).incoming.length > 0 && (
                  <div className="mt-1 space-y-1">
                    {getNodeConnections(selectedNode.id).incoming.slice(0, 3).map((edge, i) => (
                      <div key={i} className="text-xs text-slate-400 truncate">
                        ← {edge.data?.connectionType || 'data'}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="bg-slate-900 rounded p-2 border border-slate-700">
                <p className="text-slate-500 text-xs mb-1">Outgoing Dependencies</p>
                <p className="text-blue-400 font-medium text-sm">{getNodeConnections(selectedNode.id).outgoing.length}</p>
                {getNodeConnections(selectedNode.id).outgoing.length > 0 && (
                  <div className="mt-1 space-y-1">
                    {getNodeConnections(selectedNode.id).outgoing.slice(0, 3).map((edge, i) => (
                      <div key={i} className="text-xs text-slate-400 truncate">
                        → {edge.data?.connectionType || 'data'}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Edge Info Panel */}
        {selectedEdge && (
          <div className="absolute top-4 left-4 bg-slate-800 border border-blue-700
                        rounded-lg p-4 shadow-xl max-w-sm z-10">
            <div className="flex items-center gap-2 mb-3">
              <ArrowRight className="w-5 h-5 text-blue-400" />
              <h3 className="font-medium text-slate-200 text-sm">Connection Details</h3>
            </div>
            
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-500">Type:</span>
                <span className="text-blue-400 font-medium capitalize">{selectedEdge.data?.connectionType}</span>
              </div>
              
              <div className="flex items-start gap-2">
                <span className="text-slate-500 flex-shrink-0">Flow:</span>
                <span className="text-slate-300">{selectedEdge.data?.description}</span>
              </div>
              
              <div className="pt-2 border-t border-slate-700">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-slate-500">From:</span>
                  <span className="text-slate-300 font-mono truncate">{selectedEdge.source.split('/').pop()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">To:</span>
                  <span className="text-slate-300 font-mono truncate">{selectedEdge.target.split('/').pop()}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Connection Legend */}
        <div className="absolute bottom-4 left-4 bg-slate-800 border border-slate-700
                      rounded-lg p-3 shadow-xl text-xs max-w-xs">
          <p className="text-slate-300 font-medium mb-2">Connection Types</p>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 bg-blue-400"></div>
              <span className="text-slate-400">HTTP (Synchronous)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 bg-purple-400"></div>
              <span className="text-slate-400">Authentication</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 bg-green-400"></div>
              <span className="text-slate-400">Transaction</span>
            </div>
          </div>
          <p className="text-slate-500 text-[10px] mt-2 italic">
            Click on connections to see details
          </p>
        </div>
      </div>

      {/* AI Analysis Sidebar */}
      {graph.ai_analysis && !graph.ai_analysis.error && (
        <div className="w-96 bg-slate-800 border-l border-slate-700 p-4 overflow-y-auto">
          <h3 className="text-sm font-medium text-slate-200 mb-4">Analysis Report</h3>

          {graph.ai_analysis.architecture_pattern && (
            <div className="mb-4 pb-4 border-b border-slate-700">
              <span className="text-xs text-slate-500 uppercase tracking-wide font-medium">Architecture Pattern</span>
              <p className="text-sm text-blue-300 mt-1">{graph.ai_analysis.architecture_pattern}</p>
            </div>
          )}

          {graph.ai_analysis.technologies && graph.ai_analysis.technologies.length > 0 && (
            <div className="mb-4 pb-4 border-b border-slate-700">
              <span className="text-xs text-slate-500 uppercase tracking-wide font-medium">Technologies</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {graph.ai_analysis.technologies.map((tech, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-900/50 text-blue-300 text-xs rounded border border-blue-700/50">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {graph.ai_analysis.global_implications && (
            <div className="mb-4 pb-4 border-b border-slate-700">
              <span className="text-xs text-slate-500 uppercase tracking-wide font-medium">Data Flow Overview</span>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">{graph.ai_analysis.global_implications}</p>
            </div>
          )}

          {graph.ai_analysis.critical_files && graph.ai_analysis.critical_files.length > 0 && (
            <div>
              <span className="text-xs text-slate-500 uppercase tracking-wide font-medium">Critical Components</span>
              <div className="space-y-2 mt-2">
                {graph.ai_analysis.critical_files.map((file, index) => (
                  <div key={index} className="bg-slate-900 rounded p-3 border border-slate-700">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs text-slate-300 font-medium truncate flex-1" title={file.file}>
                        {file.file.split('/').pop()}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ml-2
                        ${file.risk_score > 75 ? 'bg-red-900/50 text-red-300' : 
                          file.risk_score > 40 ? 'bg-orange-900/50 text-orange-300' : 
                          'bg-green-900/50 text-green-300'}`}>
                        {file.risk_score}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{file.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Made with Bob
