import { watch } from 'node:fs'
import { resolve } from 'node:path'

const srcDir = resolve(import.meta.dirname, '..', 'src')
const lintScript = resolve(import.meta.dirname, 'lint.ts')
const buildScript = resolve(import.meta.dirname, 'build.ts')

let building = false
let queued = false

async function run(script: string): Promise<number> {
  const proc = Bun.spawn(['bun', 'run', script], {
    stdout: 'inherit',
    stderr: 'inherit',
  })
  return proc.exited
}

async function lintAndBuild() {
  if (building) {
    queued = true
    return
  }

  building = true
  const start = performance.now()
  console.log('\n⟳  Change detected — linting tokens…')

  const lintCode = await run(lintScript)
  if (lintCode !== 0) {
    const elapsed = Math.round(performance.now() - start)
    console.log(`✗  Lint failed — skipping build (${elapsed}ms)`)
    building = false
    if (queued) {
      queued = false
      lintAndBuild()
    }
    return
  }

  console.log('✓  Lint passed — building…')
  const buildCode = await run(buildScript)
  const elapsed = Math.round(performance.now() - start)

  if (buildCode === 0) {
    console.log(`✓  Rebuilt in ${elapsed}ms`)
  } else {
    console.log(`✗  Build failed (exit ${buildCode}) after ${elapsed}ms`)
  }

  building = false
  if (queued) {
    queued = false
    lintAndBuild()
  }
}

let debounceTimer: ReturnType<typeof setTimeout> | null = null

watch(srcDir, { recursive: true }, (_event, filename) => {
  if (!filename?.endsWith('.json')) return
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(lintAndBuild, 200)
})

console.log(`👀 Watching ${srcDir} for changes…`)
console.log('   Edit any .json token file → lint → build → manifest updated on localhost:3456\n')

lintAndBuild()
