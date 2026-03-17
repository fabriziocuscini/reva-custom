import { SwatchDetailDialog } from '@/components/swatch-detail-dialog'
import { MAIN_STEPS } from '@/lib/constants'
import type { PaletteStep } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Minus, Plus } from 'lucide-react'
import { useState } from 'react'

const EMPTY_SET = new Set<number>()

interface PaletteStripProps {
  palette: PaletteStep[]
  paletteName?: string
  showLabels?: boolean
  labelsOnly?: boolean
  roundedTop?: boolean
  rounded?: boolean
  compact?: boolean
  compareSteps?: Set<number>
  onCompareToggle?: (step: number) => void
}

export function PaletteStrip({
  palette,
  paletteName = '',
  showLabels = true,
  labelsOnly = false,
  roundedTop = true,
  rounded = true,
  compact = false,
  compareSteps = EMPTY_SET,
  onCompareToggle,
}: PaletteStripProps) {
  const [selectedStep, setSelectedStep] = useState<PaletteStep | null>(null)

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

  const rounding = !rounded ? '' : roundedTop ? 'rounded-lg' : 'rounded-b-lg'
  const swatchHeight = compact ? 'h-8' : 'h-10 md:h-12 lg:h-16'

  return (
    <div>
      <div className={`flex overflow-hidden ${rounding}`}>
        {palette.map((item) => (
          <button
            key={item.step}
            type="button"
            onClick={() => setSelectedStep(item)}
            className={`group/swatch flex-1 ${swatchHeight} relative cursor-pointer border-0 p-0`}
            style={{ backgroundColor: item.hex }}
            title={`${item.hex} — click for details`}
          >
            {/* Hover compare button — top-right corner */}
            {onCompareToggle && (
              <div
                className={cn(
                  'absolute top-0.5 right-0.5 flex items-center justify-center rounded size-6',
                  'transition-opacity bg-black/10 text-white/60 hover:bg-black/20 hover:text-white/90',
                  compareSteps.has(item.step)
                    ? 'opacity-100'
                    : 'opacity-0 group-hover/swatch:opacity-100',
                )}
                role="button"
                tabIndex={-1}
                title={compareSteps.has(item.step) ? 'Remove from compare' : 'Add to compare'}
                onClick={(e) => {
                  e.stopPropagation()
                  onCompareToggle(item.step)
                }}
                onPointerDown={(e) => e.stopPropagation()}
              >
                {compareSteps.has(item.step) ? (
                  <Minus className="size-4" strokeWidth={2} />
                ) : (
                  <Plus className="size-4" strokeWidth={2} />
                )}
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

      <SwatchDetailDialog
        step={selectedStep}
        paletteName={paletteName}
        open={selectedStep !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedStep(null)
        }}
      />
    </div>
  )
}
