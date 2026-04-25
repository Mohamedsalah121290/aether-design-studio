import { getStripeLink } from './stripeLinks';

const PLAN_NAME_BY_ID: Record<string, string> = {
  'canva:team_admin': 'Canva Team Admin 1 Year',
  'capcut:personal_1m': 'CapCut Pro Personal 1 Month',
  'chatgpt:ready_account': 'ChatGPT Ready Account 1 Month',
  'chatgpt:business': 'ChatGPT Business 4 invites',
  'coursera:plus_upgrade': 'Coursera Plus 1 Year',
  'elevenlabs:creator_1m': 'ElevenLabs Creator 1 Month',
  'eset:key_1y': 'ESET Internet Security 1 Year',
  'grok:supergrok_1m': 'Grok SuperGrok 1 Month',
  'linkedin:career_3m': 'LinkedIn Premium Career 3 Months',
  'lovable:pro_monthly': 'Lovable Pro 1 Month',
  'lovable:lovable_2_months': 'Lovable 2 Months Plan',
  'lovable:lovable_3_months': 'Lovable 3 Months Plan',
  'microsoft_365:365_1year': 'Microsoft Office 365 1 Year',
  'microsoft_365:365_lifetime': 'Microsoft Office 365 Lifetime',
  'notion:edu_plus_1y': 'Notion Education Plus 1 Year',
  'microsoft_office:pro_plus_key': 'Office Pro Plus Key',
  'perplexity:pro_1y': 'Perplexity Pro 1 Year',
  'windows:retail_online': 'Windows 10 11 Pro Retail Online',
  'windows_home:retail_online': 'Windows 10 11 Key Home',
  'windows_server:server_key': 'Windows Server Key',
  'zoom:pro_28d': 'Zoom Pro 28 Days',
};

export const getStripePaymentLink = (toolId?: string, planId?: string, email?: string) => {
  if (!toolId || !planId) return null;

  return getStripeLink(toolId, PLAN_NAME_BY_ID[`${toolId}:${planId}`] || planId, email);
};