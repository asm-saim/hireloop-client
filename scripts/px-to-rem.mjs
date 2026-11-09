// Converts pixel values inside Tailwind arbitrary-value brackets (e.g. text-[56px],
// max-w-[1320px], grid-cols-[288px_1fr]) to rem, so they scale with the root font size.
// Usage: node scripts/px-to-rem.mjs        (run once from the project root)
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs"
import { join } from "node:path"

const DIRS = ["app", "components"]
const EXT = /\.(tsx|ts)$/
let files = 0
let values = 0

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) walk(path)
    else if (EXT.test(name)) convert(path)
  }
}

function convert(path) {
  const src = readFileSync(path, "utf8")
  const out = src.replace(/\[[^\]\n]*\]/g, (group) =>
    group.replace(/(-?\d*\.?\d+)px/g, (_, n) => {
      values++
      const rem = Math.round((Number(n) / 16) * 10000) / 10000
      return `${rem}rem`
    })
  )
  if (out !== src) {
    writeFileSync(path, out)
    files++
  }
}

for (const d of DIRS) walk(d)
console.log(`Converted ${values} values in ${files} files.`)
