import { Bot, Globe, MessageCircleMore, Send, ShieldCheck, Sparkles } from 'lucide-react'

const faqs = [
  'How do I track a booking status?',
  'Which documents are required for a visa application?',
  'Can I ask about cargo shipment timelines?',
  'Do you support multilingual support for Arabic, Somali and Turkish?',
]

const replyCards = [
  'Flight questions: real-time fare guidance and route options.',
  'Hotel questions: property availability and room recommendations.',
  'Visa questions: checklist support and document guidance.',
  'Cargo questions: status updates and delivery coordination help.',
]

export default function AISupportAssistant() {
  return (
    <section className="min-h-screen bg-[radial-gradient(circle_at_top,_#312e81_0%,_#111827_45%,_#020617_100%)] text-slate-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-10 lg:px-10">
        <div className="rounded-3xl border border-indigo-400/20 bg-white/5 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl lg:p-10">
          <p className="text-sm uppercase tracking-[0.35em] text-indigo-200">AI customer support assistant</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-black text-white lg:text-5xl">Provide 24/7 customer support across flights, hotels, visas, cargo and booking tracking.</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-300">The assistant is designed for website chat, WhatsApp, and multilingual customer service with FAQ automation and smart response paths.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <article className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <div className="flex items-center gap-3 text-indigo-200">
              <Bot className="h-6 w-6" />
              <h2 className="text-xl font-semibold">Live support widget</h2>
            </div>
            <div className="mt-6 rounded-3xl border border-indigo-400/20 bg-slate-950/80 p-5 shadow-xl shadow-black/30">
              <div className="flex items-center gap-3 text-slate-100">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-400/10 text-indigo-200">AI</div>
                <div>
                  <p className="text-sm text-slate-300">Support assistant</p>
                  <p className="text-xs uppercase tracking-[0.25em] text-indigo-200">Online</p>
                </div>
              </div>
              <div className="mt-5 space-y-3 text-sm text-slate-200">
                <div className="rounded-2xl bg-white/5 p-3">Hi, I can help with flight prices, hotel availability, visa guidance and cargo updates.</div>
                <div className="rounded-2xl bg-indigo-400/10 p-3 text-indigo-100">Can you check my booking reference?</div>
              </div>
              <div className="mt-5 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                <input className="flex-1 bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-400" placeholder="Type your travel question..." />
                <button type="button" aria-label="Send support message" className="rounded-xl bg-indigo-400/15 p-2 text-indigo-100"><Send className="h-4 w-4" /></button>
              </div>
            </div>
          </article>

          <article className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-6 shadow-2xl shadow-black/30">
            <div className="flex items-center gap-3 text-amber-200">
              <MessageCircleMore className="h-6 w-6" />
              <h2 className="text-xl font-semibold">WhatsApp & multilingual support</h2>
            </div>
            <div className="mt-5 space-y-4 text-sm text-slate-100">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">WhatsApp integration for quick customer replies and booking status updates.</div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Automatic language switching for English, Somali, Arabic and Turkish.</div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">FAQ pathways for common travel, visa and cargo questions.</div>
            </div>
          </article>
        </div>

        <article className="grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl lg:grid-cols-[1fr_1fr]">
          <div>
            <div className="flex items-center gap-3 text-indigo-200">
              <Globe className="h-6 w-6" />
              <h3 className="text-xl font-semibold">Capabilities</h3>
            </div>
            <div className="mt-4 space-y-3">
              {replyCards.map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-100">{item}</div>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-3 text-emerald-200">
              <ShieldCheck className="h-6 w-6" />
              <h3 className="text-xl font-semibold">FAQ response library</h3>
            </div>
            <div className="mt-4 space-y-3">
              {faqs.map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-100">{item}</div>
              ))}
            </div>
          </div>
        </article>

        <article className="rounded-3xl border border-indigo-400/20 bg-indigo-400/10 p-6 text-indigo-50 shadow-xl shadow-indigo-950/30">
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6" />
            <h2 className="text-xl font-semibold">Support outcome</h2>
          </div>
          <p className="mt-3 max-w-3xl text-sm text-indigo-50/90">Automate first-line support, improve response speed, and keep customers informed with AI assisted assistance around the clock.</p>
        </article>
      </div>
    </section>
  )
}
