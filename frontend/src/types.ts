export type QuestStatus = 'ready' | 'in-progress' | 'completed'

export type Quest = {
  id: string
  title: string
  description: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  duration: string
  category: string
  status: QuestStatus
}

export type Interest = {
  id: string
  label: string
  icon: 'palette' | 'activity' | 'book' | 'leaf' | 'users' | 'sparkles' | 'compass' | 'landmark'
}

export type OnboardingQuestionId =
  | 'personality'
  | 'favoriteActivity'
  | 'freeTime'
  | 'comfortZone'
  | 'selfImprovement'
  | 'aspiration'
  | 'desiredChange'
  | 'fearOfMissingOut'
  | 'proudMoment'
  | 'futureSelf'

export type OnboardingAnswers = Partial<Record<OnboardingQuestionId, string>>

export type OnboardingQuestion =
  | {
      id: OnboardingQuestionId
      part: 'general'
      kind: 'choice'
      prompt: string
      options: { letter: 'A' | 'B' | 'C' | 'D'; label: string }[]
    }
  | {
      id: OnboardingQuestionId
      part: 'personal'
      kind: 'text'
      prompt: string
    }
