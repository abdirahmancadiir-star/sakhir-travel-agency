import { MessageCircle, Phone } from 'lucide-react'
import { getWhatsAppSettings, openWhatsApp } from '../lib/whatsapp'

function WhatsAppFloating() {
  const settings = getWhatsAppSettings()

  return (
    <div className="fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-3">
      <a
        href={`https://wa.me/${settings.number.replace(/[^0-9]/g, '')}`}
        target="_blank"
        rel="noreferrer"
        className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-50 shadow-lg shadow-emerald-500/10 backdrop-blur-md hover:bg-emerald-500/20"
      >
        <span className="flex items-center gap-2"><Phone className="h-4 w-4" /> One-click contact</span>
      </a>
      <button
        type="button"
        onClick={() => openWhatsApp('Hello, I would like to speak with Sakhir Travel & Cargo.')} 
        className="flex items-center gap-3 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-slate-950 shadow-[0_18px_35px_-20px_rgba(37,211,102,0.8)] transition hover:scale-[1.02] hover:bg-[#1eb95d]"
      >
        <MessageCircle className="h-5 w-5" />
        WhatsApp us
      </button>
    </div>
  )
}

export default WhatsAppFloating
