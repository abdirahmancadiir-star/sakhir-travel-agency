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
      <header className="sticky top-0 z-50 border-b border-[var(--line-soft)] bg-[var(--surface-glass)] backdrop-blur-md shadow-lg shadow-black/30">
        <div className="mx-auto flex w-full max-w-full items-center justify-between px-8 py-7 lg:px-12 lg:py-9">
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-5 flex-shrink-0">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-[#F59E0B] to-amber-600 text-2xl font-black text-[#0F172A] shadow-lg flex-shrink-0">
              S
            </div>
            <div className="hidden sm:block space-y-1">
              <p className="text-3xl font-black uppercase tracking-widest text-[var(--brand-sand)] leading-none">Sakhir Travel</p>
              <p className="text-base font-bold tracking-widest text-[var(--brand-gold)]">Global Solutions</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden flex-1 items-center justify-center gap-4 lg:flex px-8">
            {navigationItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="px-5 py-3 text-lg font-bold text-[var(--brand-soft)] transition duration-200 hover:text-[var(--brand-gold)] hover:bg-white/5 rounded-lg whitespace-nowrap flex-shrink-0"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions - Desktop */}
          <div className="hidden items-center gap-3 lg:flex flex-shrink-0">
            <div className="flex items-center rounded-full border border-white/10 bg-white/5 p-1">
              {(['en', 'so', 'ar', 'tr'] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setLanguage(option)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] transition ${language === option ? 'bg-[var(--brand-gold)] text-[var(--brand-deep)]' : 'text-[var(--brand-soft)] hover:bg-white/8 hover:text-[var(--brand-sand)]'}`}
                >
                  {option}
                </button>
              ))}
            </div>
            {!loading && user ? (
              <>
                <Link
                  to="/dashboard"
                  className="px-5 py-3 text-base font-semibold text-slate-300 transition duration-200 hover:text-white border border-slate-500 rounded-lg hover:border-[#F59E0B]/50 hover:bg-white/5"
                >
                  {t('Dashboard', 'Dashboard', 'لوحة القيادة', 'Panel')}
                </Link>
                <Link
                  to="/bookings"
                  className="px-5 py-3 text-base font-semibold text-slate-300 transition duration-200 hover:text-white border border-slate-500 rounded-lg hover:border-[#F59E0B]/50 hover:bg-white/5"
                >
                  {t('My Bookings', 'Dalxiisyada', 'حجوزاتي', 'Rezervasyonlarım')}
                </Link>
                <Link
                  to="/payments"
                  className="px-5 py-3 text-base font-semibold text-slate-300 transition duration-200 hover:text-white border border-slate-500 rounded-lg hover:border-[#F59E0B]/50 hover:bg-white/5"
                >
                  Payments
                </Link>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="px-5 py-3 text-base font-semibold text-slate-300 transition duration-200 hover:text-white border border-slate-500 rounded-lg hover:border-[#F59E0B]/50 hover:bg-white/5"
                  >
                    Admin
                  </Link>
                )}
                <button
                  type="button"
                  onClick={signOut}
                  className="px-5 py-3 text-base font-semibold text-slate-300 transition duration-200 hover:text-white border border-slate-500 rounded-lg hover:border-red-500/50 hover:bg-red-500/5"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-6 py-3 text-base font-bold text-[var(--brand-soft)] transition duration-200 hover:text-[var(--brand-sand)] border-2 border-slate-500 rounded-lg hover:border-[var(--brand-gold)]/50 hover:bg-white/5 whitespace-nowrap"
                >
                  {t('Sign In', 'Soo gal', 'تسجيل الدخول', 'Giriş Yap')}
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-3 text-base font-bold text-[var(--brand-deep)] bg-[var(--brand-gold)] rounded-lg transition duration-200 hover:bg-[#d8a44b] shadow-lg shadow-[var(--brand-gold)]/30 whitespace-nowrap"
                >
                  {t('Create Account', 'Abuur Konto', 'إنشاء حساب', 'Hesap Oluştur')}
                </Link>
              </>
            )}
            <Link
              to="/contact"
              className="px-6 py-3 text-base font-bold text-[var(--brand-sand)] border-2 border-[var(--brand-gold)] bg-[var(--brand-gold)]/10 rounded-lg transition duration-200 hover:bg-[var(--brand-gold)]/20 hover:shadow-lg hover:shadow-[var(--brand-gold)]/30 whitespace-nowrap"
            >
              Get Free Quote
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="inline-flex items-center justify-center p-3 text-slate-300 transition duration-200 hover:text-[#F59E0B] lg:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
          >
            {menuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="border-t border-[var(--line-soft)] bg-[var(--surface-glass)] backdrop-blur-sm lg:hidden">
            <nav className="mx-auto w-full px-8 py-8">
              <div className="grid gap-3">
                {navigationItems.map((item) => (
                  <Link
                    key={item.label}
                    to={item.href}
                    className="px-6 py-4 text-xl font-bold text-[var(--brand-soft)] transition duration-200 hover:text-[var(--brand-gold)] hover:bg-white/5 rounded-xl"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="border-t border-[#F59E0B]/20 mt-6 pt-6 grid gap-4">
                  {!loading && user ? (
                    <>
                      <Link
                        to="/bookings"
                        className="px-6 py-4 text-lg font-bold text-slate-300 transition duration-200 hover:text-white border border-slate-500 rounded-xl hover:border-[#F59E0B]/50 hover:bg-white/5"
                        onClick={() => setMenuOpen(false)}
                      >
                        My Bookings
                      </Link>
                      <Link
                        to="/payments"
                        className="px-6 py-4 text-lg font-bold text-slate-300 transition duration-200 hover:text-white border border-slate-500 rounded-xl hover:border-[#F59E0B]/50 hover:bg-white/5"
                        onClick={() => setMenuOpen(false)}
                      >
                        Payments
                      </Link>
                      <Link
                        to="/track-booking"
                        className="px-6 py-4 text-lg font-bold text-slate-300 transition duration-200 hover:text-white border border-slate-500 rounded-xl hover:border-[#F59E0B]/50 hover:bg-white/5"
                        onClick={() => setMenuOpen(false)}
                      >
                        Track Booking
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          signOut()
                          setMenuOpen(false)
                        }}
                        className="px-6 py-4 text-lg font-bold text-slate-300 transition duration-200 hover:text-white border border-slate-500 rounded-xl hover:border-red-500/50 hover:bg-red-500/5 text-left"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="px-6 py-4 text-lg font-bold text-slate-300 transition duration-200 hover:text-white border-2 border-slate-500 rounded-xl hover:border-[#F59E0B]/50 hover:bg-white/5"
                        onClick={() => setMenuOpen(false)}
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/register"
                        className="px-6 py-4 text-lg font-black text-[var(--brand-deep)] bg-[var(--brand-gold)] rounded-xl transition duration-200 hover:bg-[#d8a44b]"
                        onClick={() => setMenuOpen(false)}
                      >
                        Create Account
                      </Link>
                    </>
                  )}
                  <Link
                    to="/contact"
                    className="px-6 py-4 text-lg font-black text-[var(--brand-sand)] border-2 border-[var(--brand-gold)] bg-[var(--brand-gold)]/10 rounded-xl transition duration-200 hover:bg-[var(--brand-gold)]/20"
                    onClick={() => setMenuOpen(false)}
                  >
                    Get Free Quote
                  </Link>
                </div>
              </div>
            </nav>
          </div>
        )}
      </header>

      <main className="mx-auto w-full px-0">
        <Outlet />
      </main>

      <WhatsAppFloating />

      <footer className="border-t border-[var(--line-soft)] bg-[var(--brand-deep)] text-[var(--brand-soft)] mt-20">
        <div className="mx-auto grid w-full max-w-[1400px] gap-12 px-6 py-16 lg:grid-cols-4 lg:px-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#F59E0B] to-amber-600 text-sm font-bold text-[#0F172A]">
                S
              </div>
              <p className="text-sm font-bold uppercase tracking-[0.08em] text-[var(--brand-sand)]">Sakhir Travel</p>
            </div>
            <p className="max-w-sm text-sm leading-7 text-[var(--brand-soft)]/90">Premium travel agency delivering world-class journeys, cargo logistics and visa support for discerning travelers.</p>
          </div>
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--brand-gold)]">Services</p>
            <ul className="space-y-3 text-sm text-[var(--brand-soft)]/90">
              <li className="transition hover:text-[var(--brand-gold)] hover:translate-x-1">Flight Booking</li>
              <li className="transition hover:text-[#F59E0B] hover:translate-x-1">Hotel Reservations</li>
              <li className="transition hover:text-[#F59E0B] hover:translate-x-1">Tour Packages</li>
              <li className="transition hover:text-[#F59E0B] hover:translate-x-1">Cargo Logistics</li>
              <li className="transition hover:text-[#F59E0B] hover:translate-x-1">Visa Assistance</li>
            </ul>
          </div>
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--brand-gold)]">Destinations</p>
            <ul className="space-y-3 text-sm text-[var(--brand-soft)]/90">
              <li className="transition hover:text-[var(--brand-gold)] hover:translate-x-1">Dubai</li>
              <li className="transition hover:text-[#F59E0B] hover:translate-x-1">Istanbul</li>
              <li className="transition hover:text-[#F59E0B] hover:translate-x-1">Nairobi</li>
              <li className="transition hover:text-[#F59E0B] hover:translate-x-1">Kuala Lumpur</li>
              <li className="transition hover:text-[#F59E0B] hover:translate-x-1">Mecca</li>
            </ul>
          </div>
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-[#F59E0B]">Contact</p>
            <p className="text-sm text-slate-400">Sakhirtravel10@gmail.com</p>
            <p className="mt-2 text-sm text-slate-400">+254 722 231 116</p>
            <p className="mt-2 text-sm text-slate-400">WhatsApp: +254 722 231 116</p>
            <p className="mt-4 text-xs text-slate-500">Nairobi, Kenya</p>
          </div>
        </div>
        <div className="border-t border-[#F59E0B]/20 bg-[#0F172A]/50 px-6 py-6 text-center text-sm text-slate-500 lg:px-12">
          © {new Date().getFullYear()} Sakhir Travel & Cargo Agency. Crafted for premium journeys and seamless logistics.
        </div>
      </footer>
    </div>
    </>
  )
}

export default Layout
