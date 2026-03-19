'use client'

import type { ImpressionValue } from '@/lib/voting-types'

interface ImpressionSelectorProps {
  value: ImpressionValue | null
  onChange: (value: ImpressionValue) => void
  disabled?: boolean
}

const OPTIONS: { value: ImpressionValue; label: string; emoji: string }[] = [
  { value: 'positive', label: 'Positiv', emoji: '👍' },
  { value: 'neutral', label: 'Neutral', emoji: '↔' },
  { value: 'negative', label: 'Negativ', emoji: '👎' },
]

export function ImpressionSelector({ value, onChange, disabled }: ImpressionSelectorProps) {
  return (
    <div className="flex gap-2">
      {OPTIONS.map((opt) => {
        const isSelected = value === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            disabled={disabled}
            onClick={() => onChange(opt.value)}
            className="flex-1 flex flex-col items-center gap-1 rounded-lg py-2 px-1 text-xs font-medium transition-all border"
            style={{
              backgroundColor: isSelected ? '#E2EC2B' : 'white',
              borderColor: isSelected ? '#E2EC2B' : '#D0D5DD',
              color: '#00095B',
              opacity: disabled ? 0.5 : 1,
              cursor: disabled ? 'not-allowed' : 'pointer',
            }}
          >
            <span className="text-base leading-none">{opt.emoji}</span>
            <span>{opt.label}</span>
          </button>
        )
      })}
    </div>
  )
}
