import { copyToClipboard } from '@/lib/clipboard'
import { MAIN_STEPS } from '@/lib/constants'
import type { PaletteStep } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Check, Columns2 } from 'lucide-react'
import { useState } from 'react'

const EMPTY_SET = new Set<number>()

interface PaletteStripProps {
  palette: PaletteStep[]
  showLabels?: boolean
  labelsOnly?: boolean
  roundedTop?: boolean
  compareSteps?: Set<number>
  onCompareToggle?: (step: number) => void
}

export function PaletteStrip({
  palette,
  showLabels = true,
  labelsOnly = false,
  roundedTop = true,
  compareSteps = EMPTY_SET,
  onCompareToggle,
}: PaletteStripProps) {
  const [copiedStep, setCopiedStep] = useState<number | null>(null)

  if (labelsOnly) {
    return (
      <div className="flex">
        {palette.map((item) => {
          const isMain = item.isMidpoint || MAIN_STEPS.has(item.step)
          return (
            <span
              key={item.step}
              className={`flex-1 text-center text-[9px] font-mono mt-1 ${
                isMain ? '' : 'hidden sm:inline '
              }${
                item.isMidpoint
                  ? 'font-bold text-foreground'
                  : MAIN_STEPS.has(item.step)
                    ? 'font-medium text-muted-foreground'
                    : 'text-muted-foreground/40'
              }`}
            >
              {item.step}
            </span>
          )
        })}
      </div>
    )
  }

  return (
    <div>
      <div className={`flex overflow-hidden ${roundedTop ? 'rounded-lg' : 'rounded-b-lg'}`}>
        {palette.map((item) => (
          <button
            key={item.step}
            type="button"
            onClick={() => {
              copyToClipboard(item.hex)
              setCopiedStep(item.step)
              setTimeout(() => setCopiedStep(null), 1000)
            }}
            className={cn(
              'group/swatch flex-1 h-10 md:h-12 lg:h-16 relative cursor-pointer border-0 p-0',
              compareSteps.has(item.step) && 'ring-2 ring-inset ring-foreground/50',
            )}
            style={{ backgroundColor: item.hex }}
            title={`Click to copy ${item.hex}`}
          >
            {/* Copy feedback — check icon with fade-in-out */}
            {copiedStep === item.step && (
              <div
                key={`copied-${item.step}-${Date.now()}`}
                className="absolute inset-0 flex items-center justify-center bg-black/50 text-white pointer-events-none"
                style={{ animation: 'fade-in-out 1s ease-in-out forwards' }}
              >
                <Check className="size-4" strokeWidth={3} />
              </div>
            )}

            {/* Hover compare button — top-right corner */}
            {onCompareToggle && copiedStep !== item.step && (
              <div
                className={cn(
                  'absolute top-0.5 right-0.5 flex items-center justify-center rounded size-6',
                  'opacity-0 group-hover/swatch:opacity-100 transition-opacity',
                  'text-white/70 hover:bg-black/40 hover:text-white',
                  compareSteps.has(item.step) && 'opacity-100 text-white',
                )}
                role="button"
                tabIndex={-1}
                title={compareSteps.has(item.step) ? 'Remove from compare' : 'Compare'}
                onClick={(e) => {
                  e.stopPropagation()
                  onCompareToggle(item.step)
                }}
                onPointerDown={(e) => e.stopPropagation()}
              >
                <Columns2 className="size-4" strokeWidth={2} />
              </div>
            )}
          </button>
        ))}
      </div>
      {showLabels && (
        <div className="flex">
          {palette.map((item) => (
            <span
              key={item.step}
              className={`flex-1 text-center text-[9px] font-mono mt-1 ${
                item.isMidpoint
                  ? 'font-bold text-foreground'
                  : MAIN_STEPS.has(item.step)
                    ? 'font-medium text-muted-foreground'
                    : 'text-muted-foreground/40'
              }`}
            >
              {item.step}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
