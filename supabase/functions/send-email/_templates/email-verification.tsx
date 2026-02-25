import {
  Heading,
  Text,
  Button,
  Section,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'
import { BaseLayout } from './base-layout.tsx'

interface EmailVerificationProps {
  supabase_url: string
  email_action_type: string
  redirect_to: string
  token_hash: string
  token: string
}

export const EmailVerificationEmail = ({
  token,
  supabase_url,
  email_action_type,
  redirect_to,
  token_hash,
}: EmailVerificationProps) => {
  const actionUrl = `${supabase_url}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`

  return (
    <BaseLayout preview="Verify your AI DEALS email address">
      <Heading style={heading}>Verify Your Email</Heading>
      <Text style={paragraph}>
        Welcome to AI DEALS! Please confirm your email address by clicking the button below.
      </Text>

      <Section style={buttonContainer}>
        <Button href={actionUrl} style={button}>
          Verify Email →
        </Button>
      </Section>

      <Text style={altText}>
        Or copy and paste this code:
      </Text>
      <code style={codeBlock}>{token}</code>

      <Text style={muted}>
        If you didn't create an account with AI DEALS, you can safely ignore this email.
      </Text>
    </BaseLayout>
  )
}

export default EmailVerificationEmail

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
