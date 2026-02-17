import React, { useEffect, useMemo, useState } from 'react'
import { fetchRecommendations, type Recommendation } from '../lib/api'

type MethodKey = 'heuristic' | 'gnn' | 'milp' | 'qubo' | 'hybrid'

export default function ModelInsights({ sectionId, onClose }: { sectionId: string; onClose: () => void }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<Record<MethodKey, Recommendation[]>>({
    heuristic: [], gnn: [], milp: [], qubo: [], hybrid: []
  })

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const [heu, gnn, milp, qubo, hyb] = await Promise.all([
          fetchRecommendations({ section_id: sectionId, lookahead_minutes: 30, method: 'heuristic' }).catch(() => ({ recommendations: [] as Recommendation[] } as any)),
          fetchRecommendations({ section_id: sectionId, lookahead_minutes: 30, method: 'gnn' }).catch(() => ({ recommendations: [] as Recommendation[] } as any)),
          fetchRecommendations({ section_id: sectionId, lookahead_minutes: 30, method: 'milp' }).catch(() => ({ recommendations: [] as Recommendation[] } as any)),
          fetchRecommendations({ section_id: sectionId, lookahead_minutes: 30, method: 'qubo' }).catch(() => ({ recommendations: [] as Recommendation[] } as any)),
          fetchRecommendations({ section_id: sectionId, lookahead_minutes: 30, method: 'hybrid', hybrid_solver: 'both' }).catch(() => ({ recommendations: [] as Recommendation[] } as any)),
        ])
        if (cancelled) return
        setData({
          heuristic: (heu?.recommendations as Recommendation[])?.slice(0, 3) || [],
          gnn: (gnn?.recommendations as Recommendation[])?.slice(0, 3) || [],
          milp: (milp?.recommendations as Recommendation[])?.slice(0, 3) || [],
          qubo: (qubo?.recommendations as Recommendation[])?.slice(0, 3) || [],
          hybrid: (hyb?.recommendations as Recommendation[])?.slice(0, 3) || [],
        })
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Failed to load model insights')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [sectionId])

  const columns = useMemo(() => ([
    { key: 'heuristic', title: 'Heuristic' },
    { key: 'gnn', title: 'GNN' },
    { key: 'milp', title: 'MILP' },
    { key: 'qubo', title: 'QUBO' },
    { key: 'hybrid', title: 'Hybrid (Both)' },
  ] as Array<{ key: MethodKey; title: string }>), [])

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/30" onClick={onClose} />
      <div className="w-full sm:w-[800px] lg:w-[1000px] h-full bg-white shadow-2xl border-l border-gray-200 overflow-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2">
            <span className="text-xl">🧠</span>
            <h3 className="text-2xl font-bold text-gray-900">Model Insights</h3>
          </div>
          <button className="text-gray-600 hover:text-gray-900" onClick={onClose}>Close ✕</button>
        </div>
        <div className="p-6">
          {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
          {loading ? (
            <div className="text-sm text-gray-600">Loading comparisons…</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {columns.map(col => (
                <div key={col.key} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="text-sm font-semibold text-gray-700 mb-3">{col.title}</div>
                  <ol className="space-y-2">
                    {(data[col.key] || []).map((r, idx) => (
                      <li key={r.train_id + idx} className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="font-semibold text-gray-900">{idx + 1}. {r.train_id}</div>
                          {typeof r.priority_score === 'number' && (
                            <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">{r.priority_score.toFixed(2)}</span>
                          )}
                        </div>
                        <div className="text-xs text-gray-600 mt-1 truncate" title={r.reason}>{r.reason}</div>
                        <div className="text-xs text-gray-500 mt-1 italic">{r.action}</div>
                      </li>
                    ))}
                    {(data[col.key] || []).length === 0 && (
                      <li className="text-xs text-gray-500">No recommendations</li>
                    )}
                  </ol>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


