import { useState } from 'react';
import { Shield, AlertTriangle, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { api } from '../services/api';

export default function PushGuardian() {
    const [loading, setLoading] = useState(false);
    const [report, setReport] = useState(null);
    const [error, setError] = useState(null);

    const analyzePush = async () => {
        setLoading(true);
        setError(null);
        try {
            const repoPath = './demo-repo';
            const data = await api.pushGuardian(repoPath);
            setReport(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 overflow-y-auto h-full bg-slate-900">
            <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-slate-400" />
                <h2 className="text-lg font-medium text-slate-200">Push Guardian</h2>
            </div>

            <button
                onClick={analyzePush}
                disabled={loading}
                className="w-full bg-slate-700 hover:bg-slate-600 disabled:opacity-50 
                         text-slate-200 font-medium py-2.5 rounded transition-all 
                         flex items-center justify-center gap-2 mb-4"
            >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                <span className="text-sm">{loading ? 'Analyzing...' : 'Analyze Changes'}</span>
            </button>

            {error && (
                <div className="w-full p-3 mb-4 bg-red-900/20 border border-red-800 rounded 
                              flex gap-2 text-red-300">
                    <AlertCircle className="shrink-0 w-4 h-4 mt-0.5" />
                    <div className="text-sm">{error}</div>
                </div>
            )}

            {report && (
                <div className="w-full space-y-3">
                    <div className={`p-3 rounded border ${
                        report.status === 'good' 
                            ? 'bg-green-900/20 border-green-800 text-green-300' 
                            : report.status === 'danger' 
                            ? 'bg-red-900/20 border-red-800 text-red-300' 
                            : 'bg-orange-900/20 border-orange-800 text-orange-300'
                    }`}>
                        <div className="flex items-center gap-2 mb-1">
                            {report.status === 'good' ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                            <h3 className="font-medium text-sm capitalize">{report.status}</h3>
                        </div>
                        <p className="text-xs opacity-90">Safe to push: {report.safe_to_push ? 'Yes' : 'No'}</p>
                    </div>

                    <div className="bg-slate-800 border border-slate-700 rounded p-3">
                        <h4 className="font-medium text-slate-300 mb-2 text-xs">Recommendation</h4>
                        <p className="text-slate-400 text-xs leading-relaxed">{report.recommendation}</p>
                    </div>

                    <div className="space-y-3">
                        <div className="bg-slate-800 border border-slate-700 rounded p-3">
                            <h4 className="font-medium text-slate-300 mb-2 flex items-center gap-2 text-xs">
                                <AlertCircle className="w-3.5 h-3.5" /> Risks
                            </h4>
                            {report.risks && report.risks.length > 0 ? (
                                <ul className="space-y-1 text-slate-400 text-xs">
                                    {report.risks.map((r, i) => <li key={i}>• {r}</li>)}
                                </ul>
                            ) : <span className="text-slate-500 text-xs">No risks detected</span>}
                        </div>

                        <div className="bg-slate-800 border border-slate-700 rounded p-3">
                            <h4 className="font-medium text-slate-300 mb-2 flex items-center gap-2 text-xs">
                                <AlertTriangle className="w-3.5 h-3.5" /> Missing Items
                            </h4>
                            {report.missing && report.missing.length > 0 ? (
                                <ul className="space-y-1 text-slate-400 text-xs">
                                    {report.missing.map((m, i) => <li key={i}>• {m}</li>)}
                                </ul>
                            ) : <span className="text-slate-500 text-xs">All items present</span>}
                        </div>
                    </div>

                    {(report.changed_files?.staged?.length > 0 || report.changed_files?.unstaged?.length > 0) && (
                        <div className="bg-slate-800 border border-slate-700 rounded p-3">
                            <h4 className="font-medium text-slate-300 mb-2 text-xs">Changed Files</h4>
                            <div className="space-y-1 text-xs text-slate-400">
                                {report.changed_files.staged?.map((f, i) => (
                                    <div key={'s' + i} className="truncate">✓ {f}</div>
                                ))}
                                {report.changed_files.unstaged?.map((f, i) => (
                                    <div key={'u' + i} className="truncate text-slate-500">○ {f}</div>
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
