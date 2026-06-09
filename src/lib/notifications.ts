export type BookingNotificationPayload = {
  bookingId: string
  bookingType: string
  customerName?: string | null
  customerEmail: string
  summary: string
  totalPrice: string
  dateRange: string
  status: string
}

export type PaymentConfirmationPayload = {
  customerName?: string | null
  customerEmail: string
  amount: number
  currency?: string
  paymentMethod: string
  status: string
  transactionReference: string
  bookingType: string
  bookingId?: string
}

import { sendBrandedEmail } from './emailService'

const emailJsServiceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
const emailJsTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const emailJsPublicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

export async function sendBookingNotification(payload: BookingNotificationPayload) {
  const branded = await sendBrandedEmail({
    to: payload.customerEmail,
    templateName: payload.bookingType === 'hotel' ? 'hotel_confirmation' : payload.bookingType === 'cargo' ? 'cargo_confirmation' : 'booking_confirmation',
    subject: `Booking update: ${payload.summary}`,
    intro: `Hi ${payload.customerName || 'traveler'}, your ${payload.bookingType} booking is currently ${payload.status}.`,
    details: `Booking ID: ${payload.bookingId}\nSummary: ${payload.summary}\nDates: ${payload.dateRange}\nTotal: ${payload.totalPrice}\nStatus: ${payload.status}`,
    ctaLabel: 'View booking',
    ctaUrl: 'https://sakhirtravelcargo.com/bookings',
    metadata: { booking_id: payload.bookingId, booking_type: payload.bookingType },
  })

  if (branded) return true

  if (!emailJsServiceId || !emailJsTemplateId || !emailJsPublicKey) {
    return false
  }

  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: emailJsServiceId,
        template_id: emailJsTemplateId,
        user_id: emailJsPublicKey,
        template_params: {
          to_name: payload.customerName ?? 'Traveler',
          to_email: payload.customerEmail,
          booking_id: payload.bookingId,
          booking_type: payload.bookingType,
          summary: payload.summary,
          total_price: payload.totalPrice,
          date_range: payload.dateRange,
          booking_status: payload.status,
        },
      }),
    })

    return response.ok
  } catch {
    return false
  }
}

export async function sendVisaStatusNotification(payload: {
  customerName?: string | null
  customerEmail: string
  applicationId: string
  status: string
  note?: string | null
}) {
  if (!emailJsServiceId || !emailJsTemplateId || !emailJsPublicKey) {
    return false
  }

  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: emailJsServiceId,
        template_id: emailJsTemplateId,
        user_id: emailJsPublicKey,
        template_params: {
          to_name: payload.customerName ?? 'Traveler',
          to_email: payload.customerEmail,
          booking_id: payload.applicationId,
          booking_type: 'Visa application',
          summary: `Your visa application status is now ${payload.status}.`,
          total_price: payload.note ?? 'No additional notes.',
          date_range: payload.status,
          booking_status: payload.status,
        },
      }),
    })

    return response.ok
  } catch {
    return false
  }
}

export async function sendPaymentConfirmation(payload: PaymentConfirmationPayload) {
  const branded = await sendBrandedEmail({
    to: payload.customerEmail,
    templateName: payload.status === 'refunded' ? 'refund_notification' : 'payment_receipt',
    subject: `Payment ${payload.status}: ${payload.transactionReference}`,
    intro: `Hi ${payload.customerName || 'traveler'}, your payment status is ${payload.status}.`,
    details: `Payment method: ${payload.paymentMethod}\nReference: ${payload.transactionReference}\nAmount: ${payload.amount} ${payload.currency ?? 'USD'}\nBooking type: ${payload.bookingType}`,
    ctaLabel: 'View payment history',
    ctaUrl: 'https://sakhirtravelcargo.com/payments',
    metadata: { payment_reference: payload.transactionReference, amount: payload.amount },
  })

  if (branded) return true

  if (!emailJsServiceId || !emailJsTemplateId || !emailJsPublicKey) {
    return false
  }

  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: emailJsServiceId,
        template_id: emailJsTemplateId,
        user_id: emailJsPublicKey,
        template_params: {
          to_name: payload.customerName ?? 'Traveler',
          to_email: payload.customerEmail,
          booking_id: payload.bookingId ?? 'N/A',
          booking_type: payload.bookingType,
          summary: `Payment ${payload.status} via ${payload.paymentMethod}`,
          total_price: `${payload.amount} ${payload.currency ?? 'USD'}`,
          date_range: payload.transactionReference,
          booking_status: payload.status,
        },
      }),
    })

    return response.ok
  } catch {
    return false
  }
}
