import BackendTest from "./BackendTest";
import { useState } from 'react'
import { InterestPicker } from './components/InterestPicker'
import { MyQuests } from './components/MyQuests'
import { Navigation } from './components/Navigation'
import { QuestCard } from './components/QuestCard'
import { Icon } from './components/Icon'
import { interests, sampleQuests } from './data/quests'
import type { Quest } from './types'
import './App.css'

type GeneratedQuestData = Pick<Quest, 'title' | 'description' | 'difficulty' | 'duration' | 'category'>

function isGeneratedQuest(data: unknown): data is GeneratedQuestData {
  if (typeof data !== 'object' || data === null) return false

  return (
    'title' in data &&
    typeof data.title === 'string' &&
    'description' in data &&
    typeof data.description === 'string' &&
    'difficulty' in data &&
    (data.difficulty === 'Easy' || data.difficulty === 'Medium' || data.difficulty === 'Hard') &&
    'duration' in data &&
    typeof data.duration === 'string' &&
    'category' in data &&
    typeof data.category === 'string'
  )
}

function App() {
  const [currentQuest, setCurrentQuest] = useState<Quest | null>({
    ...sampleQuests[0],
  })
  const [completedQuests, setCompletedQuests] = useState<Quest[]>([])
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['nature', 'travel'])
  const [savedInterests, setSavedInterests] = useState<string[]>(['nature', 'travel'])
  const [interestsSaved, setInterestsSaved] = useState(false)
  const [isLoadingQuest, setIsLoadingQuest] = useState(false)
  const [questError, setQuestError] = useState<string | null>(null)

  const getNextQuest = async () => {
    if (isLoadingQuest) return

    setIsLoadingQuest(true)
    setQuestError(null)

    try {
      const selectedInterestNames = interests
        .filter((interest) => selectedInterests.includes(interest.id))
        .map((interest) => interest.label)

      const response = await fetch('http://127.0.0.1:8000/generate-quest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ interests: selectedInterestNames }),
      })

      if (!response.ok) {
        throw new Error(`The quest server responded with status ${response.status}.`)
      }

      const data: unknown = await response.json()
      if (!isGeneratedQuest(data)) {
        throw new Error('The quest server returned an invalid response.')
      }

      setCurrentQuest({
        ...data,
        id: `generated-${Date.now()}`,
        status: 'ready',
      })
    } catch (error) {
      console.error('Could not generate a quest:', error)
      setQuestError(
        error instanceof TypeError
          ? 'Could not connect to the quest server. Make sure the backend is running and try again.'
          : error instanceof Error
            ? error.message
            : 'Something went wrong while getting your quest. Please try again.',
      )
    } finally {
      setIsLoadingQuest(false)
    }
  }

  const startQuest = () => {
    setCurrentQuest((quest) => quest ? { ...quest, status: 'in-progress' } : quest)
  }

  const completeQuest = () => {
    if (!currentQuest) return
    setCompletedQuests((quests) => [{ ...currentQuest, status: 'completed' }, ...quests])
    setCurrentQuest(null)
  }

  const toggleInterest = (id: string) => {
    setSelectedInterests((selected) =>
      selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id],
    )
    setInterestsSaved(false)
  }

  const saveInterests = () => {
    setSavedInterests(selectedInterests)
    setInterestsSaved(true)
  }

  return (
    <div className="app-shell">
      <Navigation />
      <main>
        <section className="welcome-section" id="home">
          <div className="welcome-copy">
            <span className="welcome-kicker"><span className="kicker-line" /> A DIFFERENT KIND OF EVERYDAY</span>
            <h1>Life is an adventure.<br /><span>Start exploring.</span></h1>
            <p>Discover new experiences, challenge yourself, and make every day count.</p>
            <a className="button button-dark welcome-button" href="#daily-quest" onClick={getNextQuest}>
              Get my daily quest <Icon name="arrow-right" size={17} />
            </a>
            <div className="welcome-note">
              <span className="avatar-stack" aria-hidden="true"><i>M</i><i>J</i><i>A</i></span>
              <span>Little adventures. <strong>Big feelings.</strong></span>
            </div>
          </div>
          <div className="welcome-visual" aria-hidden="true">
            <div className="visual-sun" />
            <div className="visual-sun-halo" />
            <div className="visual-hill visual-hill-back" />
            <div className="visual-hill visual-hill-middle" />
            <div className="visual-hill visual-hill-front" />
            <div className="visual-path" />
            <span className="visual-sparkle sparkle-one">✳</span>
            <span className="visual-sparkle sparkle-two">✳</span>
            <span className="visual-caption">TAKE THE LONG WAY HOME</span>
            <span className="visual-coordinate">37°46'49.0"N&nbsp;&nbsp; 122°25'09.0"W</span>
          </div>
        </section>

        <section className="daily-section" id="daily-quest">
          <div className="section-intro">
            <div>
              <span className="eyebrow eyebrow-dark">A MOMENT FOR YOU</span>
              <h2>Today, try something <span>different.</span></h2>
            </div>
            <span className="day-indicator"><span className="day-indicator-dot" /> YOUR DAILY SPARK</span>
          </div>
          <QuestCard
            quest={currentQuest}
            onStart={startQuest}
            onComplete={completeQuest}
            onNewQuest={getNextQuest}
            isLoading={isLoadingQuest}
            errorMessage={questError}
          />
        </section>

        <section className="personalize-section">
          <div className="personalize-note">
            <span className="eyebrow eyebrow-dark">MADE FOR YOUR KIND OF CURIOUS</span>
            <h2>A little more <span>you.</span></h2>
            <p>No two adventures are alike. Tell us what makes you tick and your quests will feel a little more like yours.</p>
            <div className="personalize-flourish" aria-hidden="true"><span>✳</span><span>✳</span><span>✳</span></div>
          </div>
          <InterestPicker
            interests={interests}
            selected={selectedInterests}
            saved={interestsSaved && selectedInterests.join('|') === savedInterests.join('|')}
            onToggle={toggleInterest}
            onSave={saveInterests}
          />
        </section>

        <MyQuests currentQuest={currentQuest} completedQuests={completedQuests} />
      </main>
      <footer className="site-footer">
        <a className="brand footer-brand" href="#home">
          <span className="brand-mark"><Icon name="sparkles" size={17} strokeWidth={2} /></span>
          <span>ELEVATE</span>
        </a>
        <span>Make room for the unexpected.</span>
        <a className="back-to-top" href="#home">Back to the beginning <Icon name="arrow-right" size={14} /></a>
      </footer>
    <BackendTest />

    </div>
    
  )
}

export default App
