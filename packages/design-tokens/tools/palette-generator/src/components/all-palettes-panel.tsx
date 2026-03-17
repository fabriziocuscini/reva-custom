import { AlphaStrip } from '@/components/alpha-strip'
import { PaletteStrip } from '@/components/palette-strip'
import { generatePalette } from '@/lib/generate-palette'
import type { PaletteStep, Preset } from '@/lib/types'
import { useMemo } from 'react'

interface AllPalettesPanelProps {
  presets: Preset[]
  customPalette: PaletteStep[]
  customHex: string
  showAlpha: boolean
  displayMode: 'palette' | 'gradient'
}

interface PaletteRow {
  name: string
  displayName: string
  hex: string
  palette: PaletteStep[]
}

export function AllPalettesPanel({
  presets,
  customPalette,
  customHex,
  showAlpha,
  displayMode,
}: AllPalettesPanelProps) {
  const rows: PaletteRow[] = useMemo(() => {
    const presetRows = presets.map((p) => ({
      name: p.name,
      displayName: p.displayName,
      hex: p.hex,
      palette: generatePalette(p.hex, p.params),
    }))
    return [
      ...presetRows,
      {
        name: 'custom',
        displayName: 'Custom',
        hex: customHex,
        palette: customPalette,
      },
    ]
  }, [presets, customPalette, customHex])

  const firstPalette = rows[0]?.palette ?? []

  return (
    <div>
      {/* Step labels — rendered once at top */}
      <div className="flex pl-20 mb-3">
        <div className="flex-1">
          <PaletteStrip palette={firstPalette} labelsOnly />
        </div>
      </div>

      {/* Palette rows */}
      <div className="flex flex-col">
        {rows.map((row) => (
          <div key={row.name}>
            {showAlpha && (
              <div className="flex">
                <div className="w-20 shrink-0" />
                <div className="flex-1 min-w-0">
                  <AlphaStrip midpointHex={row.hex} rounded={false} hideLabels />
                </div>
              </div>
            )}
            <div className="flex">
              <div className="w-20 shrink-0 flex items-center pl-3">
                <span className="text-[11px] text-muted-foreground capitalize truncate">
                  {row.displayName}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                {displayMode === 'palette' ? (
                  <PaletteStrip
                    palette={row.palette}
                    showLabels={false}
                    roundedTop={false}
                    rounded={false}
                  />
                ) : (
                  <div
                    className="h-10 md:h-12 lg:h-16"
                    style={{
                      background: `linear-gradient(to right, ${row.palette.map((p) => p.hex).join(', ')})`,
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
