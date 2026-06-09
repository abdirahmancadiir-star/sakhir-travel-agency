import { useMemo } from 'react'
import { useAuth } from '../contexts/AuthContext'

function SEO() {
  const { user } = useAuth()

  const integrationStatus = useMemo(() => [
    ['Google Analytics 4', Boolean(import.meta.env.VITE_GA_MEASUREMENT_ID), 'Measurement ID configured for campaign reporting.'],
    ['Google Tag Manager', Boolean(import.meta.env.VITE_GTM_CONTAINER_ID), 'Tag manager snippet is enabled for marketing pixels and event tracking.'],
    ['Google Search Console', Boolean(import.meta.env.VITE_GOOGLE_SITE_VERIFICATION), 'Verification tag is ready for Search Console ownership confirmation.'],
    ['XML Sitemap', true, 'Static sitemap is available under /sitemap.xml.'],
    ['Robots.txt', true, 'Robots rules are published under /robots.txt.'],
    ['Canonical URLs', true, 'Canonical tags are applied through the shared SEO layer.'],
  ], [])

  if (!user || user.role !== 'admin') {
    return (
      <section className="mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-slate-950/95 p-10 shadow-[0_35px_80px_-40px_rgba(15,23,42,0.18)]">
        <p className="text-sm uppercase tracking-[0.32em] text-amber-300">Restricted access</p>
        <h1 className="mt-4 text-4xl font-semibold text-white">SEO & Google integration</h1>
        <p className="mt-4 max-w-2xl text-slate-300">Only administrators can manage the SEO and marketing integration view.</p>
      </section>
    )
  }

  return (
    <section className="space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <article className="rounded-[2rem] border border-white/10 bg-slate-950/95 p-8 shadow-[0_35px_90px_-40px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:p-10">
        <p className="text-sm uppercase tracking-[0.32em] text-amber-400">SEO & Google Integration</p>
        <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">Search performance and marketing controls</h1>
        <p className="mt-4 max-w-3xl text-slate-300">The platform now ships with an SEO-ready metadata layer, Google Analytics / Tag Manager hooks, Search Console support, sitemap and robots rules, canonical URLs, and image-friendly page setup for better organic visibility.</p>
      </article>

      <div className="grid gap-6 xl:grid-cols-2">
        <article className="rounded-[1.75rem] border border-white/10 bg-slate-900/85 p-6">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Google integrations</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">Enabled marketing and analytics hooks</h2>
          <div className="mt-6 space-y-3">
            {integrationStatus.map(([label, active, description]) => (
              <article key={label as string} className="rounded-[1.25rem] border border-white/10 bg-slate-950/90 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">{label as string}</p>
                    <p className="mt-1 text-xs text-slate-400">{description as string}</p>
                  </div>
                  <span className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] ${active ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-100' : 'border-amber-400/30 bg-amber-400/10 text-amber-100'}`}>
                    {active ? 'Live' : 'Pending'}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </article>

        <article className="rounded-[1.75rem] border border-white/10 bg-slate-900/85 p-6">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Technical SEO</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">Performance and discoverability checklist</h2>
          <ul className="mt-6 space-y-3 text-sm text-slate-200">
            <li className="rounded-[1.25rem] border border-white/10 bg-slate-950/90 p-4">Meta titles, descriptions, Open Graph tags, Twitter cards, and structural metadata are applied through the global SEO layer.</li>
            <li className="rounded-[1.25rem] border border-white/10 bg-slate-950/90 p-4">Canonical URLs and SEO-friendly route patterns are used across the app shell and public pages.</li>
            <li className="rounded-[1.25rem] border border-white/10 bg-slate-950/90 p-4">The public files include sitemap.xml and robots.txt to support crawlers and indexing.</li>
            <li className="rounded-[1.25rem] border border-white/10 bg-slate-950/90 p-4">Image optimization and fast-loading page patterns are supported via the Vite build and lightweight page structure.</li>
          </ul>
        </article>
      </div>

      <article className="rounded-[1.75rem] border border-white/10 bg-slate-900/85 p-6">
        <p className="text-sm uppercase tracking-[0.24em] text-slate-400">SEO status summary</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            ['Meta tags', 'Ready'],
            ['Analytics', import.meta.env.VITE_GA_MEASUREMENT_ID ? 'Configured' : 'Set VITE_GA_MEASUREMENT_ID'],
            ['Tag Manager', import.meta.env.VITE_GTM_CONTAINER_ID ? 'Configured' : 'Set VITE_GTM_CONTAINER_ID'],
            ['Search Console', import.meta.env.VITE_GOOGLE_SITE_VERIFICATION ? 'Configured' : 'Set VITE_GOOGLE_SITE_VERIFICATION'],
          ].map(([label, value]) => (
            <article key={label as string} className="rounded-[1.5rem] border border-white/10 bg-slate-950/90 p-5">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">{label as string}</p>
              <p className="mt-4 text-2xl font-semibold text-white">{value as string}</p>
            </article>
          ))}
        </div>
      </article>
    </section>
  )
}

export default SEO
