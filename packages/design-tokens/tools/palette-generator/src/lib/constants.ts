import type { PaletteParams, Preset, ParamConfig } from "./types"

export const STEPS = [
  50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750,
  800, 850, 900, 950,
] as const

export const MAIN_STEPS = new Set([100, 200, 300, 400, 500, 600, 700, 800, 900])

export const DEFAULT_PARAMS: PaletteParams = {
  L_max: 0.985,
  L_min: 0.15,
  L_ease: 1.0,
  C_taper_light: 8,
  C_taper_dark: 15,
  C_ease: 1.0,
  H_shift_light: 0,
  H_shift_dark: 0,
  H_ease: 1.0,
  dist_ease: 1.0,
}

export const PRESETS: Preset[] = [
  { name: "Gold", hex: "#E2A336", params: { ...DEFAULT_PARAMS } },
  { name: "Amber", hex: "#D78D3F", params: { ...DEFAULT_PARAMS } },
  { name: "Olive", hex: "#ADA065", params: { ...DEFAULT_PARAMS } },
  { name: "Mulberry", hex: "#BF4853", params: { ...DEFAULT_PARAMS } },
  { name: "Fern", hex: "#61AB54", params: { ...DEFAULT_PARAMS } },
  { name: "Copper", hex: "#D2763B", params: { ...DEFAULT_PARAMS } },
  { name: "Cobalt", hex: "#4286BD", params: { ...DEFAULT_PARAMS } },
]

export const LIGHTNESS_PARAMS: ParamConfig[] = [
  {
    key: "L_max",
    label: "L max",
    min: 0.93,
    max: 0.999,
    step: 0.001,
    default: 0.985,
    description: "How close to white the lightest step gets",
  },
  {
    key: "L_min",
    label: "L min",
    min: 0.05,
    max: 0.25,
    step: 0.005,
    default: 0.15,
    description: "How close to black the darkest step gets",
  },
  {
    key: "L_ease",
    label: "Easing factor",
    min: 0.5,
    max: 1.5,
    step: 0.1,
    default: 1.0,
    description: "< 1 = fast change near anchor, > 1 = holds anchor longer",
  },
]

export const CHROMA_PARAMS: ParamConfig[] = [
  {
    key: "C_taper_light",
    label: "Light-end taper",
    min: 2,
    max: 40,
    step: 1,
    default: 8,
    unit: "%",
    description: "% of midpoint chroma retained at step 50",
  },
  {
    key: "C_taper_dark",
    label: "Dark-end taper",
    min: 2,
    max: 40,
    step: 1,
    default: 15,
    unit: "%",
    description: "% of midpoint chroma retained at step 950",
  },
  {
    key: "C_ease",
    label: "Easing factor",
    min: 0.5,
    max: 1.5,
    step: 0.1,
    default: 1.0,
    description: "< 1 = fast taper, > 1 = holds peak chroma longer",
  },
]

export const HUE_PARAMS: ParamConfig[] = [
  {
    key: "H_shift_light",
    label: "Light-end shift",
    min: -30,
    max: 30,
    step: 1,
    default: 0,
    unit: "°",
    description: "Hue rotation in degrees toward the lightest step",
  },
  {
    key: "H_shift_dark",
    label: "Dark-end shift",
    min: -30,
    max: 30,
    step: 1,
    default: 0,
    unit: "°",
    description: "Hue rotation in degrees toward the darkest step",
  },
  {
    key: "H_ease",
    label: "Easing factor",
    min: 0.5,
    max: 1.5,
    step: 0.1,
    default: 1.0,
    description: "< 1 = fast shift near anchor, > 1 = holds anchor hue longer",
  },
]

export const DISTRIBUTION_PARAM: ParamConfig = {
  key: "dist_ease",
  label: "Easing factor",
  min: 0.5,
  max: 1.5,
  step: 0.1,
  default: 1.0,
  description: "Sets both lightness and chroma easing together",
}
