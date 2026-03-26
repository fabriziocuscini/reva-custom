import { Button } from '@/components/ui/button'
import { copyToClipboard } from '@/lib/clipboard'
import { ALPHA_EXPORT_STEPS, ALPHA_SUFFIXES } from '@/lib/constants'
import type { PaletteStep } from '@/lib/types'
import { useMemo, useState } from 'react'

interface CopyBlockProps {
  palette: PaletteStep[]
  paletteName: string
}

function formatOklch(L: number, C: number, H: number, alpha?: number): string {
  const base = `oklch(${L.toFixed(4)} ${C.toFixed(4)} ${H.toFixed(2)}`
  if (alpha !== undefined) return `${base} / ${alpha})`
  return `${base})`
}

export function CopyBlock({ palette, paletteName }: CopyBlockProps) {
  const [copied, setCopied] = useState(false)

  const text = useMemo(() => {
    const indent = '      '

    const midpoint = palette.find((s) => s.isMidpoint)

    const steps = palette
      .map(
        (item) =>
          `${indent}"${item.step}": {\n${indent}  "$value": "${formatOklch(item.L, item.C, item.H)}"\n${indent}}`,
      )
      .join(',\n')

    let alphaBlock = ''
    if (midpoint) {
      const transparent = `${indent}  "transparent": {\n${indent}    "$value": "${formatOklch(midpoint.L, midpoint.C, midpoint.H, 0)}"\n${indent}  }`

      const alphas = ALPHA_EXPORT_STEPS.map((step) => {
        const hexByte = parseInt(ALPHA_SUFFIXES[step], 16)
        const alpha = Number((hexByte / 255).toFixed(3))
        return `${indent}  "a${step}": {\n${indent}    "$value": "${formatOklch(midpoint.L, midpoint.C, midpoint.H, alpha)}"\n${indent}  }`
      }).join(',\n')

      alphaBlock = `,\n${indent}"alpha": {\n${transparent},\n${alphas}\n${indent}}`
    }

    return `    "${paletteName}": {\n${steps}${alphaBlock}\n    }`
  }, [palette, paletteName])

  const handleCopy = () => {
    copyToClipboard(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="relative">
      <pre className="rounded-lg bg-neutral-800 text-neutral-200 p-3 text-[11px] font-mono leading-relaxed overflow-x-auto">
        {text}
      </pre>
      <Button
        variant="secondary"
        size="sm"
        onClick={handleCopy}
        className="absolute top-2 right-2 text-xs bg-neutral-800 text-neutral-200 hover:bg-neutral-700"
      >
        {copied ? 'Copied' : 'Copy'}
      </Button>
    </div>
  )
}
