import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { sendAccountVerificationEmail, sendWelcomeEmail } from '../lib/emailService'

function Register() {
  const navigate = useNavigate()
  const { signUp } = useAuth()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    const { error } = await signUp(email, password, fullName)
    setSubmitting(false)

    if (error) {
      setMessage('Registration failed. Please try again.')
      return
    }

    await sendWelcomeEmail(email, fullName)
    await sendAccountVerificationEmail(email, fullName)

    navigate('/')
  }

  return (
    <section className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <div
        className="grid gap-10 rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(11,31,58,0.96),rgba(11,31,58,0.82)),url('https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center px-8 py-12 text-white shadow-[0_35px_90px_-40px_rgba(2,6,23,0.65)] sm:px-12 lg:grid-cols-[1.3fr_0.9fr] lg:items-center"
      >
        <div className="space-y-4">
          <p className="brand-chip">New member</p>
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">Create your luxury travel account</h1>
          <p className="max-w-2xl text-[var(--brand-text)]/90">Get priority booking access and manage all flights, hotels, cargo, tours, and visa requests from one premium portal.</p>
        </div>
        <div className="brand-card p-8 text-white">
          <p className="text-sm uppercase tracking-[0.3em] text-[var(--brand-secondary)]">Quick signup</p>
          <p className="mt-4 text-3xl font-semibold text-white">Luxury travel made easy</p>
          <p className="mt-3 text-[var(--brand-text)]/90">Join today and begin planning your next unforgettable journey.</p>
        </div>
      </div>

      <div className="brand-shell p-10">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-[var(--brand-secondary)]">Register</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Create your travel profile</h2>
          </div>
          <span className="brand-chip">Fast setup</span>
        </div>

        {message && <div className="rounded-3xl bg-rose-500/10 p-4 text-sm text-rose-100 border border-rose-400/20">{message}</div>}
        <form onSubmit={handleSubmit} className="mt-6 grid gap-6">
          <label className="space-y-2 text-sm text-[var(--brand-text)]"><span>Full name</span><input value={fullName} onChange={(event) => setFullName(event.target.value)} required className="w-full rounded-3xl bg-white/6 px-5 py-4 text-white outline-none transition focus:border-[var(--brand-secondary)] focus:ring-2 focus:ring-[var(--brand-secondary)]/20" /></label>
          <label className="space-y-2 text-sm text-[var(--brand-text)]"><span>Email address</span><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required className="w-full rounded-3xl bg-white/6 px-5 py-4 text-white outline-none transition focus:border-[var(--brand-secondary)] focus:ring-2 focus:ring-[var(--brand-secondary)]/20" /></label>
          <label className="space-y-2 text-sm text-[var(--brand-text)]"><span>Password</span><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required className="w-full rounded-3xl bg-white/6 px-5 py-4 text-white outline-none transition focus:border-[var(--brand-secondary)] focus:ring-2 focus:ring-[var(--brand-secondary)]/20" /></label>
          <button type="submit" disabled={submitting} className="brand-button w-full">{submitting ? 'Creating account…' : 'Create Account'}</button>
          <p className="text-center text-sm text-[var(--brand-muted)]">Already have an account? <Link to="/login" className="font-semibold text-[var(--brand-secondary)] hover:text-white">Sign in</Link></p>
        </form>
      </div>
    </section>
  )
}

export default Register
