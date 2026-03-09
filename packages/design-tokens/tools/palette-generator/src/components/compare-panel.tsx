import { ColorPickerInput } from '@/components/color-picker-input'
import { Button } from '@/components/ui/button'
import { useDraggable } from '@/hooks/use-draggable'
import { copyToClipboard } from '@/lib/clipboard'
import { Check, Minus, X } from 'lucide-react'
import { useMemo, useState } from 'react'

export interface CompareEntry {
  step: number
  hex: string
  benchmarkHex: string
}

interface ComparePanelProps {
  entries: CompareEntry[]
  onBenchmarkChange: (step: number, hex: string) => void
  onRemoveStep: (step: number) => void
  onClose: () => void
}

export function ComparePanel({
  entries,
  onBenchmarkChange,
  onRemoveStep,
  onClose,
}: ComparePanelProps) {
  const initialPos = useMemo(
    () => ({
      x: Math.round((window.innerWidth - 288) / 2),
      y: 180,
    }),
    [],
  )

  const { panelRef, style: panelStyle, handleProps } = useDraggable(initialPos)

  const [copiedStep, setCopiedStep] = useState<number | null>(null)

  function handleCopyHex(step: number, hex: string) {
    copyToClipboard(hex)
    setCopiedStep(step)
    setTimeout(() => setCopiedStep(null), 900)
  }

  return (
    <div
      ref={panelRef}
      style={panelStyle}
      className="z-50 w-72 rounded-lg bg-card text-card-foreground ring-1 ring-foreground/10 shadow-lg"
    >
      {/* Header — drag handle */}
      <div {...handleProps} className="flex items-center justify-between px-3 py-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground select-none">
          Compare
        </span>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onClose}
          onPointerDown={(e) => e.stopPropagation()}
          className="shrink-0"
        >
          <X />
          <span className="sr-only">Close</span>
        </Button>
      </div>

      {/* Vertical stack of comparison rows */}
      <div className="flex flex-col gap-3 px-3 pb-3">
        {entries.map((entry) => (
          <div key={entry.step}>
            <div className="flex overflow-hidden rounded-md">
              <button
                type="button"
                className="flex-1 aspect-[4/3] cursor-pointer border-0 p-0 relative"
                style={{ backgroundColor: entry.hex }}
                onClick={() => handleCopyHex(entry.step, entry.hex)}
                title={`Copy ${entry.hex}`}
              >
                {copiedStep === entry.step && (
                  <div
                    className="absolute inset-0 flex items-center justify-center bg-black/50 text-white pointer-events-none"
                    style={{ animation: 'fade-in-out 0.9s ease-in-out forwards' }}
                  >
                    <Check className="size-3.5" strokeWidth={3} />
                  </div>
                )}
              </button>
              <div
                className="flex-1 aspect-[4/3]"
                style={{ backgroundColor: entry.benchmarkHex }}
              />
            </div>

            {/* Labels row: [remove, swatch, hex] ... [swatch, hex, picker] */}
            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => onRemoveStep(entry.step)}
                  title={`Remove step ${entry.step}`}
                >
                  <Minus className="size-2.5" />
                  <span className="sr-only">Remove</span>
                </Button>
                <div
                  className="size-3.5 rounded-sm border border-border"
                  style={{ backgroundColor: entry.hex }}
                />
                <span className="text-[10px] font-mono text-muted-foreground uppercase">
                  {entry.hex}
                </span>
              </div>
              <ColorPickerInput
                value={entry.benchmarkHex}
                onChange={(hex) => onBenchmarkChange(entry.step, hex)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
