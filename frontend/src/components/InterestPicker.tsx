import type { Interest } from '../types'
import { Icon } from './Icon'

type InterestPickerProps = {
  interests: Interest[]
  selected: string[]
  saved: boolean
  onToggle: (id: string) => void
  onSave: () => void
}

export function InterestPicker({ interests, selected, saved, onToggle, onSave }: InterestPickerProps) {
  return (
    <section className="panel interest-panel" id="profile" aria-labelledby="interests-title">
      <div className="section-heading">
        <div>
          <span className="eyebrow eyebrow-dark">A LITTLE ABOUT YOU</span>
          <h2 id="interests-title">What makes you <span>come alive?</span></h2>
          <p>Pick a few things you love. We’ll use them to shape your adventures.</p>
        </div>
        <span className="selection-count">{selected.length} selected</span>
      </div>
      <div className="interest-grid">
        {interests.map((interest) => {
          const isSelected = selected.includes(interest.id)
          return (
            <button
              aria-pressed={isSelected}
              className={`interest-option${isSelected ? ' selected' : ''}`}
              key={interest.id}
              onClick={() => onToggle(interest.id)}
              type="button"
            >
              <span className="interest-icon"><Icon name={interest.icon} size={19} /></span>
              <span>{interest.label}</span>
              {isSelected && <Icon className="interest-check" name="check" size={15} />}
            </button>
          )
        })}
      </div>
      <div className="interest-footer">
        <span className={saved ? 'save-feedback visible' : 'save-feedback'} aria-live="polite">
          {saved ? 'Your interests are saved' : 'Choose as many as you like'}
        </span>
        <button className="button button-dark" onClick={onSave} type="button">
          Save interests <Icon name="arrow-right" size={16} />
        </button>
      </div>
    </section>
  )
}
