export const DEFAULT_WHATSAPP_NUMBER = '+254722231116'

export const DEFAULT_WHATSAPP_TEMPLATES = {
  flight: 'Hello, I would like to book a flight.',
  hotel: 'Hello, I would like to book a hotel.',
  tour: 'Hello, I would like information about tour packages.',
  cargo: 'Hello, I would like a cargo shipping quotation.',
  visa: 'Hello, I would like assistance with a visa application.',
}

export type WhatsAppSettings = {
  number: string
  templates: typeof DEFAULT_WHATSAPP_TEMPLATES
}

const STORAGE_KEY = 'sakhir_whatsapp_settings'

export function getWhatsAppSettings(): WhatsAppSettings {
  if (typeof window === 'undefined') {
    return { number: DEFAULT_WHATSAPP_NUMBER, templates: DEFAULT_WHATSAPP_TEMPLATES }
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      return { number: DEFAULT_WHATSAPP_NUMBER, templates: DEFAULT_WHATSAPP_TEMPLATES }
    }

    const parsed = JSON.parse(stored) as Partial<WhatsAppSettings>
    return {
      number: parsed.number || DEFAULT_WHATSAPP_NUMBER,
      templates: {
        ...DEFAULT_WHATSAPP_TEMPLATES,
        ...(parsed.templates || {}),
      },
    }
  } catch {
    return { number: DEFAULT_WHATSAPP_NUMBER, templates: DEFAULT_WHATSAPP_TEMPLATES }
  }
}

export function saveWhatsAppSettings(settings: WhatsAppSettings) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
}

export function openWhatsApp(message: string, number = getWhatsAppSettings().number) {
  const cleanNumber = number.replace(/[^0-9]/g, '')
  const encoded = encodeURIComponent(message)
  window.open(`https://wa.me/${cleanNumber}?text=${encoded}`, '_blank', 'noopener,noreferrer')
}

export const inquiryLogSeed = [
  { id: 'INQ-1001', service: 'Flight', message: DEFAULT_WHATSAPP_TEMPLATES.flight, status: 'New', time: 'Just now' },
  { id: 'INQ-1002', service: 'Cargo', message: DEFAULT_WHATSAPP_TEMPLATES.cargo, status: 'Responded', time: '8 min ago' },
  { id: 'INQ-1003', service: 'Visa', message: DEFAULT_WHATSAPP_TEMPLATES.visa, status: 'Pending', time: '25 min ago' },
]
