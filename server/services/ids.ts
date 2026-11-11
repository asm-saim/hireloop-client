import { randomBytes } from "node:crypto"

export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40)
}

/** "senior-designer-a1b2c3": readable, unique enough, safe in a URL. */
export function makeId(text: string) {
  return `${slugify(text) || "item"}-${randomBytes(3).toString("hex")}`
}
