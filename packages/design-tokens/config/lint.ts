/**
 * tokens:lint — DTCG design-token linter
 *
 * Validates every JSON token file under src/ against:
 *   • W3C DTCG Format Module 2025.10
 *   • Reva project conventions (CLAUDE.md)
 *
 * Inspired by https://github.com/dembrandt/dtcg-validator
 *
 * Run:  bun run tokens:lint
 */

import { readdir, readFile } from 'fs/promises'
import { relative, resolve } from 'path'

// ── Types ───────────────────────────────────────────────────────────────────

type Severity = 'error' | 'warning'

interface Diagnostic {
  severity: Severity
  file: string
  path: string
  message: string
}

interface TokenRegistry {
  path: string
  type: string | undefined
  value: unknown
}

// ── Allowed $type values ────────────────────────────────────────────────────
// W3C DTCG Format Module 2025.10 types + "other" as a Reva project extension
// for tokens without a matching DTCG type (e.g. aspectRatios, cursors).

const DTCG_TYPES = new Set([
  'color',
  'dimension',
  'fontFamily',
  'fontWeight',
  'duration',
  'cubicBezier',
  'number',
  'strokeStyle',
  'border',
  'transition',
  'shadow',
  'gradient',
  'typography',
  // Project extension — catch-all for tokens that have no DTCG equivalent
  'other',
])

const FORBIDDEN_NAME_CHARS = /[{}]/

const FONT_WEIGHT_ALIASES = new Set([
  'thin',
  'hairline',
  'extra-light',
  'ultra-light',
  'light',
  'normal',
  'regular',
  'book',
  'medium',
  'semi-bold',
  'demi-bold',
  'bold',
  'extra-bold',
  'ultra-bold',
  'black',
  'heavy',
  'extra-black',
  'ultra-black',
])

const STROKE_STYLE_STRINGS = new Set([
  'solid',
  'dashed',
  'dotted',
  'double',
  'groove',
  'ridge',
  'outset',
  'inset',
])

// ── Helpers ─────────────────────────────────────────────────────────────────

function isReference(v: unknown): v is string {
  return typeof v === 'string' && /^\{[^{}]+\}$/.test(v)
}

function isMathExpression(v: unknown): v is string {
  if (typeof v !== 'string') return false
  return /\{[^{}]+\}\s*[+\-*/]/.test(v) || /[+\-*/]\s*\{[^{}]+\}/.test(v)
}

function isRefOrMath(v: unknown): boolean {
  return isReference(v) || isMathExpression(v)
}

function extractRefPath(ref: string): string {
  return ref.replace(/^\{|\}$/g, '')
}

// ── Token registry (for cross-reference validation) ─────────────────────────

function buildRegistry(
  obj: Record<string, unknown>,
  path: string,
  parentType: string | undefined,
  registry: Map<string, TokenRegistry>,
): void {
  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith('$')) continue
    const currentPath = path ? `${path}.${key}` : key
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      const node = value as Record<string, unknown>
      if ('$value' in node) {
        const tokenType = (node.$type as string) ?? parentType
        registry.set(currentPath, { path: currentPath, type: tokenType, value: node.$value })
      } else {
        const groupType = (node.$type as string) ?? parentType
        buildRegistry(node, currentPath, groupType, registry)
      }
    }
  }
}

function buildGlobalRegistry(
  sources: Array<{ file: string; data: Record<string, unknown> }>,
): Map<string, TokenRegistry> {
  const registry = new Map<string, TokenRegistry>()
  for (const { data } of sources) {
    buildRegistry(data, '', undefined, registry)
  }
  return registry
}

// ── Reference resolution (circular detection) ──────────────────────────────

function resolveRef(
  refPath: string,
  registry: Map<string, TokenRegistry>,
  visited: Set<string> = new Set(),
): { error?: string } {
  if (visited.has(refPath)) {
    return { error: `Circular reference: ${[...visited, refPath].join(' → ')}` }
  }
  const token = registry.get(refPath)
  if (!token) return { error: `Unresolved reference "{${refPath}}"` }
  visited.add(refPath)
  if (isReference(token.value)) {
    return resolveRef(extractRefPath(token.value as string), registry, visited)
  }
  return {}
}

