import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { PrismaClient } from '@prisma/client'

export async function POST(req) {
  const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!SIGNING_SECRET) {
    throw new Error('Error: Please add CLERK_WEBHOOK_SECRET to .env file')
  }

  // Create a new Svix instance with the webhook secret
  const wh = new Webhook(SIGNING_SECRET)

  // Get request headers for verification
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing Svix headers', { status: 400 })
  }

  // Get the payload body from the request
  const payload = await req.json()
  const body = JSON.stringify(payload)

  let evt;

  // Verify the webhook payload
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    })
  } catch (err) {
    console.error('Error: Could not verify webhook:', err)
    return new Response('Error: Verification failed', { status: 400 })
  }

  // Log webhook payload for debugging
  const { id } = evt.data
  const eventType = evt.type
  console.log(`Received webhook with ID ${id} and event type ${eventType}`)
  console.log('Webhook payload:', body)

  // Handle the 'user.created' event
  if (evt.type === 'user.created') {
    console.log('userId:', evt.data.id)

    const prisma = new PrismaClient()
    // const email = user.

    // Create a new user record in the database
    await prisma.user.create({
      data: {
        id: evt.data.id,
        email: evt.data.email_addresses[0]?.email_address,
        // Default values or additional user properties can be added here
      },
    })
  }

  // Respond with success after processing the webhook
  return new Response('Webhook received', { status: 200 })
}
