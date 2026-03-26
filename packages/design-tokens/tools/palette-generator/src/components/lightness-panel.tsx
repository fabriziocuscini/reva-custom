import { CurveChart } from '@/components/curve-chart'
import { ParamSlider } from '@/components/param-slider'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { LIGHTNESS_PARAMS_DARK, LIGHTNESS_PARAMS_LIGHT } from '@/lib/constants'
import type { PaletteParams, PaletteStep } from '@/lib/types'
import { RotateCcw } from 'lucide-react'

interface LightnessPanelProps {
  params: PaletteParams
  palette: PaletteStep[]
  midpointHex: string
  onUpdateParam: (key: keyof PaletteParams, value: number) => void
  onResetLight: () => void
  onResetDark: () => void
}

export function LightnessPanel({
  params,
  palette,
  midpointHex,
  onUpdateParam,
  onResetLight,
  onResetDark,
}: LightnessPanelProps) {
  return (
    <Card>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr_240px] md:items-center gap-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Light end
              </h3>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={onResetLight} className="size-6">
                    <RotateCcw className="size-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Reset light-end lightness</TooltipContent>
              </Tooltip>
            </div>
            {LIGHTNESS_PARAMS_LIGHT.map((config) => (
              <ParamSlider
                key={config.key}
                config={config}
                value={params[config.key]}
                onChange={(v) => onUpdateParam(config.key, v)}
              />
            ))}
          </div>
          <CurveChart palette={palette} dataKey="L" color={midpointHex} className="h-48 w-full" />
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Dark end
              </h3>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={onResetDark} className="size-6">
                    <RotateCcw className="size-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Reset dark-end lightness</TooltipContent>
              </Tooltip>
            </div>
            {LIGHTNESS_PARAMS_DARK.map((config) => (
              <ParamSlider
                key={config.key}
                config={config}
                value={params[config.key]}
                onChange={(v) => onUpdateParam(config.key, v)}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