// ── Value validators ────────────────────────────────────────────────────────

function validateColorValue(value: unknown, path: string, file: string, diags: Diagnostic[]): void {
  if (typeof value === 'string') {
    if (isRefOrMath(value)) return
    const isHex = /^#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(value)
    const isOklch = value.startsWith('oklch(')
    const isFunc =
      value.startsWith('rgb(') ||
      value.startsWith('rgba(') ||
      value.startsWith('hsl(') ||
      value.startsWith('hsla(')
    if (!isHex && !isOklch && !isFunc) {
      diags.push({
        severity: 'warning',
        file,
        path,
        message: `Color value "${value}" is not a recognised format (hex, oklch(), rgb/hsl)`,
      })
    }
    return
  }
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    const obj = value as Record<string, unknown>
    if (!obj.colorSpace) {
      diags.push({ severity: 'error', file, path, message: 'Color object missing "colorSpace"' })
    }
    if (!Array.isArray(obj.components)) {
      diags.push({
        severity: 'error',
        file,
        path,
        message: 'Color object missing "components" array',
      })
    }
    return
  }
  diags.push({ severity: 'error', file, path, message: 'Color value must be a string or object' })
}

function validateDimensionValue(
  value: unknown,
  path: string,
  file: string,
  diags: Diagnostic[],
): void {
  if (typeof value === 'string') {
    if (isRefOrMath(value)) return
    if (/^-?\d+(\.\d+)?(px|rem|em|%)$/.test(value)) return
    // CSS keywords that are valid for sizes/dimension tokens in our system
    const cssKeywords =
      /^(min-content|max-content|fit-content|auto|\d+ch|\d+d?v[wh]|\d+s?v[wh]|\d+l?v[wh])$/
    if (cssKeywords.test(value)) return
    diags.push({
      severity: 'warning',
      file,
      path,
      message: `Dimension "${value}" has a non-standard unit (DTCG allows px|rem; em/% tolerated by Style Dictionary)`,
    })
    return
  }
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    const obj = value as Record<string, unknown>
    if (typeof obj.value !== 'number') {
      diags.push({
        severity: 'error',
        file,
        path,
        message: 'Dimension object needs numeric "value"',
      })
    }
    if (obj.unit !== 'px' && obj.unit !== 'rem') {
      diags.push({
        severity: 'error',
        file,
        path,
        message: 'Dimension object unit must be "px" or "rem"',
      })
    }
    return
  }
  if (typeof value === 'number') return
  diags.push({
    severity: 'error',
    file,
    path,
    message: 'Dimension must be a string, number, or {value, unit} object',
  })
}

function validateDurationValue(
  value: unknown,
  path: string,
  file: string,
  diags: Diagnostic[],
): void {
  if (typeof value === 'string') {
    if (isRefOrMath(value)) return
    if (/^\d+(\.\d+)?(ms|s)$/.test(value)) return
    diags.push({
      severity: 'error',
      file,
      path,
      message: `Duration "${value}" must use "ms" or "s" unit`,
    })
    return
  }
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    const obj = value as Record<string, unknown>
    if (typeof obj.value !== 'number') {
      diags.push({
        severity: 'error',
        file,
        path,
        message: 'Duration object needs numeric "value"',
      })
    }
    if (obj.unit !== 'ms' && obj.unit !== 's') {
      diags.push({ severity: 'error', file, path, message: 'Duration unit must be "ms" or "s"' })
    }
    return
  }
  diags.push({
    severity: 'error',
    file,
    path,
    message: 'Duration must be a string or {value, unit} object',
  })
}

function validateFontWeightValue(
  value: unknown,
  path: string,
  file: string,
  diags: Diagnostic[],
): void {
  if (typeof value === 'string') {
    if (isRefOrMath(value)) return
    if (FONT_WEIGHT_ALIASES.has(value.toLowerCase())) return
    diags.push({
      severity: 'warning',
      file,
      path,
      message: `Font weight "${value}" is not a standard DTCG alias or numeric weight`,
    })
    return
  }
  if (typeof value === 'number') {
    if (value < 1 || value > 1000) {
      diags.push({
        severity: 'error',
        file,
        path,
        message: `Font weight ${value} out of range [1, 1000]`,
      })
    }
    return
  }
  diags.push({ severity: 'error', file, path, message: 'Font weight must be a number or string' })
}

