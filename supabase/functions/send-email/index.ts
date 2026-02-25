import React from 'npm:react@18.3.1'
import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0'
import { Resend } from 'npm:resend@4.0.0'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import { MagicLinkEmail } from './_templates/magic-link.tsx'
import { PasswordResetEmail } from './_templates/password-reset.tsx'
import { EmailVerificationEmail } from './_templates/email-verification.tsx'

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string)
const hookSecret = Deno.env.get('SEND_EMAIL_HOOK_SECRET') as string

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('not allowed', { status: 400 })
  }

  const payload = await req.text()
  const headers = Object.fromEntries(req.headers)
  const wh = new Webhook(hookSecret)

  try {
    const {
      user,
      email_data: { token, token_hash, redirect_to, email_action_type },
    } = wh.verify(payload, headers) as {
      user: { email: string }
      email_data: {
        token: string
        token_hash: string
        redirect_to: string
        email_action_type: string
        site_url: string
        token_new: string
        token_hash_new: string
      }
    }

    // Pick the right template and subject based on action type
    let EmailTemplate: React.FC<any>
    let subject: string

    switch (email_action_type) {
      case 'recovery':
        EmailTemplate = PasswordResetEmail
        subject = 'Reset your AI DEALS password'
        break
      case 'signup':
      case 'email':
        EmailTemplate = EmailVerificationEmail
        subject = 'Verify your AI DEALS email'
        break
      case 'magiclink':
        EmailTemplate = MagicLinkEmail
        subject = 'Your AI DEALS sign-in link'
        break
      case 'email_change':
        EmailTemplate = EmailVerificationEmail
        subject = 'Confirm your new email — AI DEALS'
        break
      default:
        EmailTemplate = MagicLinkEmail
        subject = 'AI DEALS — Action Required'
    }

    const html = await renderAsync(
      React.createElement(EmailTemplate, {
        supabase_url: Deno.env.get('SUPABASE_URL') ?? '',
        token,
        token_hash,
        redirect_to,
        email_action_type,
      })
    )

    const { error } = await resend.emails.send({
      from: 'AI DEALS <noreply@resend.dev>',
      to: [user.email],
      subject,
      html,
    })

    if (error) {
      throw error
    }
  } catch (error: any) {
    console.error('Error sending email:', error)
    return new Response(
      JSON.stringify({
        error: { http_code: error.code, message: error.message },
      }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    )
  }

  return new Response(JSON.stringify({}), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
})
