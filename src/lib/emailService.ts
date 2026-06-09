import { supabase } from './supabase'

export type EmailTemplateName =
  | 'welcome'
  | 'account_verification'
  | 'booking_confirmation'
  | 'ticket_issued'
  | 'booking_cancellation'
  | 'hotel_confirmation'
  | 'checkin_reminder'
  | 'tour_confirmation'
  | 'travel_reminder'
  | 'cargo_confirmation'
  | 'cargo_status'
  | 'delivery_notification'
  | 'visa_received'
  | 'visa_status'
  | 'visa_decision'
  | 'payment_receipt'
  | 'payment_success'
  | 'refund_notification'
  | 'admin_alert'

export type EmailStatus = 'queued' | 'sent' | 'failed' | 'pending'

export type EmailLogEntry = {
  id: string
  recipient_email: string
  template_name: string
  subject: string
  provider: string
  status: EmailStatus
  message?: string | null
  metadata?: Record<string, unknown>
  created_at?: string
  sent_at?: string | null
}

const COMPANY_NAME = 'Sakhir Travel & Cargo'
const COMPANY_CONTACT = '+254 722 231 116'
const COMPANY_EMAIL = 'support@sakhirtravelcargo.com'
const LOGO_URL = 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&w=240&q=80'

function brandHtml(title: string, intro: string, details: string, ctaLabel = 'Open dashboard', ctaUrl = 'https://sakhirtravelcargo.com') {
  return `
    <div style="font-family: Arial, Helvetica, sans-serif; background-color:#07111f; padding:24px; color:#e5eefb;">
      <table role="presentation" width="100%" style="max-width:640px; margin:0 auto; border-collapse:collapse; background-color:#0f172a; border:1px solid #1e293b; border-radius:18px; overflow:hidden;">
        <tr>
          <td style="padding:24px 24px 12px; background:linear-gradient(135deg, #111827 0%, #172554 100%);">
            <img src="${LOGO_URL}" alt="Sakhir Travel & Cargo" style="width:64px; height:64px; border-radius:16px; display:block;" />
            <h1 style="font-size:26px; line-height:1.2; margin:16px 0 6px; color:#fff;">${COMPANY_NAME}</h1>
            <p style="font-size:13px; text-transform:uppercase; letter-spacing:0.24em; color:#fbbf24; margin:0;">Travel • Cargo • Visa</p>
          </td>
        </tr>
        <tr>
          <td style="padding:24px;">
            <h2 style="font-size:20px; margin:0 0 10px; color:#fff;">${title}</h2>
            <p style="font-size:15px; line-height:1.6; color:#dbe4f0; margin:0 0 18px;">${intro}</p>
            <div style="background:#111827; border:1px solid #1f2937; border-radius:14px; padding:16px; color:#e5eefb; font-size:14px; line-height:1.6;">${details}</div>
            <p style="margin-top:18px;"><a href="${ctaUrl}" style="display:inline-block; background:#f59e0b; color:#111827; text-decoration:none; border-radius:999px; padding:12px 18px; font-weight:700;">${ctaLabel}</a></p>
          </td>
        </tr>
        <tr>
          <td style="padding:18px 24px 24px; font-size:12px; color:#cbd5e1; border-top:1px solid #1f2937;">
            <p style="margin:0 0 6px;">Need help? Contact ${COMPANY_EMAIL} or call ${COMPANY_CONTACT}.</p>
            <p style="margin:0;">This email was generated automatically for your Sakhir Travel & Cargo account.</p>
          </td>
        </tr>
      </table>
    </div>
  `
}

function normalizeRecipient(email: string) {
  return email.trim().toLowerCase()
}

async function logEmailEvent(recipient: string, templateName: string, subject: string, provider: string, status: EmailStatus, message: string | null, metadata: Record<string, unknown> = {}) {
  await supabase.from('email_history').insert({
    recipient_email: normalizeRecipient(recipient),
    template_name: templateName,
    subject,
    provider,
    status,
    message,
    metadata,
    sent_at: status === 'sent' ? new Date().toISOString() : null,
  })
}

async function resolveProvider(preferredProvider?: string) {
  const resendApiKey = import.meta.env.VITE_RESEND_API_KEY
  const sendgridApiKey = import.meta.env.VITE_SENDGRID_API_KEY
  const smtpHost = import.meta.env.VITE_SMTP_HOST

  if (preferredProvider) return preferredProvider
  if (resendApiKey) return 'resend'
  if (sendgridApiKey) return 'sendgrid'
  if (smtpHost) return 'smtp'
  return 'emailjs'
}

async function sendWithResend(to: string[], subject: string, html: string, text: string) {
  const apiKey = import.meta.env.VITE_RESEND_API_KEY
  const fromEmail = import.meta.env.VITE_RESEND_FROM_EMAIL || 'onboarding@resend.dev'

  if (!apiKey) return { ok: false, error: 'Resend API key not configured.' }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: `Sakhir Travel & Cargo <${fromEmail}>`,
      to,
      subject,
      html,
      text,
    }),
  })

  const data = await response.json().catch(() => ({}))
  return response.ok ? { ok: true, data } : { ok: false, error: data?.message || 'Resend request failed.' }
}