function validateCubicBezierValue(
  value: unknown,
  path: string,
  file: string,
  diags: Diagnostic[],
): void {
  if (!Array.isArray(value) || value.length !== 4) {
    diags.push({
      severity: 'error',
      file,
      path,
      message: 'cubicBezier must be an array of 4 numbers',
    })
    return
  }
  for (let i = 0; i < 4; i++) {
    if (typeof value[i] !== 'number') {
      diags.push({ severity: 'error', file, path, message: `cubicBezier[${i}] must be a number` })
    }
  }
  if (typeof value[0] === 'number' && (value[0] < 0 || value[0] > 1)) {
    diags.push({ severity: 'error', file, path, message: 'cubicBezier P1x must be in [0, 1]' })
  }
  if (typeof value[2] === 'number' && (value[2] < 0 || value[2] > 1)) {
    diags.push({ severity: 'error', file, path, message: 'cubicBezier P2x must be in [0, 1]' })
  }
}

function validateShadowObject(
  shadow: unknown,
  path: string,
  file: string,
  diags: Diagnostic[],
): void {
  if (typeof shadow !== 'object' || shadow === null || Array.isArray(shadow)) {
    diags.push({ severity: 'error', file, path, message: 'Shadow entry must be an object' })
    return
  }
  const s = shadow as Record<string, unknown>
  if (!('offsetX' in s) || !('offsetY' in s)) {
    diags.push({
      severity: 'error',
      file,
      path,
      message: 'Shadow must have "offsetX" and "offsetY" properties',
    })
  }
  if (!('color' in s)) {
    diags.push({ severity: 'error', file, path, message: 'Shadow missing "color"' })
  }
  if (!('blur' in s)) {
    diags.push({ severity: 'error', file, path, message: 'Shadow missing "blur"' })
  }
  if (!('spread' in s)) {
    diags.push({ severity: 'error', file, path, message: 'Shadow missing "spread"' })
  }
  if ('inset' in s && typeof s.inset !== 'boolean') {
    diags.push({ severity: 'error', file, path, message: 'Shadow "inset" must be boolean' })
  }
}

function validateShadowValue(
  value: unknown,
  path: string,
  file: string,
  diags: Diagnostic[],
): void {
  if (Array.isArray(value)) {
    value.forEach((item, i) => validateShadowObject(item, `${path}[${i}]`, file, diags))
    return
  }
  if (typeof value === 'string' && isRefOrMath(value)) return
  validateShadowObject(value, path, file, diags)
}

function validateBorderValue(
  value: unknown,
  path: string,
  file: string,
  diags: Diagnostic[],
): void {
  if (typeof value === 'string' && isRefOrMath(value)) return
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    diags.push({ severity: 'error', file, path, message: 'Border must be an object' })
    return
  }
  const b = value as Record<string, unknown>
  for (const req of ['color', 'width', 'style'] as const) {
    if (!(req in b)) {
      diags.push({ severity: 'error', file, path, message: `Border missing "${req}"` })
    }
  }
}

function validateTransitionValue(
  value: unknown,
  path: string,
  file: string,
  diags: Diagnostic[],
): void {
  if (typeof value === 'string' && isRefOrMath(value)) return
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    diags.push({ severity: 'error', file, path, message: 'Transition must be an object' })
    return
  }
  const t = value as Record<string, unknown>
  for (const req of ['duration', 'delay', 'timingFunction'] as const) {
    if (!(req in t)) {
      diags.push({ severity: 'error', file, path, message: `Transition missing "${req}"` })
    }
  }
}

