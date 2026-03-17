import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import type { Preset } from '@/lib/types'

export const VIEW_ALL_KEY = '__all__'
const COLLAPSED_KEY = '__collapsed__'

interface PresetBarProps {
  presets: Preset[]
  activePreset: string | null
  viewAll: boolean
  onSelectPreset: (name: string) => void
  onToggleViewAll: () => void
  onExitViewAll: () => void
}

export function PresetBar({
  presets,
  activePreset,
  viewAll,
  onSelectPreset,
  onToggleViewAll,
  onExitViewAll,
}: PresetBarProps) {
  return (
    <ToggleGroup
      type="single"
      size="sm"
      spacing={1}
      value={viewAll ? VIEW_ALL_KEY : (activePreset ?? '')}
      onValueChange={(value) => {
        if (!value) return
        if (value === VIEW_ALL_KEY) {
          onToggleViewAll()
        } else if (value === COLLAPSED_KEY) {
          onExitViewAll()
        } else {
          onSelectPreset(value)
        }
      }}
      className="flex-wrap"
    >
      <ToggleGroupItem value={VIEW_ALL_KEY}>All palettes</ToggleGroupItem>

      {viewAll ? (
        <ToggleGroupItem value={COLLAPSED_KEY} className="px-1">
          <div className="flex items-center -space-x-0.5">
            {presets.map((preset) => (
              <span
                key={preset.name}
                className="size-3 rounded-full shrink-0 ring-1 ring-background"
                style={{ backgroundColor: preset.hex }}
              />
            ))}
          </div>
        </ToggleGroupItem>
      ) : (
        presets.map((preset) => (
          <ToggleGroupItem key={preset.name} value={preset.name}>
            <span
              className="size-2.5 rounded-sm shrink-0"
              style={{ backgroundColor: preset.hex }}
            />
            {preset.displayName}
          </ToggleGroupItem>
        ))
      )}
    </ToggleGroup>
  )
}
