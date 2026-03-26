import type { Oklch } from 'culori'
import { converter, formatHex, parse } from 'culori'
import fs from 'node:fs/promises'
import type { IncomingMessage, ServerResponse } from 'node:http'
import path from 'node:path'
import type { Plugin } from 'vite'
import { ALPHA_EXPORT_STEPS, ALPHA_SUFFIXES } from './src/lib/constants'

const COLORS_JSON_PATH = path.resolve(import.meta.dirname, '../../src/foundation/colors.json')
const PARAMS_JSON_PATH = path.resolve(import.meta.dirname, 'palette-params.json')

const toOklch = converter('oklch')

// Special palettes that don't use numeric step keys
const EXCLUDED_PALETTES = new Set(['black', 'white'])

// Color-wheel order: chromatic (red → orange → yellow → green → blue → purple), then neutrals
const PALETTE_ORDER: string[] = [
  'mulberry',
  'copper',
  'amber',
  'gold',
  'fern',
  'cobalt',
  'gray',
  'stone',
  'olive',
]

/** Convert any CSS colour string (OKLCH, HEX, etc.) to uppercase HEX. */
function toHex(color: string): string {
  if (/^#[0-9a-fA-F]{6}$/i.test(color)) return color.toUpperCase()
  const parsed = parse(color)
  if (!parsed) return color
  return (formatHex(parsed) ?? '#000000').toUpperCase()
}

/** Format an OKLCH colour for token file output. */
function formatOklchToken(oklch: Oklch, alpha?: number): string {
  const L = oklch.l.toFixed(4)
  const C = oklch.c.toFixed(4)
  const H = (oklch.h ?? 0).toFixed(2)
  if (alpha !== undefined) return `oklch(${L} ${C} ${H} / ${alpha})`
  return `oklch(${L} ${C} ${H})`
}

/** Convert a HEX colour string to OKLCH token format. */
function hexToOklchToken(hex: string): string {
  const parsed = parse(hex)
  if (!parsed) return hex
  const oklch = toOklch(parsed)
  return formatOklchToken(oklch)
}

function generateAlphaTokens(midpointHex: string): Record<string, { $value: string }> {
  const parsed = parse(midpointHex)
  if (!parsed) return {}
  const oklch = toOklch(parsed)

  const result: Record<string, { $value: string }> = {
    transparent: { $value: formatOklchToken(oklch, 0) },
  }
  for (const step of ALPHA_EXPORT_STEPS) {
    const hexByte = parseInt(ALPHA_SUFFIXES[step], 16)
    const alpha = Number((hexByte / 255).toFixed(3))
    result[`a${step}`] = { $value: formatOklchToken(oklch, alpha) }
  }
  return result
}

function titleCase(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (chunk: Buffer) => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks).toString()))
    req.on('error', reject)
  })
}

function json(res: ServerResponse, status: number, data: unknown): void {
  res.writeHead(status, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(data))
}

async function readJsonFile(filepath: string): Promise<unknown> {
  const raw = await fs.readFile(filepath, 'utf-8')
  return JSON.parse(raw)
}

async function readParamsFile(): Promise<Record<string, unknown>> {
  try {
    return (await readJsonFile(PARAMS_JSON_PATH)) as Record<string, unknown>
  } catch {
    return {}
  }
}

interface ColorsJson {
  colors: Record<string, Record<string, unknown>>
}

