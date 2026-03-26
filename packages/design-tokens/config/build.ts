import chroma from 'chroma-js'
import { mkdir, readdir, readFile, writeFile } from 'fs/promises'
import { resolve } from 'path'
import StyleDictionary from 'style-dictionary'
import { figmaCollections } from './figma-collections'
import { type JsonObject, buildFigmaManifest } from './figma-format'
import { buildPandaSemanticTokens, buildPandaTokens } from './panda-format'

// ── Custom transforms ────────────────────────────────────────────────────

StyleDictionary.registerTransform({
  name: 'reva/size/pxToRem',
  type: 'value',
  transitive: true,
  filter: (token) => {
    const val = String(token.$value ?? token.value)
    return /^-?\d+(\.\d+)?px$/.test(val)
  },
  transform: (token) => {
    const val = String(token.$value ?? token.value)
    const px = parseFloat(val)
    if (px === 0) return '0'
    return `${px / 16}rem`
  },
})

StyleDictionary.registerTransform({
  name: 'reva/color/oklchToHex',
  type: 'value',
  transitive: true,
  filter: (token) => {
    const val = String(token.$value ?? token.value)
    return val.startsWith('oklch(')
  },
  transform: (token) => {
    const val = String(token.$value ?? token.value)
    try {
      return chroma(val).hex('rgba')
    } catch {
      return val
    }
  },
})

StyleDictionary.registerTransform({
  name: 'reva/shadow/css',
  type: 'value',
  transitive: true,
  filter: (token) => {
    const type = token.$type ?? token.type
    return type === 'shadow'
  },
  transform: (token) => {
    const val = token.$value ?? token.value
    const shadows = Array.isArray(val) ? val : [val]
    return shadows
      .map((s: Record<string, string>) => {
        const { offsetX, offsetY, blur, spread, color } = s
        return `${offsetX} ${offsetY} ${blur} ${spread} ${color}`
      })
      .join(', ')
  },
})

const sdExclude = new Set(['textStyles.json'])

async function getFoundationFiles(srcDir: string): Promise<string[]> {
  const dir = resolve(srcDir, 'foundation')
  const entries = await readdir(dir)
  return entries
    .filter((f) => f.endsWith('.json') && !sdExclude.has(f))
    .sort()
    .map((f) => resolve(dir, f))
}

async function getComponentFiles(srcDir: string): Promise<string[]> {
  const dir = resolve(srcDir, 'component')
  try {
    const entries = await readdir(dir)
    return entries
      .filter((f) => f.endsWith('.json'))
      .sort()
      .map((f) => resolve(dir, f))
  } catch {
    return []
  }
}

const CSS_TRANSFORMS = ['name/kebab', 'reva/size/pxToRem', 'reva/shadow/css']
const NON_CSS_TRANSFORMS = ['reva/color/oklchToHex', 'reva/shadow/css']

function nonCssPlatforms(distDir: string, name: string) {
  return {
    ts: {
      transforms: [...NON_CSS_TRANSFORMS, 'name/camel'],
      buildPath: `${distDir}/ts/`,
      files: [
        {
          destination: `tokens-${name}.ts`,
          format: 'javascript/es6',
        },
      ],
    },

    json: {
      transforms: [...NON_CSS_TRANSFORMS, 'name/kebab'],
      buildPath: `${distDir}/json/`,
      files: [
        {
          destination: `tokens-${name}.json`,
          format: 'json/nested',
        },
      ],
    },

    'json-mobile': {
      transforms: [...NON_CSS_TRANSFORMS, 'name/camel'],
      buildPath: `${distDir}/json-mobile/`,
      files: [
        {
          destination: `tokens-${name}.json`,
          format: 'json/flat',
        },
      ],
    },
  }
}

