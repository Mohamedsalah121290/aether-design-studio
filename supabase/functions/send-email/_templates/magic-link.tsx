import {
  Heading,
  Link,
  Text,
  Button,
  Section,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'
import { BaseLayout } from './base-layout.tsx'

interface MagicLinkEmailProps {
  supabase_url: string
  email_action_type: string
  redirect_to: string
  token_hash: string
  token: string
}

export const MagicLinkEmail = ({
  token,
  supabase_url,
  email_action_type,
  redirect_to,
  token_hash,
}: MagicLinkEmailProps) => {
  const actionUrl = `${supabase_url}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`

  return (
    <BaseLayout preview="Your magic link to sign in to AI DEALS">
      <Heading style={heading}>Sign in to AI DEALS</Heading>
      <Text style={paragraph}>
        Click the button below to securely sign in to your account. This link expires in 1 hour.
      </Text>

      <Section style={buttonContainer}>
        <Button href={actionUrl} style={button}>
          Sign In →
        </Button>
      </Section>

      <Text style={altText}>
        Or copy and paste this code:
      </Text>
      <code style={codeBlock}>{token}</code>

      <Text style={muted}>
        If you didn't request this email, you can safely ignore it.
      </Text>
    </BaseLayout>
  )
}

export default MagicLinkEmail

const heading = {
  fontSize: '24px',
  fontWeight: '700',
  color: '#0A0D1A',
  margin: '0 0 16px',
  letterSpacing: '-0.5px',
}

const paragraph = {
  fontSize: '15px',
  color: '#374151',
  lineHeight: '24px',
  margin: '0 0 28px',
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '0 0 28px',
}

const button = {
  backgroundColor: '#6C3FA0',
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: '600',
  padding: '14px 32px',
  borderRadius: '12px',
  textDecoration: 'none',
  display: 'inline-block',
}

const altText = {
  fontSize: '13px',
  color: '#6B7280',
  margin: '0 0 12px',
  textAlign: 'center' as const,
}

const codeBlock = {
  display: 'block',
  textAlign: 'center' as const,
  padding: '16px',
  backgroundColor: '#F3F4F6',
  borderRadius: '8px',
  border: '1px solid #E5E7EB',
  color: '#0A0D1A',
  fontSize: '18px',
  fontWeight: '600',
  letterSpacing: '4px',
  margin: '0 0 28px',
}

const muted = {
  fontSize: '13px',
  color: '#9CA3AF',
  margin: '0',
  textAlign: 'center' as const,
}
