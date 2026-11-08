import type { Interest, Quest } from '../types'

export const sampleQuests: Quest[] = [
  {
    id: 'scenic-route',
    title: 'Take the Scenic Route',
    description:
      "Choose a different route on your next walk. Explore a street or place you've never visited before.",
    difficulty: 'Easy',
    duration: '20 min',
    category: 'Exploration',
    status: 'ready',
  },
  {
    id: 'tiny-masterpiece',
    title: 'Make a Tiny Masterpiece',
    description:
      'Spend ten minutes making something with your hands. No plan, no pressure — just see what takes shape.',
    difficulty: 'Easy',
    duration: '15 min',
    category: 'Creativity',
    status: 'ready',
  },
  {
    id: 'new-conversation',
    title: 'Start a New Conversation',
    description:
      'Ask someone you see today what they are looking forward to. Give the answer your full attention.',
    difficulty: 'Medium',
    duration: '10 min',
    category: 'Social',
    status: 'ready',
  },
  {
    id: 'curiosity-hour',
    title: 'Follow a Curious Thought',
    description:
      'Look up something you have always wondered about, then share your favorite discovery with someone.',
    difficulty: 'Easy',
    duration: '25 min',
    category: 'Learning',
    status: 'ready',
  },
]

export const interests: Interest[] = [
  { id: 'creativity', label: 'Creativity', icon: 'palette' },
  { id: 'fitness', label: 'Fitness', icon: 'activity' },
  { id: 'learning', label: 'Learning', icon: 'book' },
  { id: 'nature', label: 'Nature', icon: 'leaf' },
  { id: 'social', label: 'Social', icon: 'users' },
  { id: 'technology', label: 'Technology', icon: 'sparkles' },
  { id: 'travel', label: 'Travel', icon: 'compass' },
  { id: 'culture', label: 'Culture', icon: 'landmark' },
]
