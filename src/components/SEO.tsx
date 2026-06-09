import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const DEFAULT_TITLE = 'Sakhir Travel & Cargo Agency'
const DEFAULT_DESCRIPTION = 'Premium travel, cargo, hotel, tours, visa and booking management platform with business analytics and SEO-ready integrations.'
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1200&q=80'

function SEO({ title = DEFAULT_TITLE, description = DEFAULT_DESCRIPTION }: { title?: string; description?: string }) {
  const location = useLocation()

  useEffect(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://sakhirtravelcargo.com'
    const canonicalUrl = `${origin}${location.pathname}`

    document.title = `${title} | Sakhir Travel & Cargo`

    const setMeta = (name: string, content: string) => {
      let element = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null
      if (!element) {
        element = document.createElement('meta')
        element.setAttribute('name', name)
        document.head.appendChild(element)
      }
      element.setAttribute('content', content)
    }

    const setProperty = (property: string, content: string) => {
      let element = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null
      if (!element) {
        element = document.createElement('meta')
        element.setAttribute('property', property)
        document.head.appendChild(element)
      }
      element.setAttribute('content', content)
    }

    setMeta('description', description)
    setMeta('keywords', 'travel agency, cargo services, flights, hotels, tours, visa assistance, premium tourism, Nairobi, Dubai, Istanbul')
    setMeta('author', 'Sakhir Travel & Cargo Agency')
    setMeta('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1')
    setMeta('theme-color', '#0F172A')
    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:title', title)
    setMeta('twitter:description', description)
    setMeta('twitter:image', DEFAULT_IMAGE)
    setMeta('twitter:site', '@sakhirtravel')
    setMeta('twitter:creator', '@sakhirtravel')
    setProperty('og:title', title)
    setProperty('og:description', description)
    setProperty('og:type', 'website')
    setProperty('og:url', canonicalUrl)
    setProperty('og:image', DEFAULT_IMAGE)
    setProperty('og:image:alt', title)
    setProperty('og:site_name', 'Sakhir Travel & Cargo')
    setProperty('og:locale', 'en_US')

    let schemaScript = document.querySelector('script#sakhir-schema') as HTMLScriptElement | null
    if (!schemaScript) {
      schemaScript = document.createElement('script')
      schemaScript.setAttribute('id', 'sakhir-schema')
      schemaScript.setAttribute('type', 'application/ld+json')
      document.head.appendChild(schemaScript)
    }
    schemaScript.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'TravelAgency',
      name: 'Sakhir Travel & Cargo Agency',
      url: canonicalUrl,
      sameAs: ['https://www.instagram.com/', 'https://www.facebook.com/'],
      image: DEFAULT_IMAGE,
      description,
      areaServed: ['Kenya', 'Dubai', 'Turkey', 'UAE', 'East Africa'],
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+254722231116',
        contactType: 'customer support',
        availableLanguage: ['English', 'Somali', 'Arabic', 'Turkish'],
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Travel, cargo, hotel, visa and tour services',
      },
    }, null, 2)

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', canonicalUrl)
  }, [description, location.pathname, title])

  return null
}

export default SEO
