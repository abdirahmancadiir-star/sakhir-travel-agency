import { useState } from 'react'
import { Mail, MapPin } from 'lucide-react'
import { supabase } from '../lib/supabase'

function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const { error } = await supabase.from('contact_messages').insert({ name, email, phone, subject, message })
    if (error) {
      setStatus('Failed to send your message. Please try again.')
      return
    }
    setStatus('Message sent successfully. We will contact you soon.')
    setName('')
    setEmail('')
    setPhone('')
    setSubject('')
    setMessage('')
  }

  return (
    <section className="space-y-10">
      <div className="overflow-hidden brand-shell px-8 py-12 text-white shadow-[0_35px_90px_-40px_rgba(15,23,42,0.22)] sm:px-12 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm uppercase tracking-[0.32em] text-amber-400">Contact & Concierge</p>
          <div className="mt-4 grid gap-8 lg:grid-cols-[1.7fr_1fr] lg:items-end">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">Talk with our travel experts</h1>
              <p className="mt-5 max-w-2xl text-slate-300">Whether you need destination planning, cargo logistics, visa support or booking concierge service, our premium team is ready to design your next exceptional trip.</p>
            </div>
            <div className="rounded-[2rem] bg-white/10 p-6 text-slate-100 ring-1 ring-white/10 backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.3em] text-amber-200">Fast response</p>
              <p className="mt-3 text-3xl font-semibold">Within 2 hours</p>
              <p className="mt-3 text-sm text-slate-300">Premium support from our travel planning desk.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="brand-shell p-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-amber-500">Send a request</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-900">Custom itinerary inquiry</h2>
            </div>
            <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">Priority service</div>
          </div>

          {status && <div className="mt-8 rounded-3xl bg-emerald-50 p-4 text-sm text-emerald-700">{status}</div>}
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="grid gap-5 md:grid-cols-2">
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Full name"
                required
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none transition focus:border-slate-900"
              />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email address"
                required
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none transition focus:border-slate-900"
              />
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <input
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="Phone number"
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none transition focus:border-slate-900"
              />
              <input
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                placeholder="Subject"
                required
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none transition focus:border-slate-900"
              />
            </div>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              rows={5}
              placeholder="Tell us about your travel plans"
              required
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none transition focus:border-slate-900"
            />
            <button type="submit" className="btn-primary w-full">
              Send request
            </button>
          </form>
        </div>

        <aside className="space-y-6 brand-shell p-10 text-white shadow-sm">
          <div className="rounded-[2rem] bg-slate-950/80 p-8 ring-1 ring-white/10">
            <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Contact details</p>
            <h3 className="mt-4 text-2xl font-semibold">Speak with a travel curator</h3>
            <p className="mt-3 text-slate-300">Call, email, or message our team for tailored recommendations, hotel partnerships, and cargo logistics.</p>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[1.75rem] bg-slate-950/80 p-6 ring-1 ring-white/10 shadow-[0_18px_50px_-30px_rgba(15,23,42,0.5)]">
              <div className="flex items-start gap-4">
                <div className="mt-1 flex h-12 w-12 items-center justify-center rounded-3xl bg-[#F59E0B]/10 text-[#F59E0B] shadow-sm">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Office</p>
                  <p className="mt-3 text-xl font-semibold text-white">Nairobi, Kenya</p>
                </div>
              </div>
            </div>
            <div className="rounded-[1.75rem] bg-slate-950/80 p-6 ring-1 ring-white/10 shadow-[0_18px_50px_-30px_rgba(15,23,42,0.5)]">
              <div className="flex items-start gap-4">
                <div className="mt-1 flex h-12 w-12 items-center justify-center rounded-3xl bg-[#F59E0B]/10 text-[#F59E0B] shadow-sm">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Email</p>
                  <a
                    href="mailto:sakhirtravel10@gmail.com"
                    className="mt-3 block text-xl font-semibold text-white transition hover:text-[#F59E0B]"
                  >
                    sakhirtravel10@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}

export default Contact