function validateGradientValue(
  value: unknown,
  path: string,
  file: string,
  diags: Diagnostic[],
): void {
  if (typeof value === 'string' && isRefOrMath(value)) return
  if (!Array.isArray(value)) {
    diags.push({ severity: 'error', file, path, message: 'Gradient must be an array of stops' })
    return
  }
  for (let i = 0; i < value.length; i++) {
    const stop = value[i]
    if (typeof stop !== 'object' || stop === null || Array.isArray(stop)) {
      diags.push({
        severity: 'error',
        file,
        path: `${path}[${i}]`,
        message: 'Gradient stop must be an object',
      })
      continue
    }
    const s = stop as Record<string, unknown>
    if (!('color' in s)) {
      diags.push({
        severity: 'error',
        file,
        path: `${path}[${i}]`,
        message: 'Gradient stop missing "color"',
      })
    }
    if (!('position' in s)) {
      diags.push({
        severity: 'error',
        file,
        path: `${path}[${i}]`,
        message: 'Gradient stop missing "position"',
      })
    }
  }
}

function validateTypographyValue(
  value: unknown,
  path: string,
  file: string,
  diags: Diagnostic[],
): void {
  if (typeof value === 'string' && isRefOrMath(value)) return
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    diags.push({ severity: 'error', file, path, message: 'Typography must be an object' })
    return
  }
  const t = value as Record<string, unknown>
  const knownFields = new Set([
    'fontFamily',
    'fontSize',
    'fontWeight',
    'lineHeight',
    'letterSpacing',
    'paragraphSpacing',
    'paragraphIndent',
    'textCase',
    'textDecoration',
  ])
  for (const key of Object.keys(t)) {
    if (!knownFields.has(key)) {
      diags.push({
        severity: 'warning',
        file,
        path,
        message: `Typography has unknown field "${key}"`,
      })
    }
  }
}

function validateStrokeStyleValue(
  value: unknown,
  path: string,
  file: string,
  diags: Diagnostic[],
): void {
  if (typeof value === 'string') {
    if (isRefOrMath(value)) return
    if (!STROKE_STYLE_STRINGS.has(value)) {
      diags.push({
        severity: 'error',
        file,
        path,
        message: `strokeStyle "${value}" is not a valid keyword (${[...STROKE_STYLE_STRINGS].join(', ')})`,
      })
    }
    return
  }
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    const obj = value as Record<string, unknown>
    if (!Array.isArray(obj.dashArray)) {
      diags.push({
        severity: 'error',
        file,
        path,
        message: 'strokeStyle object needs "dashArray" array',
      })
    }
    if (typeof obj.lineCap === 'string' && !['round', 'butt', 'square'].includes(obj.lineCap)) {
      diags.push({
        severity: 'error',
        file,
        path,
        message: 'strokeStyle lineCap must be "round", "butt", or "square"',
      })
    }
    return
  }
  diags.push({ severity: 'error', file, path, message: 'strokeStyle must be a string or object' })
}

// ── Per-type dispatch ───────────────────────────────────────────────────────

function validateValueForType(
  type: string,
  value: unknown,
  path: string,
  file: string,
  diags: Diagnostic[],
): void {
  // Top-level reference/math always pass type validation
  if (isRefOrMath(value)) return

  switch (type) {
    case 'color':
      validateColorValue(value, path, file, diags)
      break
    case 'dimension':
      validateDimensionValue(value, path, file, diags)
      break
    case 'duration':
      validateDurationValue(value, path, file, diags)
      break
    case 'fontWeight':
      validateFontWeightValue(value, path, file, diags)
      break
    case 'fontFamily':
      if (typeof value !== 'string' && !Array.isArray(value)) {
        diags.push({
          severity: 'error',
          file,
          path,
          message: 'fontFamily must be a string or array',
        })
      }
      break
    case 'number':
      if (typeof value === 'string') {
        if (/^-?\d+(\.\d+)?$/.test(value)) return
        diags.push({
          severity: 'warning',
          file,
          path,
          message: `Number token has string value "${value}" — consider using a JSON number`,
        })
      } else if (typeof value !== 'number') {
        diags.push({ severity: 'error', file, path, message: 'Number value must be a number' })
      }
      break
    case 'cubicBezier':
      validateCubicBezierValue(value, path, file, diags)
      break
    case 'shadow':
      validateShadowValue(value, path, file, diags)
      break
    case 'border':
      validateBorderValue(value, path, file, diags)
      break
    case 'transition':
      validateTransitionValue(value, path, file, diags)
      break
    case 'gradient':
      validateGradientValue(value, path, file, diags)
      break
    case 'typography':
      validateTypographyValue(value, path, file, diags)
      break
    case 'strokeStyle':
      validateStrokeStyleValue(value, path, file, diags)
      break
    // "other" — permissive, no value validation
  }
}