async function sendWithSendGrid(to: string[], subject: string, html: string, text: string) {
  const apiKey = import.meta.env.VITE_SENDGRID_API_KEY
  const fromEmail = import.meta.env.VITE_SENDGRID_FROM_EMAIL || 'support@sakhirtravelcargo.com'

  if (!apiKey) return { ok: false, error: 'SendGrid API key not configured.' }

  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [{ to: to.map((email) => ({ email })) }],
      from: { email: fromEmail, name: COMPANY_NAME },
      subject,
      content: [
        { type: 'text/plain', value: text },
        { type: 'text/html', value: html },
      ],
    }),
  })

  return response.status === 202 || response.ok ? { ok: true } : { ok: false, error: `SendGrid request failed (${response.status}).` }
}

async function sendWithSMTP(to: string[], subject: string, html: string, text: string) {
  const host = import.meta.env.VITE_SMTP_HOST
  const port = Number(import.meta.env.VITE_SMTP_PORT || 587)
  const secure = String(import.meta.env.VITE_SMTP_SECURE || 'false') === 'true'
  const user = import.meta.env.VITE_SMTP_USER
  const pass = import.meta.env.VITE_SMTP_PASS

  if (!host || !user || !pass) {
    return { ok: false, error: 'SMTP settings are not configured.' }
  }

  const { default: nodemailer } = await import('nodemailer')

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  })

  await transporter.sendMail({
    from: import.meta.env.VITE_SMTP_FROM_EMAIL || COMPANY_EMAIL,
    to,
    subject,
    text,
    html,
  })

  return { ok: true }
}

export async function sendBrandedEmail(options: {
  to: string
  templateName: EmailTemplateName
  subject: string
  intro: string
  details: string
  ctaLabel?: string
  ctaUrl?: string
  provider?: string
  metadata?: Record<string, unknown>
}) {
  const to = normalizeRecipient(options.to)
  const provider = await resolveProvider(options.provider)

  const html = brandHtml(options.subject, options.intro, options.details, options.ctaLabel, options.ctaUrl)
  const text = `${options.subject}\n\n${options.intro}\n\n${options.details}`

  await logEmailEvent(to, options.templateName, options.subject, provider, 'queued', 'Email dispatch in progress.', options.metadata)

  try {
    let result

    if (provider === 'resend') {
      result = await sendWithResend([to], options.subject, html, text)
    } else if (provider === 'sendgrid') {
      result = await sendWithSendGrid([to], options.subject, html, text)
    } else if (provider === 'smtp') {
      result = await sendWithSMTP([to], options.subject, html, text)
    } else {
      // Fallback to the existing EmailJS-based route for browser compatibility.
      const emailJsServiceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
      const emailJsTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
      const emailJsPublicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

      if (!emailJsServiceId || !emailJsTemplateId || !emailJsPublicKey) {
        throw new Error('No email provider is configured. Configure Resend, SendGrid, SMTP, or EmailJS.')
      }

      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: emailJsServiceId,
          template_id: emailJsTemplateId,
          user_id: emailJsPublicKey,
          template_params: {
            to_email: to,
            subject: options.subject,
            message: options.intro,
            summary: options.details,
            to_name: to,
          },
        }),
      })

      result = response.ok ? { ok: true } : { ok: false, error: 'EmailJS request failed.' }
    }

    if (!result.ok) {
      await logEmailEvent(to, options.templateName, options.subject, provider, 'failed', result.error || 'Email delivery failed.', options.metadata)
      return false
    }

    await logEmailEvent(to, options.templateName, options.subject, provider, 'sent', 'Email delivered successfully.', options.metadata)
    return true
  } catch (error) {
    await logEmailEvent(to, options.templateName, options.subject, provider, 'failed', error instanceof Error ? error.message : 'Unknown email error.', options.metadata)
    return false
  }
}

export async function sendWelcomeEmail(to: string, name: string) {
  return sendBrandedEmail({
    to,
    templateName: 'welcome',
    subject: 'Welcome to Sakhir Travel & Cargo',
    intro: `Hi ${name || 'traveler'}, welcome aboard. Your premium travel, cargo, hotel, and visa workspace is ready to use.`,
    details: 'You can now manage bookings, cargo requests, visa applications, and payment updates in one place. If you need help, our concierge team is available around the clock.',
    ctaLabel: 'Open your dashboard',
    ctaUrl: 'https://sakhirtravelcargo.com',
    metadata: { user_name: name },
  })
}