async function build() {
  const srcDir = resolve(import.meta.dirname, '..', 'src')
  const distDir = resolve(import.meta.dirname, '..', 'dist')

  const foundationFiles = await getFoundationFiles(srcDir)
  const componentFiles = await getComponentFiles(srcDir)
  const colorModeDir = resolve(srcDir, 'colorMode')

  // ── Foundation build ─────────────────────────────────────────────────
  const sdFoundation = new StyleDictionary({
    source: foundationFiles,
    platforms: {
      css: {
        transforms: CSS_TRANSFORMS,
        prefix: 'reva',
        buildPath: `${distDir}/css/`,
        files: [
          {
            destination: 'tokens-foundation.css',
            format: 'css/variables',
            options: { outputReferences: true },
          },
        ],
      },
      ...nonCssPlatforms(distDir, 'foundation'),
    },
  })

  await sdFoundation.cleanAllPlatforms()
  await sdFoundation.buildAllPlatforms()
  console.log('✓ Built theme: foundation')

  // ── Light / dark builds ──────────────────────────────────────────────
  for (const mode of ['light', 'dark'] as const) {
    const colorModeFile = resolve(colorModeDir, `${mode}.json`)

    const sd = new StyleDictionary({
      source: [colorModeFile, ...componentFiles],
      include: foundationFiles,
      platforms: {
        css: {
          transforms: CSS_TRANSFORMS,
          prefix: 'reva',
          buildPath: `${distDir}/css/`,
          files: [
            {
              destination: `tokens-${mode}.css`,
              format: 'css/variables',
              options: { outputReferences: true },
            },
          ],
        },
        ...nonCssPlatforms(distDir, mode),
      },
    })

    await sd.cleanAllPlatforms()
    await sd.buildAllPlatforms()
    console.log(`✓ Built theme: ${mode}`)
  }

  // ── Panda CSS output ─────────────────────────────────────────────────
  const foundationSources = await Promise.all(
    foundationFiles.map(async (f) => JSON.parse(await readFile(f, 'utf-8'))),
  )
  const lightResolved = JSON.parse(
    await readFile(resolve(distDir, 'json/tokens-light.json'), 'utf-8'),
  )
  const pandaTokens = buildPandaTokens(foundationSources, lightResolved)

  const lightSemantic = JSON.parse(await readFile(resolve(colorModeDir, 'light.json'), 'utf-8'))
  const darkSemantic = JSON.parse(await readFile(resolve(colorModeDir, 'dark.json'), 'utf-8'))
  const pandaSemanticTokens = buildPandaSemanticTokens(lightSemantic, darkSemantic)

  await mkdir(resolve(distDir, 'panda'), { recursive: true })
  await writeFile(resolve(distDir, 'panda/tokens.json'), JSON.stringify(pandaTokens, null, 2))
  await writeFile(
    resolve(distDir, 'panda/semantic-tokens.json'),
    JSON.stringify(pandaSemanticTokens, null, 2),
  )
  console.log('✓ Built Panda CSS output')

  // ── Figma variables manifest ──────────────────────────────────────────
  const sourcesByPath = new Map<string, JsonObject>()

  const foundationDir = resolve(srcDir, 'foundation')
  const foundationEntries = await readdir(foundationDir)
  for (const entry of foundationEntries) {
    if (!entry.endsWith('.json')) continue
    const json = JSON.parse(await readFile(resolve(foundationDir, entry), 'utf-8'))
    sourcesByPath.set(`foundation/${entry.replace('.json', '')}`, json)
  }

  // Merge all non-excluded foundation files into 'foundation' aggregate key
  const foundationAggregate: JsonObject = {}
  for (const entry of foundationEntries) {
    if (!entry.endsWith('.json')) continue
    const excludeSet = new Set(
      figmaCollections.find((c) => c.name === 'Foundation')?.excludeFiles ?? [],
    )
    if (excludeSet.has(entry)) continue
    const json = JSON.parse(await readFile(resolve(foundationDir, entry), 'utf-8'))
    Object.assign(foundationAggregate, json)
  }
  sourcesByPath.set('foundation', foundationAggregate)

  for (const mode of ['light', 'dark'] as const) {
    const json = JSON.parse(await readFile(resolve(colorModeDir, `${mode}.json`), 'utf-8'))
    sourcesByPath.set(`colorMode/${mode}`, json)
  }

  const figmaManifest = buildFigmaManifest(figmaCollections, sourcesByPath)

  await mkdir(resolve(distDir, 'figma'), { recursive: true })
  await writeFile(
    resolve(distDir, 'figma/variables-manifest.json'),
    JSON.stringify(figmaManifest, null, 2),
  )
  console.log('✓ Built Figma variables manifest')
}

build().catch((err) => {
  console.error(err)
  process.exit(1)
})
