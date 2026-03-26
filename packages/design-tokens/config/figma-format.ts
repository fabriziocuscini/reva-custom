/**
 * Builds a Figma variables manifest from DTCG source tokens.
 *
 * Converts token values to Figma-native formats:
 *   color oklch()      → { r, g, b, a } normalised 0–1
 *   dimension "16px"    → numeric 16
 *   dimension "1.5rem"  → numeric 24 (×16)
 *   duration "200ms"    → numeric 200
 *   number / fontWeight → numeric (pass-through)
 *   fontFamily          → string (pass-through)
 *
 * Skipped groups (Figma FLOAT variables are unitless — no way to hint
 * that a value should be interpreted as % rather than px when bound to
 * line-height or letter-spacing on a text node):
 *   lineHeights, letterSpacings
 *
 * References in semantic tokens → { alias: "Collection/path" }
 */

import chroma from 'chroma-js'
import type { FigmaCollectionConfig } from './figma-collections'

// ── Types ────────────────────────────────────────────────────────────────

type JsonValue = string | number | boolean | null | JsonObject | JsonValue[]
export interface JsonObject {
  [key: string]: JsonValue
}

type FigmaVarType = 'COLOR' | 'FLOAT' | 'STRING'
type FigmaColorValue = { r: number; g: number; b: number; a: number }
type FigmaResolvedValue = FigmaColorValue | number | string
type FigmaAliasValue = { alias: string }
type FigmaValue = FigmaResolvedValue | FigmaAliasValue

interface FigmaVariable {
  name: string
  type: FigmaVarType
  description?: string
  values: Record<string, FigmaValue>
}

interface FigmaCollection {
  name: string
  modes: string[]
  variables: FigmaVariable[]
}

export interface FigmaManifest {
  version: '1.0'
  collections: FigmaCollection[]
}

// ── DTCG types we can represent as Figma variables ───────────────────────

const FIGMA_TYPE_MAP: Record<string, FigmaVarType> = {
  color: 'COLOR',
  dimension: 'FLOAT',
  duration: 'FLOAT',
  number: 'FLOAT',
  fontWeight: 'FLOAT',
  fontFamily: 'STRING',
}

const SKIP_TYPES = new Set(['shadow', 'typography', 'other', 'border'])

/**
 * Top-level token groups excluded from Figma variables.
 * Figma FLOAT variables are unitless — binding them to line-height or
 * letter-spacing always uses px, regardless of the field's current unit.
 */
const SKIP_GROUPS = new Set(['lineHeights', 'letterSpacings'])

// ── Value converters ─────────────────────────────────────────────────────

function round(n: number, decimals: number): number {
  const factor = 10 ** decimals
  return Math.round(n * factor) / factor
}

function oklchToFigmaRgba(value: string): FigmaColorValue | null {
  try {
    const [r, g, b, a] = chroma(value).rgba()
    return {
      r: round(r / 255, 4),
      g: round(g / 255, 4),
      b: round(b / 255, 4),
      a: round(a, 4),
    }
  } catch {
    return null
  }
}

function dimensionToNumber(value: string): number | null {
  const pxMatch = value.match(/^(-?\d+(?:\.\d+)?)px$/)
  if (pxMatch?.[1]) return parseFloat(pxMatch[1])

  const remMatch = value.match(/^(-?\d+(?:\.\d+)?)rem$/)
  if (remMatch?.[1]) return parseFloat(remMatch[1]) * 16

  return null
}

function durationToNumber(value: string): number | null {
  const msMatch = value.match(/^(-?\d+(?:\.\d+)?)ms$/)
  if (msMatch?.[1]) return parseFloat(msMatch[1])

  const sMatch = value.match(/^(-?\d+(?:\.\d+)?)s$/)
  if (sMatch?.[1]) return parseFloat(sMatch[1]) * 1000

  return null
}