export async function sendAccountVerificationEmail(to: string, name: string) {
  return sendBrandedEmail({
    to,
    templateName: 'account_verification',
    subject: 'Verify your Sakhir Travel & Cargo account',
    intro: `Hello ${name || 'traveler'}, please verify your account to unlock all concierge features.`,
    details: 'Verification confirms that your emails are reachable and helps us keep your bookings, cargo updates, payments, and visa documents secure.',
    ctaLabel: 'Verify account',
    ctaUrl: 'https://sakhirtravelcargo.com/login',
    metadata: { user_name: name },
  })
}

export async function sendFlightBookingEmail(to: string, name: string, reference: string, status: string) {
  return sendBrandedEmail({
    to,
    templateName: 'booking_confirmation',
    subject: `Flight booking ${status.toUpperCase()} | ${reference}`,
    intro: `Hi ${name || 'traveler'}, we have updated your flight reservation.` ,
    details: `Your booking reference is ${reference}. We will send ticket updates, itinerary changes, and payment confirmations to this email address.`,
    ctaLabel: 'View booking details',
    ctaUrl: 'https://sakhirtravelcargo.com/bookings',
    metadata: { booking_reference: reference, booking_type: 'flight' },
  })
}

export async function sendHotelConfirmationEmail(to: string, name: string, hotelName: string, reference: string) {
  return sendBrandedEmail({
    to,
    templateName: 'hotel_confirmation',
    subject: `Hotel booking confirmed: ${hotelName}`,
    intro: `Hi ${name || 'traveler'}, your stay at ${hotelName} is confirmed.`,
    details: `Booking reference: ${reference}. Check your booking dashboard for room details, check-in timing, and cancellation policies.`,
    ctaLabel: 'Manage your booking',
    ctaUrl: 'https://sakhirtravelcargo.com/bookings',
    metadata: { booking_reference: reference, booking_type: 'hotel' },
  })
}

export async function sendTourReminderEmail(to: string, name: string, tourName: string) {
  return sendBrandedEmail({
    to,
    templateName: 'travel_reminder',
    subject: `Travel reminder: ${tourName}`,
    intro: `Hi ${name || 'traveler'}, this is a reminder for your upcoming tour.`,
    details: 'Please confirm your departure schedule, travel documents, and contact details before you travel.',
    ctaLabel: 'View itinerary',
    ctaUrl: 'https://sakhirtravelcargo.com/tours',
    metadata: { tour_name: tourName },
  })
}

export async function sendCargoUpdateEmail(to: string, name: string, status: string, reference: string) {
  return sendBrandedEmail({
    to,
    templateName: status === 'delivered' ? 'delivery_notification' : 'cargo_status',
    subject: `Cargo update: ${status} (${reference})`,
    intro: `Hi ${name || 'traveler'}, your cargo shipment status is now ${status}.`,
    details: `Reference: ${reference}. Our logistics team keeps you informed on route changes, handling milestones and final delivery updates.`,
    ctaLabel: 'Track your shipment',
    ctaUrl: 'https://sakhirtravelcargo.com/track',
    metadata: { shipment_reference: reference, shipment_status: status },
  })
}

export async function sendVisaStatusEmail(to: string, name: string, status: string, reference: string) {
  return sendBrandedEmail({
    to,
    templateName: status === 'approved' || status === 'rejected' ? 'visa_decision' : 'visa_status',
    subject: `Visa status update: ${status}`,
    intro: `Hi ${name || 'traveler'}, your visa application status has changed to ${status}.`,
    details: `Application reference: ${reference}. Please review the latest update in your visa dashboard and upload any missing documents if requested.`,
    ctaLabel: 'Open visa dashboard',
    ctaUrl: 'https://sakhirtravelcargo.com/visa',
    metadata: { visa_reference: reference, status },
  })
}

export async function sendPaymentReceiptEmail(to: string, name: string, amount: string, reference: string) {
  return sendBrandedEmail({
    to,
    templateName: 'payment_receipt',
    subject: `Payment receipt | ${reference}`,
    intro: `Hi ${name || 'traveler'}, your payment receipt is ready.`,
    details: `Receipt reference: ${reference}. Amount paid: ${amount}. This confirms your latest booking or cargo payment was received successfully.`,
    ctaLabel: 'Review payment history',
    ctaUrl: 'https://sakhirtravelcargo.com/payments',
    metadata: { payment_reference: reference, amount },
  })
}

export async function sendAdminAlertEmail(to: string, title: string, message: string) {
  return sendBrandedEmail({
    to,
    templateName: 'admin_alert',
    subject: title,
    intro: 'A new platform activity alert requires your attention.',
    details: message,
    ctaLabel: 'Open admin dashboard',
    ctaUrl: 'https://sakhirtravelcargo.com/dashboard',
    metadata: { recipient: to },
  })
}

export async function getEmailHistory(recipientEmail?: string) {
  let query = supabase.from('email_history').select('*').order('created_at', { ascending: false })
  if (recipientEmail) query = query.eq('recipient_email', normalizeRecipient(recipientEmail))
  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as EmailLogEntry[]
}
