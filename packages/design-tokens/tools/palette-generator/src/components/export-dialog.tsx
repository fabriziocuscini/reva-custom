import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { copyToClipboard } from '@/lib/clipboard'
import {
  type ColorSpace,
  type ExportFormat,
  type PaletteMode,
  buildRevaText,
  buildTailwindText,
} from '@/lib/export-formatters'
import type { PaletteStep } from '@/lib/types'
import { useEffect, useMemo, useState } from 'react'

interface ExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  palette: PaletteStep[]
  paletteName: string
}

export function ExportDialog({ open, onOpenChange, palette, paletteName }: ExportDialogProps) {
  const [exportName, setExportName] = useState(paletteName)
  const [mode, setMode] = useState<PaletteMode>('regular')
  const [includeAlpha, setIncludeAlpha] = useState(false)
  const [format, setFormat] = useState<ExportFormat>('reva')
  const [colorSpace, setColorSpace] = useState<ColorSpace>('oklch')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (open) {
      setExportName(paletteName)
      setMode('regular')
      setIncludeAlpha(false)
      setFormat('reva')
      setColorSpace('oklch')
      setCopied(false)
    }
  }, [open, paletteName])

  const alphaDisabled = format === 'tailwind'
  const effectiveAlpha = alphaDisabled ? false : includeAlpha

  const text = useMemo(() => {
    const name = exportName.trim() || paletteName
    if (format === 'reva') {
      return buildRevaText({ palette, paletteName: name, mode, includeAlpha: effectiveAlpha, colorSpace })
    }
    return buildTailwindText({ palette, paletteName: name, mode, colorSpace })
  }, [palette, paletteName, exportName, mode, effectiveAlpha, format, colorSpace])

  const handleCopy = () => {
    copyToClipboard(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Export palette</DialogTitle>
          <DialogDescription>Configure the output format and color space.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 py-2">
          {/* Palette name */}
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="export-name" className="text-xs text-muted-foreground shrink-0">
              Palette name
            </Label>
            <Input
              id="export-name"
              value={exportName}
              onChange={(e) => setExportName(e.target.value)}
              className="h-7 w-40 text-xs"
            />
          </div>

          {/* Palette */}
          <div className="flex items-center justify-between gap-4">
            <Label className="text-xs text-muted-foreground shrink-0">Palette</Label>
            <Tabs value={mode} onValueChange={(v) => setMode(v as PaletteMode)}>
              <TabsList>
                <TabsTrigger value="regular">Regular</TabsTrigger>
                <TabsTrigger value="extended">Extended</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Format */}
          <div className="flex items-center justify-between gap-4">
            <Label className="text-xs text-muted-foreground shrink-0">Format</Label>
            <Tabs value={format} onValueChange={(v) => setFormat(v as ExportFormat)}>
              <TabsList>
                <TabsTrigger value="reva">Reva</TabsTrigger>
                <TabsTrigger value="tailwind">Tailwind</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Alpha values */}
          <div className="flex items-center justify-between gap-4">
            <Label
              className={`text-xs shrink-0 ${alphaDisabled ? 'text-muted-foreground/40' : 'text-muted-foreground'}`}
            >
              Alpha values
            </Label>
            <Tabs
              value={effectiveAlpha ? 'include' : 'exclude'}
              onValueChange={(v) => setIncludeAlpha(v === 'include')}
            >
              <TabsList>
                <TabsTrigger value="include" disabled={alphaDisabled}>
                  Include
                </TabsTrigger>
                <TabsTrigger value="exclude" disabled={alphaDisabled}>
                  Exclude
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Color space */}
          <div className="flex items-center justify-between gap-4">
            <Label className="text-xs text-muted-foreground shrink-0">Color space</Label>
            <Tabs value={colorSpace} onValueChange={(v) => setColorSpace(v as ColorSpace)}>
              <TabsList>
                <TabsTrigger value="hex">Hex</TabsTrigger>
                <TabsTrigger value="oklch">OKLCH</TabsTrigger>
                <TabsTrigger value="rgb">RGB</TabsTrigger>
                <TabsTrigger value="hsl">HSL</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        <div className="relative">
          <pre className="rounded-lg bg-neutral-800 text-neutral-200 p-3 text-[11px] font-mono leading-relaxed overflow-auto h-80">
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

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