function convertValue(
  type: string,
  value: JsonValue,
  groupPath: string[],
): { figmaType: FigmaVarType; figmaValue: FigmaResolvedValue } | null {
  const topGroup = groupPath[0]

  if (type === 'color' && typeof value === 'string') {
    const rgba = oklchToFigmaRgba(value)
    if (!rgba) return null
    return { figmaType: 'COLOR', figmaValue: rgba }
  }

  if (type === 'dimension' && typeof value === 'string') {
    const num = dimensionToNumber(value)
    if (num === null) return null
    return { figmaType: 'FLOAT', figmaValue: num }
  }

  if (type === 'duration' && typeof value === 'string') {
    const num = durationToNumber(value)
    if (num === null) return null
    return { figmaType: 'FLOAT', figmaValue: num }
  }

  if (type === 'number') {
    const num = typeof value === 'number' ? value : parseFloat(String(value))
    if (isNaN(num)) return null
    if (topGroup === 'opacity') {
      return { figmaType: 'FLOAT', figmaValue: round(num * 100, 2) }
    }
    return { figmaType: 'FLOAT', figmaValue: num }
  }

  if (type === 'fontWeight') {
    const num = typeof value === 'number' ? value : parseFloat(String(value))
    if (isNaN(num)) return null
    return { figmaType: 'FLOAT', figmaValue: num }
  }

  if (type === 'fontFamily' && typeof value === 'string') {
    return { figmaType: 'STRING', figmaValue: value }
  }

  return null
}

// ── Token tree walker ────────────────────────────────────────────────────

interface TokenLeaf {
  path: string[]
  type: string
  value: JsonValue
  description?: string
}

function isReference(value: JsonValue): value is string {
  return typeof value === 'string' && value.startsWith('{') && value.endsWith('}')
}

function parseReference(ref: string): string[] {
  return ref.slice(1, -1).split('.')
}

/**
 * Walks a DTCG token tree and collects leaf tokens with their inherited type.
 */
function collectTokens(node: JsonObject, path: string[] = [], inheritedType?: string): TokenLeaf[] {
  const results: TokenLeaf[] = []
  const nodeType = (node.$type as string) ?? inheritedType

  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith('$')) continue

    if (typeof value === 'object' && value !== null && !Array.isArray(value) && '$value' in value) {
      const leaf = value as JsonObject
      const leafType = (leaf.$type as string) ?? nodeType
      if (leafType && !SKIP_TYPES.has(leafType)) {
        results.push({
          path: [...path, key],
          type: leafType,
          value: leaf.$value as JsonValue,
          description: leaf.$description as string | undefined,
        })
      }
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      results.push(...collectTokens(value as JsonObject, [...path, key], nodeType))
    }
  }

  return results
}

// ── Manifest builder ─────────────────────────────────────────────────────

/**
 * Given a map of already-built collections (name → set of variable paths),
 * resolves a DTCG reference to a Figma alias string.
 */
function resolveAlias(
  refPath: string[],
  variableIndex: Map<string, string>,
): FigmaAliasValue | null {
  const dotPath = refPath.join('.')
  const collectionName = variableIndex.get(dotPath)
  if (!collectionName) return null
  return { alias: `${collectionName}/${refPath.join('/')}` }
}

export function buildFigmaManifest(
  collections: FigmaCollectionConfig[],
  sourcesByPath: Map<string, JsonObject>,
): FigmaManifest {
  const result: FigmaCollection[] = []
  const variableIndex = new Map<string, string>()

  for (const collectionConfig of collections) {
    const modeNames = collectionConfig.modes.map((m) => m.name)
    const variables = new Map<string, FigmaVariable>()

    for (const mode of collectionConfig.modes) {
      for (const sourcePath of mode.sources) {
        const sourceJson = sourcesByPath.get(sourcePath)
        if (!sourceJson) continue

        const tokens = collectTokens(sourceJson)

        for (const token of tokens) {
          if (token.path[0] && SKIP_GROUPS.has(token.path[0])) continue

          const varName = token.path.join('/')
          const figmaType = FIGMA_TYPE_MAP[token.type]
          if (!figmaType) continue

          if (isReference(token.value)) {
            const refPath = parseReference(token.value as string)
            const alias = resolveAlias(refPath, variableIndex)
            if (!alias) continue

            const existing = variables.get(varName)
            if (existing) {
              existing.values[mode.name] = alias
            } else {
              variables.set(varName, {
                name: varName,
                type: figmaType,
                ...(token.description && { description: token.description }),
                values: { [mode.name]: alias },
              })
            }
          } else {
            const converted = convertValue(token.type, token.value, token.path)
            if (!converted) continue

            const existing = variables.get(varName)
            if (existing) {
              existing.values[mode.name] = converted.figmaValue
            } else {
              variables.set(varName, {
                name: varName,
                type: converted.figmaType,
                ...(token.description && { description: token.description }),
                values: { [mode.name]: converted.figmaValue },
              })
            }

            variableIndex.set(token.path.join('.'), collectionConfig.name)
          }
        }
      }
    }

    result.push({
      name: collectionConfig.name,
      modes: modeNames,
      variables: [...variables.values()],
    })
  }

  return { version: '1.0', collections: result }
}
