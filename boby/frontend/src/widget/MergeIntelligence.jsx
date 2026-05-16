import { useState } from 'react';
import { GitMerge, GitPullRequest, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import { useRepoPath } from '../hooks/useRepoPath';

export default function MergeIntelligence() {
    const [loading, setLoading] = useState(false);
    const [targetBranch, setTargetBranch] = useState('main');
    const [report, setReport] = useState(null);
    const [error, setError] = useState(null);
    const repoPath = useRepoPath();

    const analyzeMerge = async (e) => {
        e.preventDefault();
        if (!targetBranch || !repoPath) {
            setError('Missing repository path or target branch');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const data = await api.mergeIntelligence(repoPath, targetBranch);
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
                <GitMerge className="w-5 h-5 text-slate-400" />
                <h2 className="text-lg font-medium text-slate-200">Merge Intelligence</h2>
            </div>

            <form onSubmit={analyzeMerge} className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={targetBranch}
                    onChange={(e) => setTargetBranch(e.target.value)}
                    placeholder="Target branch (e.g. main)"
                    className="flex-1 bg-slate-800 border border-slate-700 rounded px-3 py-2 
                             text-slate-200 text-sm focus:outline-none focus:border-slate-600"
                    required
                />
                <button
                    type="submit"
                    disabled={loading || !targetBranch}
                    className="bg-slate-700 hover:bg-slate-600 disabled:opacity-50 
                             text-slate-200 font-medium px-4 py-2 rounded transition-all 
                             flex items-center gap-2"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <GitPullRequest className="w-4 h-4" />}
                    <span className="text-sm">Check</span>
                </button>
            </form>

            {error && (
                <div className="p-3 mb-4 bg-red-900/20 border border-red-800 rounded 
                              flex gap-2 text-red-300">
                    <AlertCircle className="shrink-0 w-4 h-4 mt-0.5" />
                    <div className="text-sm break-words">{error}</div>
                </div>
            )}

            {report && (
                <div className="space-y-3">
                    <div className={`p-3 rounded border ${
                        report.safe_to_merge
                            ? 'bg-green-900/20 border-green-800 text-green-300'
                            : 'bg-red-900/20 border-red-800 text-red-300'
                    }`}>
                        <div className="flex items-center gap-2 mb-1">
                            {report.safe_to_merge ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                            <h3 className="font-medium text-sm">
                                {report.safe_to_merge ? 'Safe to Merge' : 'Conflicts Detected'}
                            </h3>
                        </div>
                        <p className="text-xs opacity-90">Severity: <span className="uppercase font-medium">{report.severity}</span></p>
                    </div>

                    {(report.error && !report.conflicting_files) && (
                        <div className="bg-red-900/20 border border-red-800 rounded p-3 text-red-300 text-xs">
                            {report.error}
                        </div>
                    )}

                    {report.conflicting_files && report.conflicting_files.length > 0 ? (
                        <div className="bg-slate-800 border border-slate-700 rounded p-3">
                            <h4 className="font-medium text-slate-300 mb-2 text-xs">Conflicting Files</h4>
                            <div className="space-y-2">
                                {report.conflicts?.map((conflict, i) => (
                                    <div key={i} className="bg-slate-900 p-2 rounded border border-slate-700">
                                        <div className="text-xs text-slate-300 font-mono mb-1 truncate">{conflict.file}</div>
                                        <div className="text-xs text-slate-500 mb-1">Type: {conflict.type}</div>
                                        <p className="text-xs text-slate-400">{conflict.description}</p>
                                    </div>
                                ))}
                                {report.conflicting_files.filter(f => !report.conflicts?.find(c => c.file === f)).map(f => (
                                    <div key={f} className="text-xs text-slate-400 font-mono p-2 truncate">⚠️ {f}</div>
                                ))}
                            </div>
                        </div>
                    ) : report.resolution_steps ? (
                        <div className="bg-slate-800 border border-slate-700 rounded p-3 text-slate-400 text-xs">
                            {report.resolution_steps[0]}
                        </div>
                    ) : null}

                    {report.resolution_steps && report.resolution_steps.length > 0 && report.conflicting_files?.length > 0 && (
                        <div className="bg-slate-800 border border-slate-700 rounded p-3">
                            <h4 className="font-medium text-slate-300 mb-2 text-xs">Resolution Steps</h4>
                            <ol className="space-y-1 text-slate-400 text-xs">
                                {report.resolution_steps.map((step, i) => (
                                    <li key={i} className="leading-relaxed">{i + 1}. {step}</li>
                                ))}
                            </ol>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// Made with Bob
