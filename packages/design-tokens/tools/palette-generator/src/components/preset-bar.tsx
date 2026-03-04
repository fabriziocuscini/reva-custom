import { PRESETS } from "@/lib/constants"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { ColorPickerInput } from "@/components/color-picker-input"

interface PresetBarProps {
  activePreset: string | null
  midpointHex: string
  onSelectPreset: (name: string) => void
  onCustomHex: (hex: string) => void
}

export function PresetBar({
  activePreset,
  midpointHex,
  onSelectPreset,
  onCustomHex,
}: PresetBarProps) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <ToggleGroup
        type="single"
        size="sm"
        spacing={1}
        value={activePreset ?? ""}
        onValueChange={(value) => {
          if (value) onSelectPreset(value)
        }}
      >
        {PRESETS.map((preset) => (
          <ToggleGroupItem key={preset.name} value={preset.name}>
            <span
              className="size-2.5 rounded-sm shrink-0"
              style={{ backgroundColor: preset.hex }}
            />
            {preset.name}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      <div className="ml-auto">
        <ColorPickerInput value={midpointHex} onChange={onCustomHex} />
      </div>
    </div>
  )
}
