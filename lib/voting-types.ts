export type ImpressionValue = 'positive' | 'negative' | 'neutral'
export type MetricValue = number | 'na'

export interface VotingEvaluation {
  id: string
  item_type: 'insight' | 'measure'
  evaluator_name: string
  impression: ImpressionValue
  comprehensibility: number | null
  relevance: number | null
  plausibility: number | null
  notes: string | null
  created_at: string
}

export interface VotingMeasure {
  id: string
  title: string
  short_description: string | null
  description: string | null
  yearly_savings_eur_from: number | null
  yearly_savings_eur_to: number | null
  yearly_savings_kwh_from: number | null
  yearly_savings_kwh_to: number | null
  investment_from: number | null
  investment_to: number | null
  amortisation_months: number | null
  confidence: number | null
  effort_level: string | null
  category: string | null
  raw_json: Record<string, unknown>
  evaluations: VotingEvaluation[]
}

export interface VotingInsight {
  id: string
  original_id: string
  type: string
  priority_score: number | null
  savings_kwh_per_year: number | null
  savings_eur_per_year: number | null
  confidence: number | null
  title: string
  description: string | null
  raw_json: Record<string, unknown>
  location: {
    title: string
    street_name: string | null
    street_number: string | null
  } | null
  measures: VotingMeasure[]
  evaluations: VotingEvaluation[]
}

export interface VotingRunData {
  id: string
  version: string
  run_date: string
  company_name: string
  insights: VotingInsight[]
}

export interface LocalEvaluationState {
  impression: ImpressionValue | null
  comprehensibility: MetricValue | null
  relevance: MetricValue | null
  plausibility: MetricValue | null
  notes: string
  saved: boolean
  saving: boolean
}
