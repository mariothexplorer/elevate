import type { Quest } from '../types'
import { Icon } from './Icon'

type QuestCardProps = {
  quest: Quest | null
  onStart: () => void
  onComplete: () => void
  onNewQuest: () => void
  isLoading: boolean
  errorMessage: string | null
}

export function QuestCard({
  quest,
  onStart,
  onComplete,
  onNewQuest,
  isLoading,
  errorMessage,
}: QuestCardProps) {
  if (isLoading) {
    return (
      <section className="quest-feature quest-empty quest-loading" aria-live="polite">
        <div className="quest-empty-copy">
          <span className="eyebrow eyebrow-light"><Icon name="sparkles" size={14} /> YOUR NEXT CHAPTER</span>
          <h2>Finding your next adventure...</h2>
          <p>Taking a moment to find something that fits you.</p>
        </div>
        <QuestArtwork />
      </section>
    )
  }

  if (!quest) {
    return (
      <section className="quest-feature quest-empty" aria-labelledby="daily-quest-title">
        <div className="quest-empty-copy">
          <span className="eyebrow eyebrow-light"><Icon name="sparkles" size={14} /> YOUR NEXT CHAPTER</span>
          <h2 id="daily-quest-title">Ready for a little adventure?</h2>
          <p>{errorMessage ?? 'Your next side quest is just around the corner. Make today a day worth remembering.'}</p>
          <button className="button button-light" onClick={onNewQuest} type="button">
            {errorMessage ? 'Try again' : 'Get my daily quest'} <Icon name="arrow-right" size={17} />
          </button>
        </div>
        <QuestArtwork />
      </section>
    )
  }

  const inProgress = quest.status === 'in-progress'

  return (
    <section className="quest-feature" aria-labelledby="daily-quest-title">
      <div className="quest-content">
        <div className="quest-label-row">
          <span className="eyebrow eyebrow-light"><Icon name="sparkles" size={14} /> TODAY'S SIDE QUEST</span>
          <span className="quest-date">A small step, a big story.</span>
        </div>
        <div className="quest-details">
          {errorMessage && (
            <p className="quest-error" role="alert">
              {errorMessage} <button className="quest-retry" onClick={onNewQuest} type="button">Try again</button>
            </p>
          )}
          <span className="category-pill"><Icon name="compass" size={13} /> {quest.category}</span>
          <h2 id="daily-quest-title">{quest.title}</h2>
          <p>{quest.description}</p>
          <div className="quest-meta">
            <span><span className={`difficulty-dot ${quest.difficulty.toLowerCase()}`} />{quest.difficulty}</span>
            <span><Icon name="clock" size={15} />{quest.duration}</span>
          </div>
          <div className="quest-actions">
            {inProgress ? (
              <button className="button button-light" onClick={onComplete} type="button">
                <Icon name="check" size={17} /> Mark as complete
              </button>
            ) : (
              <button className="button button-light" onClick={onStart} type="button">
                Start quest <Icon name="arrow-right" size={17} />
              </button>
            )}
            <button className="text-button text-button-light" onClick={onNewQuest} type="button">
              {inProgress ? 'Find another quest' : 'Surprise me'}
            </button>
          </div>
        </div>
      </div>
      <QuestArtwork />
      <span className={`status-stamp ${inProgress ? 'status-in-progress' : ''}`}>
        <span className="status-stamp-dot" /> {inProgress ? 'IN PROGRESS' : 'MADE FOR YOU'}
      </span>
    </section>
  )
}

function QuestArtwork() {
  return (
    <div className="quest-art" aria-hidden="true">
      <div className="art-sun" />
      <div className="art-cloud art-cloud-one" />
      <div className="art-cloud art-cloud-two" />
      <div className="art-hill art-hill-back" />
      <div className="art-hill art-hill-front" />
      <div className="art-path" />
      <span className="art-star art-star-one">✳</span>
      <span className="art-star art-star-two">✳</span>
      <span className="art-star art-star-three">✳</span>
    </div>
  )
}
