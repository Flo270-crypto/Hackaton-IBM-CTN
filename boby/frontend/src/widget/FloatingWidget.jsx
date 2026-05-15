import { useState } from 'react';
import { X, Maximize2 } from 'lucide-react';
import ArchitectureDiagram from './ArchitectureDiagram';
import SmartChecklist from './SmartChecklist';
import ImpactAnalyzer from './ImpactAnalyzer';
import HistoryTracker from './HistoryTracker';

export default function FloatingWidget() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('architecture');

  const tabs = [
    { id: 'architecture', label: 'Architecture' },
    { id: 'checklist', label: 'Checklist' },
    { id: 'impact', label: 'Impact' },
    { id: 'history', label: 'History' }
  ];

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {!isExpanded ? (
        // Collapsed button - 60x60px circular with purple gradient
        <button
          onClick={() => setIsExpanded(true)}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 
                     shadow-2xl hover:scale-110 transition-all duration-300 
                     flex items-center justify-center group"
          aria-label="Open Boby Assistant"
        >
          <Maximize2 className="w-8 h-8 text-white group-hover:rotate-90 transition-transform duration-300" />
        </button>
      ) : (
        // Expanded panel - 420x580px
        <div className="w-[420px] h-[580px] bg-gray-900 border border-purple-700 
                        rounded-2xl shadow-2xl widget-transition 
                        flex flex-col overflow-hidden">
          {/* Header with tabs and close button */}
          <div className="flex items-center justify-between p-4 border-b border-purple-700 bg-gray-800">
            <div className="flex gap-2 flex-wrap">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
                    ${activeTab === tab.id 
                      ? 'bg-purple-600 text-white shadow-lg scale-105' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors ml-2"
              aria-label="Close Boby Assistant"
            >
              <X className="w-5 h-5 text-gray-400 hover:text-white" />
            </button>
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-auto p-4 tab-content">
            {activeTab === 'architecture' && <ArchitectureDiagram />}
            {activeTab === 'checklist' && <SmartChecklist />}
            {activeTab === 'impact' && <ImpactAnalyzer />}
            {activeTab === 'history' && <HistoryTracker />}
          </div>
        </div>
      )}
    </div>
  );
}

// Made with Bob
