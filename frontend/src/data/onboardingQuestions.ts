import type { OnboardingQuestion } from '../types'

export const onboardingQuestions: OnboardingQuestion[] = [
  {
    id: 'personality',
    part: 'general',
    kind: 'choice',
    prompt: 'How would you describe yourself?',
    options: [
      { letter: 'A', label: 'Introverted' },
      { letter: 'B', label: 'Extroverted' },
      { letter: 'C', label: 'A bit of both' },
      { letter: 'D', label: 'It depends on the situation' },
    ],
  },
  {
    id: 'favoriteActivity',
    part: 'general',
    kind: 'choice',
    prompt: 'What do you enjoy doing the most?',
    options: [
      { letter: 'A', label: 'Learning and discovering new things' },
      { letter: 'B', label: 'Being active and playing sports' },
      { letter: 'C', label: 'Spending time with people' },
      { letter: 'D', label: 'Creating, building, or exploring' },
    ],
  },
  {
    id: 'freeTime',
    part: 'general',
    kind: 'choice',
    prompt: 'How do you usually spend your free time?',
    options: [
      { letter: 'A', label: 'Relaxing at home' },
      { letter: 'B', label: 'Going out with friends' },
      { letter: 'C', label: 'Working on personal interests or hobbies' },
      { letter: 'D', label: 'Exploring new places and experiences' },
    ],
  },
  {
    id: 'comfortZone',
    part: 'general',
    kind: 'choice',
    prompt: 'How comfortable are you with stepping outside your comfort zone?',
    options: [
      { letter: 'A', label: 'I prefer staying in my comfort zone' },
      { letter: 'B', label: 'I occasionally try new things' },
      { letter: 'C', label: 'I enjoy challenging myself' },
      { letter: 'D', label: 'I actively seek new challenges' },
    ],
  },
  {
    id: 'selfImprovement',
    part: 'general',
    kind: 'choice',
    prompt: 'What would you most like to improve about yourself?',
    options: [
      { letter: 'A', label: 'Physical health and fitness' },
      { letter: 'B', label: 'Confidence and social skills' },
      { letter: 'C', label: 'Knowledge and abilities' },
      { letter: 'D', label: 'Discipline and productivity' },
    ],
  },
  {
    id: 'aspiration',
    part: 'personal',
    kind: 'text',
    prompt: "What is something you've always wanted to do but never dared to try?",
  },
  {
    id: 'desiredChange',
    part: 'personal',
    kind: 'text',
    prompt: 'What is one thing you wish you could change about yourself?',
  },
  {
    id: 'fearOfMissingOut',
    part: 'personal',
    kind: 'text',
    prompt: 'What are you most afraid of missing out on in life?',
  },
  {
    id: 'proudMoment',
    part: 'personal',
    kind: 'text',
    prompt: 'When was the last time you felt truly proud of yourself?',
  },
  {
    id: 'futureSelf',
    part: 'personal',
    kind: 'text',
    prompt: 'What kind of person do you want to become?',
  },
]
