import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

type Language = 'en' | 'so' | 'ar' | 'tr'

interface LanguageContextValue {
  language: Language
  setLanguage: (language: Language) => void
  t: (en: string, so?: string, ar?: string, tr?: string) => string
}

const supportedLanguages: Language[] = ['en', 'so', 'ar', 'tr']

function getStoredLanguage(): Language {
  if (typeof window === 'undefined') return 'en'
  const saved = window.localStorage.getItem('sakhir-language')
  return supportedLanguages.includes(saved as Language) ? (saved as Language) : 'en'
}

const LanguageContext = createContext<LanguageContextValue>({
  language: 'en',
  setLanguage: () => {},
  t: (en) => en,
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getStoredLanguage)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('sakhir-language', language)
    }
  }, [language])

  const setLanguage = (nextLanguage: Language) => {
    setLanguageState(nextLanguage)
  }

  const t = (en: string, so?: string, ar?: string, tr?: string) => {
    if (language === 'so') return so ?? en
    if (language === 'ar') return ar ?? en
    if (language === 'tr') return tr ?? en
    return en
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