// ── Tree walker ─────────────────────────────────────────────────────────────

function walkTokens(
  obj: Record<string, unknown>,
  file: string,
  tokenPath: string,
  parentType: string | undefined,
  diags: Diagnostic[],
  registry: Map<string, TokenRegistry>,
): { tokens: number; groups: number } {
  let tokens = 0
  let groups = 0

  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith('$')) continue

    const currentPath = tokenPath ? `${tokenPath}.${key}` : key

    // ── Name checks ───────────────────────────────────────────────────
    if (FORBIDDEN_NAME_CHARS.test(key)) {
      diags.push({
        severity: 'error',
        file,
        path: currentPath,
        message: `Name "${key}" contains forbidden characters ({ or })`,
      })
    }

    if (value === null || typeof value !== 'object' || Array.isArray(value)) {
      diags.push({
        severity: 'error',
        file,
        path: currentPath,
        message: `Unexpected non-object value at token/group position`,
      })
      continue
    }

    const node = value as Record<string, unknown>

    // ── Is it a token? ────────────────────────────────────────────────
    if ('$value' in node) {
      tokens++
      const tokenValue = node.$value
      const declaredType = node.$type as string | undefined
      const effectiveType = declaredType ?? parentType

      // $type validation
      if (declaredType !== undefined && !DTCG_TYPES.has(declaredType)) {
        diags.push({
          severity: 'error',
          file,
          path: currentPath,
          message: `Unknown $type "${declaredType}"`,
        })
      }

      // Must have a determinable type
      if (!effectiveType) {
        diags.push({
          severity: 'error',
          file,
          path: currentPath,
          message: 'Token has no $type and no inherited group type',
        })
      }

      // Ensure $value is not undefined/null
      if (tokenValue === undefined || tokenValue === null) {
        diags.push({
          severity: 'error',
          file,
          path: currentPath,
          message: '$value is null or undefined',
        })
      } else if (effectiveType) {
        // Reference resolution check
        if (isReference(tokenValue)) {
          const refPath = extractRefPath(tokenValue as string)
          const result = resolveRef(refPath, registry)
          if (result.error) {
            diags.push({ severity: 'error', file, path: currentPath, message: result.error })
          }
        } else if (isMathExpression(tokenValue)) {
          // Validate that references inside math exist
          const refs = (tokenValue as string).match(/\{[^{}]+\}/g) ?? []
          for (const ref of refs) {
            const refPath = extractRefPath(ref)
            if (!registry.has(refPath)) {
              diags.push({
                severity: 'error',
                file,
                path: currentPath,
                message: `Unresolved reference "${ref}" inside math expression`,
              })
            }
          }
        } else {
          // Type-specific validation
          validateValueForType(effectiveType, tokenValue, currentPath, file, diags)
        }
      }

      // Check for unknown $-prefixed keys
      for (const k of Object.keys(node)) {
        if (
          k.startsWith('$') &&
          !['$value', '$type', '$description', '$extensions', '$deprecated'].includes(k)
        ) {
          diags.push({
            severity: 'warning',
            file,
            path: currentPath,
            message: `Unknown dollar-prefixed property "${k}" on token`,
          })
        }
      }

      continue
    }

    // ── Is it a group? ────────────────────────────────────────────────
    groups++
    const groupType = (node.$type as string | undefined) ?? parentType

    // Validate group-level $type
    if (node.$type !== undefined && !DTCG_TYPES.has(node.$type as string)) {
      diags.push({
        severity: 'error',
        file,
        path: currentPath,
        message: `Unknown $type "${node.$type}" on group`,
      })
    }

    // Check for unknown $-prefixed keys on groups
    for (const k of Object.keys(node)) {
      if (
        k.startsWith('$') &&
        !['$type', '$description', '$extensions', '$deprecated', '$extends'].includes(k)
      ) {
        diags.push({
          severity: 'warning',
          file,
          path: currentPath,
          message: `Unknown dollar-prefixed property "${k}" on group`,
        })
      }
    }

    // Recurse into group
    const sub = walkTokens(node, file, currentPath, groupType, diags, registry)
    tokens += sub.tokens
    groups += sub.groups
  }

  return { tokens, groups }
}

