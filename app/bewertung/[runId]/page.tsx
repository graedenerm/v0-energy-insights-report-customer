import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import type { VotingRunData, VotingInsight, VotingMeasure } from '@/lib/voting-types'
import { VotingPageClient } from './voting-page-client'

interface PageProps {
  params: Promise<{ runId: string }>
}

export default async function BewertungPage({ params }: PageProps) {
  const { runId } = await params
  const supabase = createClient()

  // Fetch the run with company info
  const { data: run, error: runError } = await supabase
    .from('pipeline_runs')
    .select('id, version, run_date, companies(name)')
    .eq('id', runId)
    .single()

  if (runError || !run) notFound()

  // Fetch insights
  const { data: insights } = await supabase
    .from('insights')
    .select('id, original_id, type, priority_score, savings_kwh_per_year, savings_eur_per_year, confidence, title, description, raw_json, locations(title, street_name, street_number)')
    .eq('run_id', runId)
    .order('priority_score', { ascending: false })

  const insightRows = insights ?? []
  const insightIds = insightRows.map((i) => i.id)

  // Fetch measures
  const { data: measures } = await supabase
    .from('measures')
    .select('id, insight_id, title, short_description, description, yearly_savings_eur_from, yearly_savings_eur_to, yearly_savings_kwh_from, yearly_savings_kwh_to, investment_from, investment_to, amortisation_months, confidence, effort_level, category, raw_json')
    .eq('run_id', runId)

  const measureRows = measures ?? []
  const measureIds = measureRows.map((m) => m.id)

  // Fetch evaluations
  const insightEvals = insightIds.length > 0
    ? (await supabase.from('evaluations').select('id, item_type, insight_id, measure_id, evaluator_name, impression, comprehensibility, relevance, plausibility, notes, created_at').eq('item_type', 'insight').in('insight_id', insightIds)).data ?? []
    : []

  const measureEvals = measureIds.length > 0
    ? (await supabase.from('evaluations').select('id, item_type, insight_id, measure_id, evaluator_name, impression, comprehensibility, relevance, plausibility, notes, created_at').eq('item_type', 'measure').in('measure_id', measureIds)).data ?? []
    : []

  // Assemble
  const company = run.companies as unknown as { name: string } | null

  const votingInsights: VotingInsight[] = insightRows.map((insight) => {
    const insightMeasures: VotingMeasure[] = measureRows
      .filter((m) => m.insight_id === insight.id)
      .map((m) => ({
        ...m,
        evaluations: measureEvals
          .filter((e) => e.measure_id === m.id)
          .map((e) => ({ ...e, impression: e.impression as 'positive' | 'negative' | 'neutral' })),
      }))

    return {
      ...insight,
      location: (insight.locations as unknown as { title: string; street_name: string | null; street_number: string | null } | null),
      measures: insightMeasures,
      evaluations: insightEvals
        .filter((e) => e.insight_id === insight.id)
        .map((e) => ({ ...e, impression: e.impression as 'positive' | 'negative' | 'neutral' })),
    }
  })

  const runData: VotingRunData = {
    id: run.id,
    version: run.version,
    run_date: run.run_date,
    company_name: company?.name ?? 'Unbekanntes Unternehmen',
    insights: votingInsights,
  }

  return (
    <>
      {/* Sticky nav */}
      <nav
        className="sticky top-0 z-50 shadow-sm"
        style={{ backgroundColor: '#00095B', borderBottom: '1px solid rgba(26,47,238,0.1)' }}
      >
        <div className="mx-auto flex max-w-screen-xl items-center justify-between px-6 py-3 md:px-16">
          <div className="flex items-center gap-4">
            <img src="/images/ecoplanet-logo-white.png" alt="ecoplanet" className="h-5 w-auto" />
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>×</span>
            <img src="/images/n-ergie-logo.png" alt="N-ERGIE" className="h-5 w-auto" />
          </div>
          <div className="text-xs" style={{ color: '#AEAEAE' }}>
            Maßnahmen-Bewertung
          </div>
        </div>
      </nav>

      <VotingPageClient runData={runData} />

      <footer
        className="py-6 text-center text-xs"
        style={{ backgroundColor: '#00095B', color: 'rgba(255,255,255,0.4)' }}
      >
        <a href="https://ecoplanet.de" style={{ color: 'rgba(255,255,255,0.6)' }}>ecoplanet</a>
        {' '}— Energie-Intelligence für die Industrie
      </footer>
    </>
  )
}
