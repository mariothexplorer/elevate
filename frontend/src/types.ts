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
