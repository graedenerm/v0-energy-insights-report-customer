import { createClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const {
    itemType,
    itemId,
    evaluatorName,
    impression,
    comprehensibility,
    relevance,
    plausibility,
    notes,
  } = body

  if (!itemType || !itemId || !evaluatorName || !impression) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  if (!['insight', 'measure'].includes(itemType)) {
    return NextResponse.json({ error: 'Invalid itemType' }, { status: 400 })
  }

  if (!['positive', 'negative', 'neutral'].includes(impression)) {
    return NextResponse.json({ error: 'Invalid impression' }, { status: 400 })
  }

  const supabase = createClient()

  const toMetricValue = (v: unknown) => {
    if (v === 'na' || v === null || v === undefined) return null
    const n = Number(v)
    return isNaN(n) ? null : n
  }

  const insertData = {
    item_type: itemType as 'insight' | 'measure',
    insight_id: itemType === 'insight' ? itemId : null,
    measure_id: itemType === 'measure' ? itemId : null,
    evaluator_name: String(evaluatorName).trim(),
    impression: impression as 'positive' | 'negative' | 'neutral',
    comprehensibility: toMetricValue(comprehensibility),
    relevance: toMetricValue(relevance),
    plausibility: toMetricValue(plausibility),
    notes: notes ? String(notes).trim() : null,
  }

  const { data, error } = await supabase
    .from('evaluations')
    .insert(insertData)
    .select('id')
    .single()

  if (error) {
    console.error('Evaluation insert error:', error)
    return NextResponse.json({ error: 'Failed to save evaluation' }, { status: 500 })
  }

  return NextResponse.json({ success: true, evaluationId: data.id })
}
