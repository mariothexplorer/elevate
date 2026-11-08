import { useState } from 'react'
import { onboardingQuestions } from '../data/onboardingQuestions'
import type { OnboardingAnswers, OnboardingQuestion } from '../types'
import { Icon } from './Icon'
import './OnboardingFlow.css'

type OnboardingFlowProps = {
  initialAnswers: OnboardingAnswers
  onComplete: (answers: OnboardingAnswers) => Promise<void>
}

type Screen = 'welcome' | 'questions' | 'complete'

export function OnboardingFlow({
  initialAnswers,
  onComplete,
}: OnboardingFlowProps) {
  const [screen, setScreen] = useState<Screen>('welcome')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState(initialAnswers)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const question = onboardingQuestions[questionIndex]
  const currentAnswer = question ? answers[question.id] ?? '' : ''

  const updateAnswer = (value: string) => {
    if (!question) return
    const updatedAnswers = { ...answers, [question.id]: value }
    if (!value.trim()) delete updatedAnswers[question.id]
    setAnswers(updatedAnswers)
  }

  const saveAndComplete = async () => {
    setIsSaving(true)
    setSaveError(null)
    try {
      await onComplete(answers)
    } catch {
      setSaveError('We could not save your answers. Check your connection and try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const goBack = () => {
    if (questionIndex === 0) {
      setScreen('welcome')
      return
    }
    setQuestionIndex((index) => index - 1)
  }

  const goForward = () => {
    if (!question) return
    if (question.kind === 'choice' && !currentAnswer) return
    if (questionIndex === onboardingQuestions.length - 1) {
      setScreen('complete')
      return
    }
    setQuestionIndex((index) => index + 1)
  }

  const skipQuestion = () => {
    updateAnswer('')
    if (questionIndex === onboardingQuestions.length - 1) {
      setScreen('complete')
      return
    }
    setQuestionIndex((index) => index + 1)
  }

  return (
    <main className="onboarding-shell">
      <header className="onboarding-header">
        <a className="brand onboarding-brand" href="#onboarding" aria-label="Elevate onboarding">
          <span className="brand-mark"><Icon name="sparkles" size={19} strokeWidth={2} /></span>
          <span>ELEVATE</span>
        </a>
        <span className="onboarding-header-note">A little more you. A little more adventure.</span>
      </header>

      {screen === 'welcome' && <WelcomeScreen onBegin={() => setScreen('questions')} />}
      {screen === 'questions' && question && (
        <QuestionScreen
          currentAnswer={currentAnswer}
          onBack={goBack}
          onChange={updateAnswer}
          onContinue={goForward}
          onSkip={skipQuestion}
          question={question}
          questionIndex={questionIndex}
        />
      )}
      {screen === 'complete' && (
        <CompleteScreen
          errorMessage={saveError}
          isSaving={isSaving}
          onComplete={saveAndComplete}
        />
      )}

      <footer className="onboarding-footer">
        Your answers are saved to your ELEVATE profile. Relevant answers are sent to the AI service when you request a quest.
      </footer>
    </main>
  )
}

function WelcomeScreen({ onBegin }: { onBegin: () => void }) {
  return (
    <section className="onboarding-card onboarding-welcome" aria-labelledby="onboarding-title">
      <div className="onboarding-welcome-art" aria-hidden="true">
        <div className="onboarding-welcome-sun" />
        <div className="onboarding-welcome-hill onboarding-welcome-hill-back" />
        <div className="onboarding-welcome-hill onboarding-welcome-hill-front" />
        <span className="onboarding-welcome-star">✳</span>
      </div>
      <div className="onboarding-welcome-copy">
        <span className="eyebrow eyebrow-dark">YOUR NEXT CHAPTER STARTS HERE</span>
        <h1 id="onboarding-title">Let’s make room for <span>more you.</span></h1>
        <p>
          A few quick questions help us shape little adventures around what you enjoy,
          what matters to you, and how you like to explore.
        </p>
        <div className="onboarding-welcome-parts">
          <span><b>01</b> Five quick multiple-choice questions</span>
          <span><b>02</b> Five optional questions, all yours to skip</span>
        </div>
        <button className="button button-dark onboarding-primary" onClick={onBegin} type="button">
          Let’s begin <Icon name="arrow-right" size={17} />
        </button>
        <p className="onboarding-privacy-note">
          Your answers are saved to your ELEVATE profile. Relevant answers are sent to the AI service
          when you request a quest. You can clear them at any time.
        </p>
      </div>
    </section>
  )
}

type QuestionScreenProps = {
  currentAnswer: string
  onBack: () => void
  onChange: (value: string) => void
  onContinue: () => void
  onSkip: () => void
  question: OnboardingQuestion
  questionIndex: number
}

function QuestionScreen({
  currentAnswer,
  onBack,
  onChange,
  onContinue,
  onSkip,
  question,
  questionIndex,
}: QuestionScreenProps) {
  const questionNumber = questionIndex + 1
  const isPersonal = question.part === 'personal'

  return (
    <section className="onboarding-card onboarding-question" aria-labelledby="question-title">
      <div
        className="onboarding-progress-track"
        role="progressbar"
        aria-label="Questionnaire progress"
        aria-valuemin={1}
        aria-valuemax={onboardingQuestions.length}
        aria-valuenow={questionNumber}
      >
        <span style={{ width: `${(questionNumber / onboardingQuestions.length) * 100}%` }} />
      </div>
      <div className="onboarding-question-inner">
        <div className="onboarding-question-topline">
          <span className="eyebrow eyebrow-dark">
            {isPersonal ? 'PART 02 · PERSONAL, OPTIONAL' : 'PART 01 · THE GENERAL'}
          </span>
          <span className="onboarding-counter">
            {questionNumber} <span>of</span> {onboardingQuestions.length}
          </span>
        </div>
        <div className="onboarding-question-body">
          <div className="onboarding-question-index" aria-hidden="true">
            {String(questionNumber).padStart(2, '0')}
          </div>
          <div className="onboarding-question-content">
            <h1 id="question-title">{question.prompt}</h1>
            {question.kind === 'choice' ? (
              <div className="onboarding-choice-list" role="group" aria-labelledby="question-title">
                {question.options.map((option) => (
                  <button
                    aria-pressed={currentAnswer === option.label}
                    className={`onboarding-choice${currentAnswer === option.label ? ' selected' : ''}`}
                    key={option.letter}
                    onClick={() => onChange(option.label)}
                    type="button"
                  >
                    <span className="choice-letter">{option.letter}</span>
                    <span className="choice-label">{option.label}</span>
                    <span className="choice-indicator" aria-hidden="true">
                      {currentAnswer === option.label && <Icon name="check" size={15} />}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="onboarding-text-answer">
                <label className="visually-hidden" htmlFor={`answer-${question.id}`}>
                  Your answer (optional)
                </label>
                <textarea
                  id={`answer-${question.id}`}
                  maxLength={500}
                  onChange={(event) => onChange(event.target.value)}
                  placeholder="Share as much or as little as you like..."
                  rows={5}
                  value={currentAnswer}
                />
                <span className="onboarding-character-count">{currentAnswer.length}/500</span>
                <span className="onboarding-optional-note">Optional — you can skip this question.</span>
              </div>
            )}
          </div>
        </div>
        <div className="onboarding-question-actions">
          <button className="onboarding-back-button" onClick={onBack} type="button">
            <Icon name="arrow-right" size={15} className="back-arrow" /> Back
          </button>
          <div className="onboarding-next-actions">
            {isPersonal && (
              <button className="onboarding-skip-button" onClick={onSkip} type="button">
                Skip
              </button>
            )}
            <button
              className="button button-dark onboarding-continue"
              disabled={question.kind === 'choice' && !currentAnswer}
              onClick={onContinue}
              type="button"
            >
              {questionIndex === onboardingQuestions.length - 1 ? 'Finish questions' : 'Continue'}
              <Icon name="arrow-right" size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

function CompleteScreen({
  errorMessage,
  isSaving,
  onComplete,
}: {
  errorMessage: string | null
  isSaving: boolean
  onComplete: () => void
}) {
  return (
    <section className="onboarding-card onboarding-complete" aria-labelledby="onboarding-complete-title">
      <div className="onboarding-complete-mark"><Icon name="sparkles" size={27} /></div>
      <span className="eyebrow eyebrow-dark">THAT’S A WRAP</span>
      <h1 id="onboarding-complete-title">Your next adventure looks <span>like you.</span></h1>
      <p>
        Thanks for sharing a little about yourself. Your answers are saved to your ELEVATE profile
        and will help make your quests feel more personal.
      </p>
      {errorMessage && <p className="onboarding-save-error" role="alert">{errorMessage}</p>}
      <button
        className="button button-dark onboarding-primary"
        disabled={isSaving}
        onClick={onComplete}
        type="button"
      >
        {isSaving ? 'Saving your answers...' : 'Start exploring'}
        {!isSaving && <Icon name="arrow-right" size={17} />}
      </button>
    </section>
  )
}
