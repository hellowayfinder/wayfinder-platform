import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CONFIG from '../config'
import './Feedback.css'

type Option = string

interface Question {
  id: string
  label: string
  required: boolean
  options?: Option[]
  type: 'radio' | 'textarea'
}

const QUESTIONS: Question[] = [
  {
    id: 'found',
    label: 'Did you find a provider you were looking for today?',
    required: true,
    type: 'radio',
    options: [
      'Yes — found exactly what I needed',
      'Almost — not quite what I needed',
      'No — couldn\'t find what I was looking for',
    ],
  },
  {
    id: 'contacted',
    label: 'Did you contact any provider through WayFinder?',
    required: true,
    type: 'radio',
    options: [
      'Yes — I sent them a WhatsApp',
      'Not yet but I plan to',
      'No',
    ],
  },
  {
    id: 'missing',
    label: 'Is there a type of provider you couldn\'t find?',
    required: false,
    type: 'textarea',
  },
  {
    id: 'other',
    label: 'Anything else you\'d like to tell us?',
    required: false,
    type: 'textarea',
  },
]

export default function Feedback() {
  const navigate = useNavigate()
  const [answers, setAnswers]   = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [error, setError]         = useState('')

  const useEmbed = CONFIG.FEEDBACK_FORM_URL !== 'YOUR_GOOGLE_FORM_3_EMBED_URL_HERE'

  function handleRadio(id: string, value: string) {
    setAnswers(prev => ({ ...prev, [id]: value }))
    setError('')
  }

  function handleTextarea(id: string, value: string) {
    setAnswers(prev => ({ ...prev, [id]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const missing = QUESTIONS.filter(q => q.required && !answers[q.id])
    if (missing.length > 0) {
      setError('Please answer the required questions before submitting.')
      return
    }
    // In production this posts to your Google Form via the embed
    // For now we mark as submitted
    setSubmitted(true)
  }

  // If Google Form URL is configured — embed it directly
  if (useEmbed) {
    return (
      <div className="feedback">
        <header className="feedback-header">
          <button className="back-btn" onClick={() => navigate(-1)} aria-label="Go back">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M11 4L6 9l5 5" stroke="currentColor" strokeWidth="1.6"
                strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back
          </button>
        </header>
        <iframe
          src={CONFIG.FEEDBACK_FORM_URL}
          className="feedback-embed"
          title="WayFinder Feedback Form"
          frameBorder="0"
          marginHeight={0}
          marginWidth={0}
        >
          Loading…
        </iframe>
      </div>
    )
  }

  // Native form — used during development or if no embed URL is set
  if (submitted) {
    return (
      <div className="feedback">
        <header className="feedback-header">
          <button className="back-btn" onClick={() => navigate('/')} aria-label="Go home">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M11 4L6 9l5 5" stroke="currentColor" strokeWidth="1.6"
                strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to directory
          </button>
        </header>
        <div className="feedback-success">
          <div className="success-icon" aria-hidden="true">🙏</div>
          <h2 className="success-title">Thank you!</h2>
          <p className="success-sub">
            Your feedback genuinely helps us improve WayFinder for every family in Chennai.
          </p>
          <button className="success-btn" onClick={() => navigate('/')}>
            Back to providers
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="feedback">
      <header className="feedback-header">
        <button className="back-btn" onClick={() => navigate(-1)} aria-label="Go back">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M11 4L6 9l5 5" stroke="currentColor" strokeWidth="1.6"
              strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </button>
      </header>

      <div className="feedback-body">
        <h1 className="feedback-title">Give feedback</h1>
        <p className="feedback-sub">Takes 45 seconds. Helps us improve WayFinder for every family.</p>

        <form onSubmit={handleSubmit} className="feedback-form" noValidate>
          {QUESTIONS.map((q, i) => (
            <div key={q.id} className="feedback-question">
              <p className="question-label">
                {i + 1}. {q.label}
                {q.required
                  ? <span className="required-mark"> *</span>
                  : <span className="optional-mark"> (optional)</span>}
              </p>

              {q.type === 'radio' && q.options && (
                <div className="radio-group" role="radiogroup" aria-label={q.label}>
                  {q.options.map(opt => (
                    <button
                      key={opt}
                      type="button"
                      className={`radio-option ${answers[q.id] === opt ? 'radio-selected' : ''}`}
                      onClick={() => handleRadio(q.id, opt)}
                      aria-pressed={answers[q.id] === opt}
                    >
                      <span className="radio-dot" aria-hidden="true" />
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {q.type === 'textarea' && (
                <textarea
                  className="feedback-textarea"
                  rows={3}
                  placeholder={
                    q.id === 'missing'
                      ? 'e.g. Hindi-speaking OT, speech therapist for teenagers, someone in Tambaram…'
                      : 'Your thoughts…'
                  }
                  value={answers[q.id] ?? ''}
                  onChange={e => handleTextarea(q.id, e.target.value)}
                  aria-label={q.label}
                />
              )}
            </div>
          ))}

          {error && <p className="feedback-error">{error}</p>}

          <button type="submit" className="submit-btn">
            Submit feedback
          </button>
        </form>
      </div>
    </div>
  )
}