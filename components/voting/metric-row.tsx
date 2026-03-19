'use client'

import type { MetricValue } from '@/lib/voting-types'

interface MetricRowProps {
  label: string
  value: MetricValue | null
  onChange: (value: MetricValue) => void
}

export function MetricRow({ label, value, onChange }: MetricRowProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
      {/* Label — full width on mobile, fixed width on sm+ */}
      <span className="text-xs font-medium sm:w-36 shrink-0" style={{ color: '#374151' }}>
        {label}
      </span>
      {/* Buttons — always on one line, allow horizontal scroll if very small */}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => {
          const isSelected = value === n
          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              className="w-9 h-9 rounded-lg text-sm font-semibold transition-all border"
              style={{
                backgroundColor: isSelected ? '#00095B' : 'white',
                borderColor:     isSelected ? '#00095B' : '#D0D5DD',
                color:           isSelected ? 'white'   : '#374151',
                flexShrink: 0,
              }}
            >
              {n}
            </button>
          )
        })}
        <button
          type="button"
          onClick={() => onChange('na')}
          className="px-3 h-9 rounded-lg text-xs font-semibold transition-all border"
          style={{
            backgroundColor: value === 'na' ? '#737373' : 'white',
            borderColor:     value === 'na' ? '#737373' : '#D0D5DD',
            color:           value === 'na' ? 'white'   : '#737373',
            flexShrink: 0,
          }}
        >
          N/A
        </button>
      </div>
    </div>
  )
}
