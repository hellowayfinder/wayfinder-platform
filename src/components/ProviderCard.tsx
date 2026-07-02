import { useNavigate } from 'react-router-dom'
import { analytics } from '../utils/analytics'
import type { Provider } from '../types'
import './ProviderCard.css'

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

interface Props {
  provider: Provider
}

export default function ProviderCard({ provider }: Props) {
  const navigate = useNavigate()
  const color = avatarColor(provider.id)

  function handleTap() {
    analytics.providerViewed(provider.id, provider.name)
    navigate(`/provider/${provider.id}`)
  }

  return (
    <button
      className="provider-card"
      onClick={handleTap}
      aria-label={`View ${provider.name}`}
    >
      <div className="card-header">
        <div
          className="avatar"
          style={{ background: color.bg, color: color.text }}
          aria-hidden="true"
        >
          {provider.initials}
        </div>
        <div className="card-title-block">
          <h3 className="card-name">{provider.name}</h3>
          <p className="card-meta">
            {provider.practice === 'Centre'
              ? provider.centreLocality
              : provider.practice === 'Home Visits'
              ? `Home visits · ${provider.hvLocalities.slice(0, 2).join(', ')}${provider.hvLocalities.length > 2 ? '…' : ''}`
              : `${provider.centreLocality} · also home visits`}
          </p>
        </div>
        <svg className="chevron" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      <div className="card-tags">
        {provider.services.map(s => (
          <span key={s} className="tag tag-service">{s}</span>
        ))}
        {provider.conditions.slice(0, 3).map(c => (
          <span key={c} className="tag tag-condition">{c}</span>
        ))}
      </div>

      {provider.trustBadge && (
        <div className="trust-badge">
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M8 1l2 4.5H15l-4 3 1.5 5L8 11l-4.5 2.5L5 8.5 1 5.5h5z" fill="#0f6e56" opacity=".9"/>
          </svg>
          {provider.trustBadge}
        </div>
      )}
    </button>
  )
}