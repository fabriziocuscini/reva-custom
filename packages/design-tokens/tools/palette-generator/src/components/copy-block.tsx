import { useState } from "react"
import { Button } from "@/components/ui/button"
import { copyToClipboard } from "@/lib/clipboard"
import type { PaletteStep } from "@/lib/types"

interface CopyBlockProps {
  palette: PaletteStep[]
}

export function CopyBlock({ palette }: CopyBlockProps) {
  const [copied, setCopied] = useState(false)

  const text = palette
    .map((item) => `  ${item.step}: "${item.hex}"`)
    .join("\n")

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
        {copied ? "Copied" : "Copy"}
      </Button>
    </div>
  )
}
