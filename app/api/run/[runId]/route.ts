import { createClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ runId: string }> }
) {
  const { runId } = await params
  const supabase = createClient()

  // Fetch the run with company info
  const { data: run, error: runError } = await supabase
    .from('pipeline_runs')
    .select('id, version, run_date, companies(name)')
    .eq('id', runId)
    .single()

  if (runError || !run) {
    return NextResponse.json({ error: 'Run not found' }, { status: 404 })
  }

  // Fetch insights for this run with location info
  const { data: insights, error: insightsError } = await supabase
    .from('insights')
    .select(`
      id, original_id, type, priority_score,
      savings_kwh_per_year, savings_eur_per_year,
      confidence, title, description, raw_json,
      locations(title, street_name, street_number)
    `)
    .eq('run_id', runId)
    .order('priority_score', { ascending: false })

  if (insightsError) {
    return NextResponse.json({ error: 'Failed to fetch insights' }, { status: 500 })
  }

  const insightIds = (insights ?? []).map((i) => i.id)

  // Fetch measures for this run
  const { data: measures, error: measuresError } = await supabase
    .from('measures')
    .select(`
      id, insight_id,
      title, short_description, description,
      yearly_savings_eur_from, yearly_savings_eur_to,
      yearly_savings_kwh_from, yearly_savings_kwh_to,
      investment_from, investment_to,
      amortisation_months, confidence,
      effort_level, category, raw_json
    `)
    .eq('run_id', runId)

  if (measuresError) {
    return NextResponse.json({ error: 'Failed to fetch measures' }, { status: 500 })
  }

  // Fetch all evaluations for this run's insights
  const measureIds = (measures ?? []).map((m) => m.id)
  const allItemIds = [...insightIds, ...measureIds]

  const insightEvals = insightIds.length > 0
    ? await supabase
        .from('evaluations')
        .select('id, item_type, insight_id, measure_id, evaluator_name, impression, comprehensibility, relevance, plausibility, notes, created_at')
        .eq('item_type', 'insight')
        .in('insight_id', insightIds)
    : { data: [] }

  const measureEvals = measureIds.length > 0
    ? await supabase
        .from('evaluations')
        .select('id, item_type, insight_id, measure_id, evaluator_name, impression, comprehensibility, relevance, plausibility, notes, created_at')
        .eq('item_type', 'measure')
        .in('measure_id', measureIds)
    : { data: [] }

  const allEvals = [...(insightEvals.data ?? []), ...(measureEvals.data ?? [])]

  // Assemble the response: insights → measures → evaluations
  const insightsWithData = (insights ?? []).map((insight) => {
    const insightMeasures = (measures ?? [])
      .filter((m) => m.insight_id === insight.id)
      .map((measure) => ({
        ...measure,
        evaluations: allEvals.filter((e) => e.measure_id === measure.id),
      }))

    return {
      ...insight,
      location: (insight.locations as unknown as { title: string; street_name: string | null; street_number: string | null } | null) ?? null,
      measures: insightMeasures,
      evaluations: allEvals.filter((e) => e.insight_id === insight.id),
    }
  })

  const company = run.companies as unknown as { name: string } | null

  return NextResponse.json({
    id: run.id,
    version: run.version,
    run_date: run.run_date,
    company_name: company?.name ?? 'Unbekanntes Unternehmen',
    insights: insightsWithData,
  })
}
