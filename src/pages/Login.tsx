import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function Login() {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    const { error } = await signIn(email, password)
    setSubmitting(false)

    if (error) {
      setMessage('Login failed. Please check your email and password.')
      return
    }

    navigate('/')
  }

  return (
    <section className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <div
        className="grid gap-10 rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(11,31,58,0.96),rgba(11,31,58,0.78)),url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center px-8 py-12 text-white shadow-[0_35px_90px_-40px_rgba(2,6,23,0.65)] sm:px-12 lg:grid-cols-[1.3fr_0.9fr] lg:items-center"
      >
        <div className="space-y-4">
          <p className="brand-chip">Member access</p>
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">Access your premium travel account</h1>
          <p className="max-w-2xl text-[var(--brand-text)]/90">Log in to manage bookings, view travel itineraries, and unlock concierge support for flights, hotels, cargo and visas.</p>
        </div>
        <div className="brand-card p-8 text-white">
          <p className="text-sm uppercase tracking-[0.3em] text-[var(--brand-secondary)]">Fast login</p>
          <p className="mt-4 text-3xl font-semibold text-white">Secure, premium access</p>
          <p className="mt-3 text-[var(--brand-text)]/90">Your travel history, tickets and support are just a click away.</p>
        </div>
      </div>

      <div className="brand-shell p-10">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-[var(--brand-secondary)]">Login</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Welcome back</h2>
          </div>
          <span className="brand-chip">Premium traveler</span>
        </div>

        {message && <div className="rounded-3xl bg-rose-500/10 p-4 text-sm text-rose-100 border border-rose-400/20">{message}</div>}
        <form onSubmit={handleSubmit} className="mt-6 grid gap-6">
          <label className="space-y-2 text-sm text-[var(--brand-text)]">
            <span>Email address</span>
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required className="w-full rounded-3xl bg-white/6 px-5 py-4 text-white outline-none transition focus:border-[var(--brand-secondary)] focus:ring-2 focus:ring-[var(--brand-secondary)]/20" />
          </label>
          <label className="space-y-2 text-sm text-[var(--brand-text)]">
            <span>Password</span>
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required className="w-full rounded-3xl bg-white/6 px-5 py-4 text-white outline-none transition focus:border-[var(--brand-secondary)] focus:ring-2 focus:ring-[var(--brand-secondary)]/20" />
          </label>
          <button type="submit" disabled={submitting} className="brand-button w-full">{submitting ? 'Signing in…' : 'Sign In'}</button>
          <p className="text-center text-sm text-[var(--brand-muted)]">Don’t have an account? <Link to="/register" className="font-semibold text-[var(--brand-secondary)] hover:text-white">Create one</Link></p>
        </form>
      </div>
    </section>
  )
}

export default Login
