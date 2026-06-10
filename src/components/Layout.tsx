import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { Menu, X } from 'lucide-react'
import SEO from './SEO'
import WhatsAppFloating from './WhatsAppFloating'

function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, loading, signOut } = useAuth()
  const { t, language, setLanguage } = useLanguage()

  const navigationItems = [
    { label: t('Home', 'Guri', 'الرئيسية', 'Ana Sayfa'), href: '/' },
    { label: t('Flights', 'Duulimaadka', 'الرحلات', 'Uçuşlar'), href: '/flights' },
    { label: t('Hotels', 'Hoteelada', 'الفنادق', 'Oteller'), href: '/hotels' },
    { label: t('Tours', 'Dalxiis', 'الجولات', 'Turlar'), href: '/tours' },
    { label: t('Visa Services', 'Adeegyada Visa', 'خدمات التأشيرة', 'Vize Hizmetleri'), href: '/visa' },
    { label: t('Cargo Services', 'Adeegyada Cargo', 'خدمات الشحن', 'Kargo Hizmetleri'), href: '/cargo' },
    { label: t('Contact Us', 'Nagala soo xiriir', 'تواصل معنا', 'Bize Ulaşın'), href: '/contact' },
    { label: t('Payments', 'Bixinta', 'المدفوعات', 'Ödemeler'), href: '/payments' },
    { label: t('Track Booking', 'Raadi Booking', 'تتبع الحجز', 'Rezervasyon Takibi'), href: '/track-booking' },
    { label: t('Dashboard', 'Dashboard', 'لوحة القيادة', 'Panel'), href: '/dashboard', authOnly: true },
  ].filter((item) => !(item.authOnly && !user))

  return (
    <>
      <SEO />

      <div className="min-h-screen bg-[var(--brand-deep)] text-[var(--brand-sand)]">

        {/* HEADER */}
        <header className="sticky top-0 z-50 border-b border-[var(--line-soft)] bg-[var(--surface-glass)] backdrop-blur-md shadow-lg shadow-black/30">
          <div className="mx-auto flex w-full max-w-full items-center justify-between px-8 py-7 lg:px-12 lg:py-9">

            {/* LOGO */}
            <Link to="/" className="flex items-center gap-4 flex-shrink-0">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F59E0B] to-amber-600 text-xl font-black text-[#0F172A] shadow-lg">
                S
              </div>

              <div className="hidden sm:block leading-tight">
                <p className="text-xl font-bold uppercase tracking-wide text-[var(--brand-sand)]">
                  SAKHIR TRAVEL AGENCY
                </p>
                <p className="text-xs font-semibold tracking-widest text-[var(--brand-gold)]">
                  Global Solutions
                </p>
              </div>
            </Link>

            {/* DESKTOP NAV */}
            <nav className="hidden flex-1 items-center justify-center gap-4 lg:flex px-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="px-4 py-2 text-base font-semibold text-[var(--brand-soft)] hover:text-[var(--brand-gold)] hover:bg-white/5 rounded-lg"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* RIGHT ACTIONS */}
            <div className="hidden items-center gap-3 lg:flex">

              {/* LANGUAGE */}
              <div className="flex items-center rounded-full border border-white/10 bg-white/5 p-1">
                {(['en', 'so', 'ar', 'tr'] as const).map((option) => (
                  <button
                    key={option}
                    onClick={() => setLanguage(option)}
                    className={`px-3 py-1 text-xs font-semibold uppercase rounded-full ${
                      language === option
                        ? 'bg-[var(--brand-gold)] text-[var(--brand-deep)]'
                        : 'text-[var(--brand-soft)]'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              {/* AUTH */}
              {!loading && user ? (
                <>
                  <Link to="/dashboard" className="btn">Dashboard</Link>
                  <Link to="/bookings" className="btn">Bookings</Link>
                  <button onClick={signOut} className="btn">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn">Sign In</Link>
                  <Link to="/register" className="btn-primary">Create Account</Link>
                </>
              )}

              <Link to="/contact" className="btn-gold">
                Get Free Quote
              </Link>
            </div>

            {/* MOBILE MENU */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-3"
            >
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>

          </div>

          {/* MOBILE NAV */}
          {menuOpen && (
            <div className="lg:hidden border-t border-[var(--line-soft)] bg-[var(--surface-glass)] p-6 space-y-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="block text-lg font-semibold"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </header>

        {/* PAGE CONTENT */}
        <main>
          <Outlet />
        </main>

        <WhatsAppFloating />

        {/* FOOTER */}
        <footer className="mt-20 border-t border-[var(--line-soft)] bg-[var(--brand-deep)] text-[var(--brand-soft)]">
          <div className="p-10 text-center text-sm">
            © {new Date().getFullYear()} SAKHIR TRAVEL AGENCY
          </div>
        </footer>

      </div>
    </>
  )
}

export default Layout
