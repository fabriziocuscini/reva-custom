import { converter, parse } from 'culori'

import { ALPHA_EXPORT_STEPS, ALPHA_SUFFIXES, TAILWIND_STEPS } from '@/lib/constants'
import type { PaletteStep } from '@/lib/types'

export type PaletteMode = 'regular' | 'extended'
export type ExportFormat = 'reva' | 'tailwind'
export type ColorSpace = 'hex' | 'oklch' | 'rgb' | 'hsl'

const toRgb = converter('rgb')
const TAILWIND_STEPS_SET = new Set<number>(TAILWIND_STEPS)

function formatOklch(
  L: number,
  C: number,
  H: number,
  alpha?: number,
  form: 'float' | 'percent' = 'float',
): string {
  const Lstr = form === 'percent' ? `${(L * 100).toFixed(2)}%` : L.toFixed(4)
  const base = `oklch(${Lstr} ${C.toFixed(4)} ${H.toFixed(2)}`
  if (alpha !== undefined) return `${base} / ${alpha})`
  return `${base})`
}

function formatColorValue(
  step: PaletteStep,
  space: ColorSpace,
  opts: { alpha?: number; oklchForm?: 'float' | 'percent' } = {},
): string {
  const { alpha, oklchForm = 'float' } = opts

  switch (space) {
    case 'hex': {
      if (alpha !== undefined) {
        const alphaHex = Math.round(alpha * 255)
          .toString(16)
          .padStart(2, '0')
          .toUpperCase()
        return `${step.hex}${alphaHex}`
      }
      return step.hex
    }
    case 'oklch':
      return formatOklch(step.L, step.C, step.H, alpha, oklchForm)
    case 'rgb': {
      const parsed = parse(step.hex)
      const rgb = toRgb(parsed!)
      const r = Math.round((rgb?.r ?? 0) * 255)
      const g = Math.round((rgb?.g ?? 0) * 255)
      const b = Math.round((rgb?.b ?? 0) * 255)
      if (alpha !== undefined) return `rgb(${r} ${g} ${b} / ${alpha})`
      return `rgb(${r} ${g} ${b})`
    }
    case 'hsl': {
      const h = isNaN(step.hsl.h) ? 0 : step.hsl.h
      const s = step.hsl.s
      const l = step.hsl.l
      if (alpha !== undefined)
        return `hsl(${h.toFixed(1)} ${s.toFixed(1)}% ${l.toFixed(1)}% / ${alpha})`
      return `hsl(${h.toFixed(1)} ${s.toFixed(1)}% ${l.toFixed(1)}%)`
    }
  }
}

// ─── Reva (DTCG JSON fragment) ────────────────────────────────────────────────

interface RevaTextOptions {
  palette: PaletteStep[]
  paletteName: string
  mode: PaletteMode
  includeAlpha: boolean
  colorSpace: ColorSpace
}

export function buildRevaText({
  palette,
  paletteName,
  mode,
  includeAlpha,
  colorSpace,
}: RevaTextOptions): string {
  const indent = '      '
  const filtered =
    mode === 'regular' ? palette.filter((s) => TAILWIND_STEPS_SET.has(s.step)) : palette
  const midpoint = palette.find((s) => s.isMidpoint)

  const steps = filtered
    .map(
      (item) =>
        `${indent}"${item.step}": {\n${indent}  "$value": "${formatColorValue(item, colorSpace)}"\n${indent}}`,
    )
    .join(',\n')

  let alphaBlock = ''
  if (includeAlpha && midpoint) {
    const transparent = `${indent}  "transparent": {\n${indent}    "$value": "${formatColorValue(midpoint, colorSpace, { alpha: 0 })}"\n${indent}  }`

    const alphas = ALPHA_EXPORT_STEPS.map((step) => {
      const hexByte = parseInt(ALPHA_SUFFIXES[step], 16)
      const alpha = Number((hexByte / 255).toFixed(3))
      return `${indent}  "a${step}": {\n${indent}    "$value": "${formatColorValue(midpoint, colorSpace, { alpha })}"\n${indent}  }`
    }).join(',\n')

    alphaBlock = `,\n${indent}"alpha": {\n${transparent},\n${alphas}\n${indent}}`
  }

  return `    "${paletteName}": {\n${steps}${alphaBlock}\n    }`
}

// ─── Tailwind v4 (CSS custom properties) ─────────────────────────────────────

interface TailwindTextOptions {
  palette: PaletteStep[]
  paletteName: string
  mode: PaletteMode
  colorSpace: ColorSpace
}

export function buildTailwindText({
  palette,
  paletteName,
  mode,
  colorSpace,
}: TailwindTextOptions): string {
  const filtered =
    mode === 'regular' ? palette.filter((s) => TAILWIND_STEPS_SET.has(s.step)) : palette

  return filtered
    .map(
      (step) =>
        `--color-${paletteName}-${step.step}: ${formatColorValue(step, colorSpace, { oklchForm: 'percent' })};`,
    )
    .join('\n')
}
