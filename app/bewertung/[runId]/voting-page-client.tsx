'use client'

import { useEffect, useRef, useState } from 'react'
import type {
  VotingRunData,
  ImpressionValue,
  MetricValue,
  LocalEvaluationState,
} from '@/lib/voting-types'
import { EvaluatorSetup } from '@/components/voting/evaluator-setup'
import { InsightVoteCard } from '@/components/voting/insight-vote-card'

const STORAGE_KEY = 'customer_evaluator_name'

function emptyState(): LocalEvaluationState {
  return {
    impression: null,
    comprehensibility: null,
    relevance: null,
    plausibility: null,
    notes: '',
    saved: false,
    saving: false,
  }
}

interface VotingPageClientProps {
  runData: VotingRunData
}

export function VotingPageClient({ runData }: VotingPageClientProps) {
  const [evaluatorName, setEvaluatorName] = useState<string | null>(null)
  const [evalStates, setEvalStates] = useState<Record<string, LocalEvaluationState>>({})
  const [nameLoaded, setNameLoaded] = useState(false)

  // Debounce timers for metric saves
  const metricTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

  // Load evaluator name + pre-existing evaluations from DB on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) setEvaluatorName(stored)
    setNameLoaded(true)

    // Pre-populate saved states from DB evaluations
    const initial: Record<string, LocalEvaluationState> = {}
    for (const insight of runData.insights) {
      // Find this evaluator's evaluation for this insight (if any)
      // We don't know the evaluator name yet, so we'll update after name is confirmed
      initial[insight.id] = emptyState()
      for (const measure of insight.measures) {
        initial[measure.id] = emptyState()
      }
    }
    setEvalStates(initial)
  }, [runData])

  // Once we know the name, pre-populate saved states from DB
  useEffect(() => {
    if (!evaluatorName) return
    const next: Record<string, LocalEvaluationState> = { ...evalStates }
    for (const insight of runData.insights) {
      const existing = insight.evaluations.find(
        (e) => e.evaluator_name.toLowerCase() === evaluatorName.toLowerCase()
      )
      if (existing) {
        next[insight.id] = {
          impression: existing.impression,
          comprehensibility: existing.comprehensibility ?? null,
          relevance: existing.relevance ?? null,
          plausibility: existing.plausibility ?? null,
          notes: existing.notes ?? '',
          saved: true,
          saving: false,
        }
      }
      for (const measure of insight.measures) {
        const mExisting = measure.evaluations.find(
          (e) => e.evaluator_name.toLowerCase() === evaluatorName.toLowerCase()
        )
        if (mExisting) {
          next[measure.id] = {
            impression: mExisting.impression,
            comprehensibility: mExisting.comprehensibility ?? null,
            relevance: mExisting.relevance ?? null,
            plausibility: mExisting.plausibility ?? null,
            notes: mExisting.notes ?? '',
            saved: true,
            saving: false,
          }
        }
      }
    }
    setEvalStates(next)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [evaluatorName])

  const handleNameConfirm = (name: string) => {
    setEvaluatorName(name)
    localStorage.setItem(STORAGE_KEY, name)
  }

  const submitEvaluation = async (
    itemType: 'insight' | 'measure',
    itemId: string,
    impression: ImpressionValue,
    state: LocalEvaluationState
  ) => {
    if (!evaluatorName) return

    setEvalStates((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], saving: true },
    }))

    try {
      await fetch('/api/evaluations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemType,
          itemId,
          evaluatorName,
          impression,
          comprehensibility: state.comprehensibility,
          relevance: state.relevance,
          plausibility: state.plausibility,
          notes: state.notes || null,
        }),
      })

      setEvalStates((prev) => ({
        ...prev,
        [itemId]: { ...prev[itemId], saving: false, saved: true },
      }))
    } catch {
      setEvalStates((prev) => ({
        ...prev,
        [itemId]: { ...prev[itemId], saving: false },
      }))
    }
  }

  const handleImpression = (
    itemType: 'insight' | 'measure',
    itemId: string,
    impression: ImpressionValue
  ) => {
    setEvalStates((prev) => {
      const next = {
        ...prev,
        [itemId]: { ...(prev[itemId] ?? emptyState()), impression, saved: false },
      }
      // Submit immediately
      submitEvaluation(itemType, itemId, impression, next[itemId])
      return next
    })
  }

  const handleMetric = (
    itemType: 'insight' | 'measure',
    itemId: string,
    key: 'comprehensibility' | 'relevance' | 'plausibility',
    value: MetricValue
  ) => {
    setEvalStates((prev) => {
      const next = {
        ...prev,
        [itemId]: { ...(prev[itemId] ?? emptyState()), [key]: value, saved: false },
      }

      // Debounce metric saves by 800ms
      clearTimeout(metricTimers.current[itemId])
      metricTimers.current[itemId] = setTimeout(() => {
        const current = next[itemId]
        if (current.impression) {
          submitEvaluation(itemType, itemId, current.impression, current)
        }
      }, 800)

      return next
    })
  }

  // Progress calculation
  const allMeasureIds = runData.insights.flatMap((i) => i.measures.map((m) => m.id))
  const allInsightIds = runData.insights.map((i) => i.id)
  const totalItems = allInsightIds.length + allMeasureIds.length
  const ratedItems = [...allInsightIds, ...allMeasureIds].filter(
    (id) => evalStates[id]?.impression !== null
  ).length
  const progress = totalItems > 0 ? Math.round((ratedItems / totalItems) * 100) : 0

  // Don't render until localStorage is checked
  if (!nameLoaded) return null

  if (!evaluatorName) {
    return <EvaluatorSetup onConfirm={handleNameConfirm} />
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F5F7' }}>
      {/* Header */}
      <div className="sticky top-0 z-10 shadow-sm" style={{ backgroundColor: '#00095B' }}>
        <div className="mx-auto max-w-3xl px-4 py-4 md:px-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-medium mb-0.5" style={{ color: '#E2EC2B' }}>
                {runData.company_name}
              </div>
              <h1 className="text-base font-bold text-white leading-tight">
                Maßnahmen-Bewertung
              </h1>
            </div>
            <div className="text-right shrink-0">
              <div className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
                {ratedItems} / {totalItems} bewertet
              </div>
              <div className="w-24 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${progress}%`, backgroundColor: '#E2EC2B' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-4 py-6 md:px-6 space-y-6">
        {/* Greeting */}
        <div
          className="rounded-xl px-5 py-4 text-sm"
          style={{ backgroundColor: '#EEF0FF', color: '#1A2FEE' }}
        >
          <strong>Hallo, {evaluatorName}!</strong> Bewerten Sie die folgenden Befunde und Maßnahmen mit{' '}
          👍 Positiv, ↔ Neutral oder 👎 Negativ. Optionale Detailbewertungen können nach der ersten Auswahl ausgeklappt werden.
          <button
            type="button"
            className="ml-3 text-xs underline"
            onClick={() => {
              localStorage.removeItem(STORAGE_KEY)
              setEvaluatorName(null)
            }}
          >
            (nicht {evaluatorName}?)
          </button>
        </div>

        {/* Insight + measure cards */}
        {runData.insights.map((insight) => (
          <InsightVoteCard
            key={insight.id}
            insight={insight}
            insightEvalState={evalStates[insight.id] ?? emptyState()}
            measureEvalStates={Object.fromEntries(
              insight.measures.map((m) => [m.id, evalStates[m.id] ?? emptyState()])
            )}
            onInsightImpression={(imp) => handleImpression('insight', insight.id, imp)}
            onInsightMetric={(key, val) => handleMetric('insight', insight.id, key, val)}
            onMeasureImpression={(mid, imp) => handleImpression('measure', mid, imp)}
            onMeasureMetric={(mid, key, val) => handleMetric('measure', mid, key, val)}
          />
        ))}

        {/* Completion message */}
        {ratedItems === totalItems && totalItems > 0 && (
          <div
            className="rounded-xl p-5 text-center"
            style={{ backgroundColor: '#F0FFF4', border: '1px solid #86EFAC' }}
          >
            <div className="text-2xl mb-2">🎉</div>
            <div className="text-sm font-semibold mb-1" style={{ color: '#15803D' }}>
              Vielen Dank für Ihre Bewertungen!
            </div>
            <div className="text-xs" style={{ color: '#166534' }}>
              Alle {totalItems} Einträge wurden bewertet. Ihre Rückmeldungen helfen uns, die Analysen zu verbessern.
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