export function paletteApiPlugin(): Plugin {
  return {
    name: 'palette-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        // GET /api/palettes
        if (req.method === 'GET' && req.url === '/api/palettes') {
          try {
            const colorsData = (await readJsonFile(COLORS_JSON_PATH)) as ColorsJson
            const paramsData = await readParamsFile()
            const colors = colorsData.colors

            const palettes: unknown[] = []

            for (const [name, palette] of Object.entries(colors)) {
              if (name.startsWith('$')) continue
              if (EXCLUDED_PALETTES.has(name)) continue

              const paletteObj = palette as Record<string, unknown>
              // Must have a "500" key to be a step-based palette
              const midpointEntry = paletteObj['500'] as { $value: string } | undefined
              if (!midpointEntry?.$value) continue

              // Collect numeric step values, converting to HEX for the UI
              const steps: Record<string, string> = {}
              for (const [key, val] of Object.entries(paletteObj)) {
                if (/^\d+$/.test(key)) {
                  steps[key] = toHex((val as { $value: string }).$value)
                }
              }

              palettes.push({
                name,
                displayName: titleCase(name),
                hex: toHex(midpointEntry.$value),
                steps,
                params: paramsData[name] ?? null,
              })
            }

            palettes.sort((a, b) => {
              const ai = PALETTE_ORDER.indexOf((a as { name: string }).name)
              const bi = PALETTE_ORDER.indexOf((b as { name: string }).name)
              const oa = ai === -1 ? PALETTE_ORDER.length : ai
              const ob = bi === -1 ? PALETTE_ORDER.length : bi
              if (oa !== ob) return oa - ob
              return (a as { name: string }).name.localeCompare((b as { name: string }).name)
            })
            json(res, 200, { palettes })
          } catch (err) {
            json(res, 500, {
              error: err instanceof Error ? err.message : 'Read failed',
            })
          }
          return
        }

        // POST /api/palettes/:name
        const postMatch = req.url?.match(/^\/api\/palettes\/([a-z][a-z0-9-]*)$/)
        if (req.method === 'POST' && postMatch) {
          const name = postMatch[1]

          if (EXCLUDED_PALETTES.has(name)) {
            json(res, 400, { error: `Cannot modify "${name}" palette` })
            return
          }

          try {
            const body = JSON.parse(await readBody(req)) as {
              steps: Array<{ step: number; hex: string }>
              params: Record<string, number>
            }

            const colorsData = (await readJsonFile(COLORS_JSON_PATH)) as ColorsJson
            const colors = colorsData.colors
            const isNew = !colors[name] || name.startsWith('$')

            // Find the 500 midpoint for alpha generation
            const midpointStep = body.steps.find((s) => s.step === 500)
            if (!midpointStep) {
              json(res, 400, { error: 'Missing step 500 (midpoint)' })
              return
            }

            // Build the palette object — store as OKLCH in the token file
            const paletteObj: Record<string, unknown> = {}
            const sortedSteps = [...body.steps].sort((a, b) => a.step - b.step)
            for (const { step, hex } of sortedSteps) {
              paletteObj[step.toString()] = { $value: hexToOklchToken(hex) }
            }
            paletteObj['alpha'] = generateAlphaTokens(midpointStep.hex)

            if (isNew) {
              // Insert before black/white — rebuild the colors object
              const newColors: Record<string, unknown> = {}
              for (const [key, val] of Object.entries(colors)) {
                if (EXCLUDED_PALETTES.has(key)) {
                  // Insert new palette before the first excluded palette
                  if (!newColors[name]) {
                    newColors[name] = paletteObj
                  }
                }
                newColors[key] = val
              }
              // If no excluded palettes found (edge case), just append
              if (!newColors[name]) {
                newColors[name] = paletteObj
              }
              colorsData.colors = newColors as Record<string, Record<string, unknown>>
            } else {
              // Update existing — preserve key position
              colors[name] = paletteObj
            }

            await fs.writeFile(
              COLORS_JSON_PATH,
              JSON.stringify(colorsData, null, 2) + '\n',
              'utf-8',
            )

            // Save params
            const paramsData = await readParamsFile()
            paramsData[name] = body.params
            await fs.writeFile(
              PARAMS_JSON_PATH,
              JSON.stringify(paramsData, null, 2) + '\n',
              'utf-8',
            )

            json(res, 200, { ok: true, created: isNew })
          } catch (err) {
            json(res, 500, {
              error: err instanceof Error ? err.message : 'Save failed',
            })
          }
          return
        }

        next()
      })
    },
  }
}
