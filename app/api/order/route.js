import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req) {
  const body = await req.json()

  const { error } = await supabase
    .from('orders')
    .insert({ ...body, status: 'new' })

  if (error) return Response.json({ error: error.message }, { status: 500 })

  const { data: emailData, error: emailError } = await resend.emails.send({
    from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
    to: process.env.NOTIFY_EMAIL,
    subject: `New order from ${body.name}`,
    html: `<h2>New Order 🎀</h2>
      <p><b>Name:</b> ${body.name}</p>
      <p><b>Contact:</b> ${body.contact}</p>
      <p><b>Phone:</b> ${body.phone_model}</p>
      <p><b>Tier:</b> ${body.tier}</p>
      <p><b>Shipping:</b> ${body.shipping}</p>
      <p><b>Notes:</b> ${body.colors || 'None'}</p>`,
  }).catch(err => {
    console.error('[Resend] Failed to send email:', err)
    return { data: null, error: err }
  })

  if (emailError) {
    console.error('[Resend] Email error:', emailError)
  } else {
    console.log('[Resend] Email sent successfully, id:', emailData?.id)
  }

  return Response.json({ ok: true, emailSent: !emailError })
}
