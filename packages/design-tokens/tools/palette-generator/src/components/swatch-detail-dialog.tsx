import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { copyToClipboard } from '@/lib/clipboard'
import type { PaletteStep } from '@/lib/types'
import { Check } from 'lucide-react'
import { useCallback, useState } from 'react'

interface SwatchDetailDialogProps {
  step: PaletteStep | null
  paletteName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace('#', '')
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  }
}

function formatOklch(L: number, C: number, H: number): string {
  return `oklch(${(L * 100).toFixed(1)}% ${C.toFixed(4)} ${H.toFixed(1)})`
}

function formatHsl(h: number, s: number, l: number): string {
  return `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`
}

function formatRgba(r: number, g: number, b: number): string {
  return `rgb(${r}, ${g}, ${b})`
}

export function SwatchDetailDialog({
  step,
  paletteName,
  open,
  onOpenChange,
}: SwatchDetailDialogProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    if (!step) return
    copyToClipboard(step.hex)
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }, [step])

  if (!step) return null

  const rgb = hexToRgb(step.hex)
  const title = `${paletteName} ${step.step}`

  const rows = [
    { label: 'HEX', value: step.hex },
    { label: 'RGBA', value: formatRgba(rgb.r, rgb.g, rgb.b) },
    { label: 'OKLCH', value: formatOklch(step.L, step.C, step.H) },
    { label: 'HSL', value: formatHsl(step.hsl.h, step.hsl.s, step.hsl.l) },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="squircle gap-0 p-2 rounded-3xl">
        {/* Color preview — clickable to copy */}
        <button
          type="button"
          onClick={handleCopy}
          className="squircle relative h-36 w-full cursor-pointer border-0 p-0 rounded-2xl overflow-hidden"
          style={{ backgroundColor: step.hex }}
          title="Click to copy HEX"
        >
          {copied && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white">
              <Check className="size-5" strokeWidth={3} />
            </div>
          )}
        </button>

        {/* Details */}
        <div className="px-2 pt-4 pb-2 flex flex-col gap-3">
          <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>

          <div className="flex flex-col gap-2">
            {rows.map((row) => (
              <div key={row.label} className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">{row.label}</span>
                <span className="text-xs font-mono text-muted-foreground">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
