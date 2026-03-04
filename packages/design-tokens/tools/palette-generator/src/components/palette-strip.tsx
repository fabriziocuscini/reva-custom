import { useState } from "react"
import { copyToClipboard } from "@/lib/clipboard"
import { MAIN_STEPS } from "@/lib/constants"
import type { PaletteStep } from "@/lib/types"

interface PaletteStripProps {
  palette: PaletteStep[]
  showLabels?: boolean
  labelsOnly?: boolean
}

export function PaletteStrip({ palette, showLabels = true, labelsOnly = false }: PaletteStripProps) {
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
                isMain ? "" : "hidden sm:inline "
              }${
                item.isMidpoint
                  ? "font-bold text-foreground"
                  : MAIN_STEPS.has(item.step)
                    ? "font-medium text-muted-foreground"
                    : "text-muted-foreground/40"
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
      <div className="flex rounded-lg overflow-hidden">
        {palette.map((item) => (
          <button
            key={item.step}
            type="button"
            onClick={() => {
              copyToClipboard(item.hex)
              setCopiedStep(item.step)
              setTimeout(() => setCopiedStep(null), 900)
            }}
            className="flex-1 h-10 md:h-12 lg:h-16 relative cursor-pointer border-0 p-0"
            style={{ backgroundColor: item.hex }}
            title={`Click to copy ${item.hex}`}
          >
            {copiedStep === item.step && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/55 text-white text-[9px] font-bold font-mono tracking-wider">
                Copied
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
                  ? "font-bold text-foreground"
                  : MAIN_STEPS.has(item.step)
                    ? "font-medium text-muted-foreground"
                    : "text-muted-foreground/40"
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
