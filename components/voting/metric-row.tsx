'use client'

import type { MetricValue } from '@/lib/voting-types'

interface MetricRowProps {
  label: string
  value: MetricValue | null
  onChange: (value: MetricValue) => void
}

export function MetricRow({ label, value, onChange }: MetricRowProps) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs shrink-0" style={{ color: '#737373', minWidth: '120px' }}>
        {label}
      </span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => {
          const isSelected = value === n
          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              className="w-7 h-7 rounded text-xs font-medium transition-all border"
              style={{
                backgroundColor: isSelected ? '#00095B' : 'white',
                borderColor: isSelected ? '#00095B' : '#D0D5DD',
                color: isSelected ? 'white' : '#374151',
              }}
            >
              {n}
            </button>
          )
        })}
        <button
          type="button"
          onClick={() => onChange('na')}
          className="px-2 h-7 rounded text-xs font-medium transition-all border"
          style={{
            backgroundColor: value === 'na' ? '#737373' : 'white',
            borderColor: value === 'na' ? '#737373' : '#D0D5DD',
            color: value === 'na' ? 'white' : '#737373',
          }}
        >
          N/A
        </button>
      </div>
    </div>
  )
}
