import { useMemo, useState } from 'react'
import { ArrowRight, Bot } from 'lucide-react'

const promptCards = [
  'Best luxury city break under $2,500',
  'Reliable cargo quote for Nairobi–Dubai',
  'Visa-ready itinerary for Turkey and UAE',
  'Family-friendly Umrah packages with comfort',
]

function TravelAssistant() {
  const [selectedPrompt, setSelectedPrompt] = useState(promptCards[0])

  const preview = useMemo(() => {
    if (selectedPrompt.includes('cargo')) return 'Our logistics team can prepare an air or road freight estimate for your route, including handling, insurance, and timeline guidance.'
    if (selectedPrompt.includes('Visa')) return 'We can outline the required documents, processing time, and support for your visa application before you travel.'
    if (selectedPrompt.includes('Umrah')) return 'We recommend premium hotel blocks, transport coordination, and guided pilgrimage support for a smoother journey.'
    return 'This recommendation blends premium hotel options, direct flight availability, and concierge support for a polished trip plan.'
  }, [selectedPrompt])

  return (
    <section className="mx-auto max-w-[1400px] px-6 pb-16 lg:px-8">
      <article className="rounded-[2rem] border border-[#F59E0B]/20 bg-[linear-gradient(135deg,#111827_0%,#172554_45%,#111827_100%)] p-8 shadow-[0_35px_90px_-55px_rgba(245,158,11,0.35)] lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-[#F59E0B]">AI Travel Assistant</p>
            <h2 className="mt-4 text-3xl font-semibold text-white">Plan smarter with concierge-style recommendations.</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-200">
              Choose a quick scenario and receive a tailored travel suggestion for flights, hotels, visas, or cargo logistics.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {promptCards.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => setSelectedPrompt(prompt)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    selectedPrompt === prompt
                      ? 'border-[#F59E0B] bg-[#F59E0B]/15 text-[#F59E0B]'
                      : 'border-white/10 bg-white/5 text-slate-200 hover:border-white/20 hover:bg-white/10'
                  }`}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/95 p-6 shadow-[0_30px_90px_-55px_rgba(15,23,42,0.6)]">
            <div className="flex items-center gap-3 text-[#F59E0B]">
              <Bot className="h-5 w-5" />
              <p className="text-xs uppercase tracking-[0.32em]">Recommendation preview</p>
            </div>
            <p className="mt-4 text-lg font-semibold text-white">{selectedPrompt}</p>
            <p className="mt-4 text-sm leading-7 text-slate-200">{preview}</p>
            <div className="mt-6 space-y-3 text-sm text-slate-100">
              <div className="rounded-[1.25rem] border border-emerald-400/20 bg-emerald-500/10 p-4">Fast response time, verified partner options, and premium itinerary support.</div>
              <div className="rounded-[1.25rem] border border-sky-400/20 bg-sky-500/10 p-4">Use the assistant to shortlist destinations, visas, and cargo routes before a call back.</div>
            </div>
            <button
              type="button"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#F59E0B] px-5 py-3 text-sm font-semibold text-[#0F172A] transition hover:bg-[#d48706]"
            >
              Talk with our travel advisor
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </article>
    </section>
  )
}

export default TravelAssistant
