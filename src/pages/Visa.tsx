import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { sendVisaStatusNotification } from '../lib/notifications'
import { supabase } from '../lib/supabase'
import { getVisaStatusLabel, getVisaStatusTone, uploadVisaDocument } from '../lib/visa'

function Visa() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState<string | null>(null)

  const [fullName, setFullName] = useState('')
  const [nationality, setNationality] = useState('')
  const [passportNumber, setPassportNumber] = useState('')
  const [destinationCountry, setDestinationCountry] = useState('')
  const [travelDate, setTravelDate] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [visaType, setVisaType] = useState('Tourist')
  const [notes, setNotes] = useState('')
  const [passportCopy, setPassportCopy] = useState<File | null>(null)
  const [passportPhoto, setPassportPhoto] = useState<File | null>(null)
  const [nationalId, setNationalId] = useState<File | null>(null)
  const [supportingDocs, setSupportingDocs] = useState<FileList | null>(null)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    const loadApplications = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('visa_applications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (!error) setApplications(data ?? [])
      setLoading(false)
    }

    void loadApplications()
  }, [user])

  const totalDocuments = useMemo(() => applications.reduce((sum, item) => sum + (item.document_count || 0), 0), [applications])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!user) {
      navigate('/login')
      return
    }

    try {
      const { data: app, error } = await supabase
        .from('visa_applications')
        .insert({
          user_id: user.id,
          applicant_name: fullName,
          nationality,
          passport_number: passportNumber,
          country: destinationCountry,
          destination_country: destinationCountry,
          visa_type: visaType,
          travel_date: travelDate,
          email: email || user.email,
          phone,
          status: 'submitted',
          notes,
        })
        .select('id')
        .single()

      if (error || !app) {
        setStatus('Unable to submit your visa application right now.')
        return
      }

      await supabase.from('visa_status_history').insert({ visa_application_id: app.id, status: 'submitted', note: 'Application submitted by the customer.' })

      const fileList = [passportCopy, passportPhoto, nationalId].filter(Boolean) as File[]
      for (const file of fileList) {
        const docType = file === passportCopy ? 'Passport Copy' : file === passportPhoto ? 'Passport Photo' : 'National ID'
        await uploadVisaDocument(app.id, file, docType, user.id)
      }
      if (supportingDocs) {
        for (const file of Array.from(supportingDocs)) {
          await uploadVisaDocument(app.id, file, 'Supporting Documents', user.id)
        }
      }

      await sendVisaStatusNotification({
        customerName: fullName || user.full_name || user.email,
        customerEmail: email || user.email || '',
        applicationId: app.id,
        status: 'submitted',
        note: 'Your visa application has been received. Our team will review your documents shortly.',
      })

      setStatus('Visa application submitted successfully. We will review the uploaded documents and update you by email.')
      setFullName('')
      setNationality('')
      setPassportNumber('')
      setDestinationCountry('')
      setTravelDate('')
      setEmail('')
      setPhone('')
      setVisaType('Tourist')
      setNotes('')
      setPassportCopy(null)
      setPassportPhoto(null)
      setNationalId(null)
      setSupportingDocs(null)
      const { data } = await supabase.from('visa_applications').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
      setApplications(data ?? [])
    } catch (error) {
      console.error(error)
      setStatus('Unable to submit your visa application right now.')
    }
  }

  const handleAdditionalUpload = async (applicationId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || !files.length) return

    setStatus('Uploading additional documents…')
    try {
      for (const file of Array.from(files)) {
        await uploadVisaDocument(applicationId, file, 'Additional Documents', user!.id)
      }
      const { data } = await supabase.from('visa_applications').select('*').eq('user_id', user!.id).order('created_at', { ascending: false })
      setApplications(data ?? [])
      setStatus('Additional documents uploaded successfully.')
    } catch (error) {
      console.error(error)
      setStatus('We could not upload the additional documents. Please try again.')
    }
  }

  return (
    <section className="space-y-10 px-4 py-10 sm:px-6 lg:px-8">
      <article className="rounded-[2rem] border border-white/10 bg-slate-950/95 p-8 shadow-[0_35px_90px_-40px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:p-10">
        <p className="text-sm uppercase tracking-[0.32em] text-amber-400">Visa application center</p>
        <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">Complete visa applications with secure document uploads</h1>
        <p className="mt-5 max-w-3xl text-slate-300">Customers can submit visa requests, upload passport copies and supporting files, track status in real time, and download approval documents from their personal dashboard.</p>
      </article>

      <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
        <article className="rounded-[2rem] border border-white/10 bg-slate-950/95 p-8 shadow-[0_35px_90px_-40px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:p-10">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Apply for a visa</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">Visa application form</h2>
          <p className="mt-3 text-sm text-slate-300">Submit the required traveler details and upload passport, photo, ID, and supporting documents in PDF, JPG, or PNG format.</p>
          {status && <div className="mt-6 rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-100">{status}</div>}
          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-200"><span>Full name</span><input value={fullName} onChange={(event) => setFullName(event.target.value)} required className="w-full rounded-3xl border border-white/10 bg-slate-900/90 px-4 py-3 text-slate-100 outline-none focus:border-amber-400" placeholder="Full name" /></label>
              <label className="space-y-2 text-sm text-slate-200"><span>Nationality</span><input value={nationality} onChange={(event) => setNationality(event.target.value)} required className="w-full rounded-3xl border border-white/10 bg-slate-900/90 px-4 py-3 text-slate-100 outline-none focus:border-amber-400" placeholder="Kenyan" /></label>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-200"><span>Passport number</span><input value={passportNumber} onChange={(event) => setPassportNumber(event.target.value)} required className="w-full rounded-3xl border border-white/10 bg-slate-900/90 px-4 py-3 text-slate-100 outline-none focus:border-amber-400" placeholder="Passport number" /></label>
              <label className="space-y-2 text-sm text-slate-200"><span>Destination country</span><input value={destinationCountry} onChange={(event) => setDestinationCountry(event.target.value)} required className="w-full rounded-3xl border border-white/10 bg-slate-900/90 px-4 py-3 text-slate-100 outline-none focus:border-amber-400" placeholder="United Arab Emirates" /></label>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-200"><span>Travel date</span><input type="date" value={travelDate} onChange={(event) => setTravelDate(event.target.value)} required className="w-full rounded-3xl border border-white/10 bg-slate-900/90 px-4 py-3 text-slate-100 outline-none focus:border-amber-400" /></label>
              <label className="space-y-2 text-sm text-slate-200"><span>Visa type</span><select value={visaType} onChange={(event) => setVisaType(event.target.value)} className="w-full rounded-3xl border border-white/10 bg-slate-900/90 px-4 py-3 text-slate-100 outline-none focus:border-amber-400"><option>Tourist</option><option>Business</option><option>Umrah</option><option>Work</option></select></label>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-200"><span>Email</span><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required className="w-full rounded-3xl border border-white/10 bg-slate-900/90 px-4 py-3 text-slate-100 outline-none focus:border-amber-400" placeholder="traveler@example.com" /></label>
              <label className="space-y-2 text-sm text-slate-200"><span>Phone number</span><input value={phone} onChange={(event) => setPhone(event.target.value)} required className="w-full rounded-3xl border border-white/10 bg-slate-900/90 px-4 py-3 text-slate-100 outline-none focus:border-amber-400" placeholder="+254722231116" /></label>
            </div>
            <label className="space-y-2 text-sm text-slate-200"><span>Additional notes</span><textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={4} className="w-full rounded-[1.5rem] border border-white/10 bg-slate-900/90 px-4 py-3 text-slate-100 outline-none focus:border-amber-400" placeholder="Mention urgency, visa type, or special handling requirements." /></label>

            <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/90 p-5">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Document upload</p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm text-slate-200"><span>Passport copy (PDF/JPG/PNG)</span><input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(event) => setPassportCopy(event.target.files?.[0] || null)} required className="w-full rounded-3xl border border-dashed border-white/10 bg-slate-950/90 p-3 text-slate-100" /></label>
                <label className="space-y-2 text-sm text-slate-200"><span>Passport photo</span><input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(event) => setPassportPhoto(event.target.files?.[0] || null)} required className="w-full rounded-3xl border border-dashed border-white/10 bg-slate-950/90 p-3 text-slate-100" /></label>
                <label className="space-y-2 text-sm text-slate-200"><span>National ID (optional)</span><input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(event) => setNationalId(event.target.files?.[0] || null)} className="w-full rounded-3xl border border-dashed border-white/10 bg-slate-950/90 p-3 text-slate-100" /></label>
                <label className="space-y-2 text-sm text-slate-200"><span>Supporting documents</span><input type="file" accept=".pdf,.jpg,.jpeg,.png" multiple onChange={(event) => setSupportingDocs(event.target.files)} className="w-full rounded-3xl border border-dashed border-white/10 bg-slate-950/90 p-3 text-slate-100" /></label>
              </div>
              <p className="mt-3 text-xs text-slate-400">Supported formats: PDF, JPG, PNG. Secure storage and signed document URLs are used for protected access.</p>
            </div>

            <button type="submit" className="brand-button w-full px-6 py-3 text-sm font-semibold">Submit visa application</button>
          </form>
        </article>

        <aside className="space-y-6">
          <article className="rounded-[2rem] border border-white/10 bg-slate-950/95 p-8 shadow-[0_35px_90px_-40px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:p-10">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Your dashboard</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">Application tracking</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
              <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/90 p-5"><p className="text-xs uppercase tracking-[0.28em] text-slate-400">Applications</p><p className="mt-3 text-3xl font-semibold text-white">{applications.length}</p></div>
              <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/90 p-5"><p className="text-xs uppercase tracking-[0.28em] text-slate-400">Documents</p><p className="mt-3 text-3xl font-semibold text-white">{totalDocuments}</p></div>
              <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/90 p-5"><p className="text-xs uppercase tracking-[0.28em] text-slate-400">Status flow</p><p className="mt-3 text-sm text-slate-200">Submitted → Under Review → Processing → Approved / Rejected</p></div>
            </div>
          </article>

          <article className="rounded-[2rem] border border-white/10 bg-slate-950/95 p-8 shadow-[0_35px_90px_-40px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:p-10">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Customer support</p>
            <h3 className="mt-3 text-2xl font-semibold text-white">What you can do</h3>
            <ul className="mt-6 space-y-3 text-sm text-slate-300">
              <li>• View application status and updates</li>
              <li>• Upload additional documents anytime</li>
              <li>• Download approval letters and visa documents</li>
              <li>• Receive email notifications when the status changes</li>
            </ul>
          </article>
        </aside>
      </div>

      <article className="rounded-[2rem] border border-white/10 bg-slate-950/95 p-8 shadow-[0_35px_90px_-40px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:p-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Your applications</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">Visa application history</h2>
          </div>
          <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-amber-100">Secure</span>
        </div>
        {loading ? <p className="mt-6 text-slate-300">Loading your visa applications…</p> : applications.length === 0 ? <p className="mt-6 text-slate-300">You do not have any visa applications yet. Start by submitting the form above.</p> : <div className="mt-6 grid gap-5 xl:grid-cols-2">{applications.map((application) => (
          <article key={application.id} className="rounded-[1.75rem] border border-white/10 bg-slate-900/90 p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">{application.destination_country || application.country}</p>
                <h3 className="mt-3 text-xl font-semibold text-white">{application.applicant_name}</h3>
                <p className="mt-2 text-sm text-slate-300">Passport: {application.passport_number}</p>
                <p className="mt-1 text-sm text-slate-300">Travel date: {application.travel_date}</p>
              </div>
              <span className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.24em] ${getVisaStatusTone(application.status)}`}>{getVisaStatusLabel(application.status)}</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-200">
              <span className="rounded-full border border-white/10 bg-slate-950/90 px-3 py-1">{application.visa_type || 'Visa'}</span>
              <span className="rounded-full border border-white/10 bg-slate-950/90 px-3 py-1">Email: {application.email || 'Not provided'}</span>
              <span className="rounded-full border border-white/10 bg-slate-950/90 px-3 py-1">Phone: {application.phone || 'Not provided'}</span>
            </div>
            {application.notes && <p className="mt-4 rounded-[1.25rem] border border-white/10 bg-slate-950/90 p-4 text-sm text-slate-200">{application.notes}</p>}
            <div className="mt-5 flex flex-wrap gap-3">
              <label className="inline-flex cursor-pointer items-center rounded-full border border-white/10 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 hover:border-amber-400">Upload more docs<input type="file" accept=".pdf,.jpg,.jpeg,.png" multiple className="hidden" onChange={(event) => void handleAdditionalUpload(application.id, event)} /></label>
              {application.status === 'approved' && <a href={application.approval_file_url || '#'} target="_blank" rel="noreferrer" className="rounded-full bg-amber-400 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-amber-300">Download approval docs</a>}
            </div>
          </article>
        ))}</div>}
      </article>
    </section>
  )
}

export default Visa