// ── File-level validation ───────────────────────────────────────────────────

function validateFile(
  data: Record<string, unknown>,
  file: string,
  registry: Map<string, TokenRegistry>,
): { diagnostics: Diagnostic[]; tokens: number; groups: number } {
  const diagnostics: Diagnostic[] = []
  const { tokens, groups } = walkTokens(data, file, '', undefined, diagnostics, registry)
  return { diagnostics, tokens, groups }
}

// ── Collect all JSON sources recursively ────────────────────────────────────

async function collectJsonFiles(dir: string): Promise<string[]> {
  const files: string[] = []
  const entries = await readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    const full = resolve(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await collectJsonFiles(full)))
    } else if (entry.name.endsWith('.json') && !entry.name.startsWith('$')) {
      files.push(full)
    }
  }
  return files.sort()
}

// ── Main ────────────────────────────────────────────────────────────────────

async function lint() {
  const srcDir = resolve(import.meta.dirname, '..', 'src')
  const jsonFiles = await collectJsonFiles(srcDir)

  if (jsonFiles.length === 0) {
    console.error('No JSON token files found in src/')
    process.exit(1)
  }

  // 1. Parse all files
  const sources: Array<{ file: string; relPath: string; data: Record<string, unknown> }> = []
  const parseErrors: Diagnostic[] = []

  for (const file of jsonFiles) {
    const relPath = relative(resolve(srcDir, '..'), file)
    try {
      const raw = await readFile(file, 'utf-8')
      const data = JSON.parse(raw)
      if (typeof data !== 'object' || data === null || Array.isArray(data)) {
        parseErrors.push({
          severity: 'error',
          file: relPath,
          path: '',
          message: 'Root must be a JSON object',
        })
        continue
      }
      sources.push({ file: relPath, relPath, data })
    } catch (err) {
      parseErrors.push({
        severity: 'error',
        file: relPath,
        path: '',
        message: `Invalid JSON: ${(err as Error).message}`,
      })
    }
  }

  // 2. Build global registry for reference resolution across files
  const registry = buildGlobalRegistry(sources)

  // 3. Validate each file
  let totalTokens = 0
  let totalGroups = 0
  const allDiagnostics: Diagnostic[] = [...parseErrors]

  for (const { file, data } of sources) {
    const result = validateFile(data, file, registry)
    totalTokens += result.tokens
    totalGroups += result.groups
    allDiagnostics.push(...result.diagnostics)
  }

  // 4. Report
  const errors = allDiagnostics.filter((d) => d.severity === 'error')
  const warnings = allDiagnostics.filter((d) => d.severity === 'warning')

  console.log('')
  console.log(`  Design Tokens Lint`)
  console.log(`  ──────────────────────────────────────`)
  console.log(`  Files scanned:  ${sources.length}`)
  console.log(`  Tokens found:   ${totalTokens}`)
  console.log(`  Groups found:   ${totalGroups}`)
  console.log(`  References:     ${registry.size} registered paths`)
  console.log('')

  if (errors.length === 0 && warnings.length === 0) {
    console.log('  ✓ All tokens are valid.\n')
    return
  }

  if (errors.length > 0) {
    console.log(`  ✗ ${errors.length} error(s)\n`)
    for (const d of errors) {
      const loc = d.path ? ` → ${d.path}` : ''
      console.log(`    ERROR  ${d.file}${loc}`)
      console.log(`           ${d.message}`)
    }
    console.log('')
  }

  if (warnings.length > 0) {
    console.log(`  ⚠ ${warnings.length} warning(s)\n`)
    for (const d of warnings) {
      const loc = d.path ? ` → ${d.path}` : ''
      console.log(`    WARN   ${d.file}${loc}`)
      console.log(`           ${d.message}`)
    }
    console.log('')
  }

  if (errors.length > 0) {
    process.exit(1)
  }
}

lint().catch((err) => {
  console.error(err)
  process.exit(1)
})
