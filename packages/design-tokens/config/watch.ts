import { watch } from 'node:fs'
import { resolve } from 'node:path'

const srcDir = resolve(import.meta.dirname, '..', 'src')
const buildScript = resolve(import.meta.dirname, 'build.ts')

let building = false
let queued = false

async function runBuild() {
  if (building) {
    queued = true
    return
  }

  building = true
  const start = performance.now()
  console.log('\n⟳  Change detected — rebuilding tokens…')

  const proc = Bun.spawn(['bun', 'run', buildScript], {
    stdout: 'inherit',
    stderr: 'inherit',
  })
  const code = await proc.exited

  const elapsed = Math.round(performance.now() - start)

  if (code === 0) {
    console.log(`✓  Rebuilt in ${elapsed}ms`)
  } else {
    console.log(`✗  Build failed (exit ${code}) after ${elapsed}ms`)
  }

  building = false
  if (queued) {
    queued = false
    runBuild()
  }
}

let debounceTimer: ReturnType<typeof setTimeout> | null = null

watch(srcDir, { recursive: true }, (_event, filename) => {
  if (!filename?.endsWith('.json')) return
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(runBuild, 200)
})

console.log(`👀 Watching ${srcDir} for changes…`)
console.log('   Edit any .json token file → auto-rebuild → manifest updated on localhost:3456\n')

runBuild()
