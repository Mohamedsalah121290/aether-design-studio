import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Hr,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface BaseLayoutProps {
  preview: string
  children: React.ReactNode
}

const LOGO_URL =
  'https://pilskrumnpvnvtkadbez.supabase.co/storage/v1/object/public/email-assets/logo.png?v=1'

export const BaseLayout = ({ preview, children }: BaseLayoutProps) => (
  <Html>
    <Head />
    <Preview>{preview}</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header */}
        <Section style={header}>
          <Img src={LOGO_URL} alt="AI DEALS" width="48" height="48" style={logo} />
          <Text style={brandName}>AI DEALS</Text>
        </Section>

        <Hr style={divider} />

        {/* Content */}
        <Section style={content}>{children}</Section>

        <Hr style={divider} />

        {/* Footer */}
        <Section style={footer}>
          <Text style={footerText}>
            © {new Date().getFullYear()} AI DEALS. All rights reserved.
          </Text>
          <Text style={footerMuted}>
            You received this email because you have an account with AI DEALS. If you didn't
            request this, you can safely ignore it.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default BaseLayout

/* ── Styles ── */

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
}

const container = {
  maxWidth: '520px',
  margin: '0 auto',
  padding: '40px 24px',
}

const header = {
  textAlign: 'center' as const,
  paddingBottom: '24px',
}

const logo = {
  margin: '0 auto 12px',
  borderRadius: '12px',
}

const brandName = {
  fontSize: '22px',
  fontWeight: '700',
  color: '#0A0D1A',
  margin: '0',
  letterSpacing: '-0.5px',
}

const divider = {
  borderColor: '#E5E7EB',
  margin: '0',
}

const content = {
  padding: '32px 0',
}

const footer = {
  paddingTop: '24px',
  textAlign: 'center' as const,
}

const footerText = {
  fontSize: '13px',
  color: '#6B7280',
  margin: '0 0 8px',
}

const footerMuted = {
  fontSize: '12px',
  color: '#9CA3AF',
  margin: '0',
  lineHeight: '18px',
}
