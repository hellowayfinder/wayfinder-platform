import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { analytics } from '../utils/analytics'
import type { Provider } from '../types'
import './ProviderDetail.css'

const AVATAR_COLORS = [
  { bg: '#eeebfe', text: '#534AB7' },
  { bg: '#e1f5ee', text: '#085041' },
  { bg: '#eef4e8', text: '#3b6d11' },
  { bg: '#faeeda', text: '#633806' },
  { bg: '#fbeaf0', text: '#72243e' },
]

function avatarColor(id: string) {
  const num = parseInt(id.replace(/\D/g, '')) || 0
  return AVATAR_COLORS[num % AVATAR_COLORS.length]
}

interface SectionProps {
  label: string
  children: React.ReactNode
}

function Section({ label, children }: SectionProps) {
  return (
    <div className="detail-section">
      <p className="section-label">{label}</p>
      {children}
    </div>
  )
}

interface Props {
  providers: Provider[]
}

export default function ProviderDetail({ providers }: Props) {
  const { id }     = useParams<{ id: string }>()
  const navigate   = useNavigate()
  const provider   = providers.find(p => p.id === id)
  const color      = provider ? avatarColor(provider.id) : { bg: '#eeebfe', text: '#534AB7' }

  useEffect(() => {
    if (provider) {
      document.title = `${provider.name} · WayFinder`
    }
    return () => { document.title = 'WayFinder · Chennai' }
  }, [provider])

  if (!provider) {
    return (
      <div className="detail-not-found">
        <p>Provider not found.</p>
        <button onClick={() => navigate('/')}>Go back</button>
      </div>
    )
  }

  function handleContact() {
    analytics.contactTapped(provider!.id, provider!.name)
    window.open(provider!.contactUrl, '_blank', 'noopener,noreferrer')
  }

  function handleMaps() {
    if (!provider!.mapsUrl) return
    analytics.mapsTapped(provider!.id, provider!.name)
    window.open(provider!.mapsUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="detail">

      {/* Top nav */}
      <header className="detail-header">
        <button className="back-btn" onClick={() => navigate(-1)} aria-label="Go back">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M11 4L6 9l5 5" stroke="currentColor" strokeWidth="1.6"
              strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </button>
      </header>

      <div className="detail-body">

        {/* Identity */}
        <div className="detail-identity">
          <div
            className="detail-avatar"
            style={{ background: color.bg, color: color.text }}
            aria-hidden="true"
          >
            {provider.initials}
          </div>
          <div>
            <h1 className="detail-name">{provider.name}</h1>
            <p className="detail-type">
              {provider.type} ·{' '}
              {provider.practice === 'Centre'
                ? provider.centreLocality
                : provider.practice === 'Home Visits'
                ? 'Home visits'
                : `${provider.centreLocality} · also home visits`}
            </p>
          </div>
        </div>

        {/* Trust badge + quote */}
        {provider.trustBadge && (
          <div className="detail-trust">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M8 1l2 4.5H15l-4 3 1.5 5L8 11l-4.5 2.5L5 8.5 1 5.5h5z"
                fill="#0f6e56" opacity=".9"/>
            </svg>
            <div>
              <p className="trust-label">{provider.trustBadge}</p>
              {provider.quote && (
                <p className="trust-quote">"{provider.quote}"</p>
              )}
            </div>
          </div>
        )}

        {/* Quote only — no badge yet */}
        {!provider.trustBadge && provider.quote && (
          <div className="detail-quote">
            <p>"{provider.quote}"</p>
          </div>
        )}

        <div className="detail-divider" />

        {/* Services */}
        <Section label="Services">
          <div className="tag-row">
            {provider.services.map(s => (
              <span key={s} className="tag tag-service">{s}</span>
            ))}
          </div>
        </Section>

        {/* Conditions */}
        <Section label="Conditions supported">
          <div className="tag-row">
            {provider.conditions.map(c => (
              <span key={c} className="tag tag-condition">{c}</span>
            ))}
          </div>
        </Section>

        {/* Age groups */}
        <Section label="Age groups">
          <p className="detail-value">{provider.ageGroups}</p>
        </Section>

        {/* Languages */}
        <Section label="Languages">
          <p className="detail-value">{provider.languages.join(', ')}</p>
        </Section>

        {/* Practice type */}
        <Section label="Practice type">
          <p className="detail-value">{provider.practice}</p>
        </Section>

        {/* Centre address */}
        {(provider.practice === 'Centre' || provider.practice === 'Both') &&
          provider.centreAddress && (
          <Section label="Centre address">
            <p className="detail-value">{provider.centreAddress}</p>
          </Section>
        )}

        {/* Home visit areas */}
        {(provider.practice === 'Home Visits' || provider.practice === 'Both') &&
          provider.hvLocalities.length > 0 && (
          <Section label="Home visit areas">
            <div className="tag-row">
              {provider.hvLocalities.map(l => (
                <span key={l} className="tag tag-locality">{l}</span>
              ))}
            </div>
          </Section>
        )}

        <div className="detail-divider" />

        {/* Action buttons */}
        <div className="detail-actions">
          <button className="btn-whatsapp" onClick={handleContact}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20.52 3.48A11.93 11.93 0 0012 0C5.37 0 0 5.37 0 12a11.93 11.93 0 001.65 6.08L0 24l6.08-1.6A11.93 11.93 0 0012 24c6.63 0 12-5.37 12-12a11.93 11.93 0 00-3.48-8.52zM12 22a9.93 9.93 0 01-5.06-1.38l-.36-.21-3.73.98.99-3.64-.23-.38A9.93 9.93 0 012 12C2 6.48 6.48 2 12 2s10 4.48 10 10-4.48 10-10 10zm5.44-7.4c-.3-.15-1.77-.87-2.04-.97s-.47-.15-.67.15-.77.97-.95 1.17-.35.22-.65.07a8.15 8.15 0 01-2.4-1.48 9.07 9.07 0 01-1.66-2.07c-.17-.3 0-.46.13-.6.12-.14.3-.35.44-.52s.2-.3.3-.5.05-.37-.02-.52-.67-1.6-.92-2.2c-.24-.57-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.37s-1.04 1.02-1.04 2.48 1.07 2.88 1.22 3.08c.14.2 2.1 3.2 5.08 4.49.71.31 1.27.49 1.7.63.71.22 1.36.19 1.87.11.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.08-.12-.27-.2-.57-.35z"/>
            </svg>
            Contact on WhatsApp
          </button>

          {provider.mapsUrl && (
            <button className="btn-maps" onClick={handleMaps}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <circle cx="8" cy="6.5" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M8 1C5.24 1 3 3.24 3 6c0 4 5 9 5 9s5-5 5-9c0-2.76-2.24-5-5-5z"
                  stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
              </svg>
              Get directions
            </button>
          )}
        </div>

        <p className="detail-footer">
          Listed on WayFinder · Provider consented to listing
        </p>

      </div>
    </div>
  )
}