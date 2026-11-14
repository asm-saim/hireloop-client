import { handleStripeEvent } from "@/server/services/billing"
import { getStripe } from "@/server/services/stripe"

/** Stripe calls this URL. The signature is verified before anything is trusted. */
export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret)
    return new Response("Webhook secret is not configured", { status: 500 })

  const signature = req.headers.get("stripe-signature")
  if (!signature) return new Response("Missing signature", { status: 400 })

  // The raw body is required for signature verification.
  const body = await req.text()
  let event
  try {
    event = getStripe().webhooks.constructEvent(body, signature, secret)
  } catch {
    return new Response("Invalid signature", { status: 400 })
  }

  try {
    await handleStripeEvent(event)
  } catch (e) {
    console.error("[stripe webhook] handler failed", event.type, e)
    // A 500 makes Stripe retry later.
    return new Response("Handler error", { status: 500 })
  }
  return Response.json({ received: true })
}
