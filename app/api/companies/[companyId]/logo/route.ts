import { getDb } from "@/lib/db"
import type { CompanyLogoDoc } from "@/server/models"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ companyId: string }> }
) {
  const { companyId } = await params
  const db = await getDb()
  const doc = await db
    .collection<CompanyLogoDoc>("company_logos")
    .findOne({ _id: companyId })
  if (!doc) return new Response("Not found", { status: 404 })

  return new Response(new Uint8Array(doc.data.buffer), {
    headers: {
      "Content-Type": doc.type,
      // The URL carries ?v=<version>, so a changed logo gets a new URL.
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  })
}
