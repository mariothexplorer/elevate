import type { ReactNode } from 'react'

export type IconName =
  | 'activity'
  | 'arrow-right'
  | 'book'
  | 'check'
  | 'chevron-right'
  | 'clock'
  | 'compass'
  | 'landmark'
  | 'leaf'
  | 'menu'
  | 'palette'
  | 'sparkles'
  | 'users'

const paths: Record<IconName, ReactNode> = {
  activity: <><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></>,
  'arrow-right': <><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></>,
  book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" /></>,
  check: <><path d="m5 12 4 4L19 6" /></>,
  'chevron-right': <><path d="m9 18 6-6-6-6" /></>,
  clock: <><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>,
  compass: <><circle cx="12" cy="12" r="10" /><path d="m16.2 7.8-2.1 6.3-6.3 2.1 2.1-6.3 6.3-2.1Z" /></>,
  landmark: <><path d="m3 10 9-7 9 7" /><path d="M4 10h16" /><path d="M5 10v9M9 10v9M15 10v9M19 10v9" /><path d="M3 21h18" /></>,
  leaf: <><path d="M11 20A7 7 0 0 1 4 13c0-6 8-9 16-9 0 8-3 16-9 16Z" /><path d="M8 16c2-2 5-4 9-6" /></>,
  menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
  palette: <><circle cx="13.5" cy="6.5" r=".5" /><circle cx="17.5" cy="10.5" r=".5" /><circle cx="8.5" cy="7.5" r=".5" /><circle cx="6.5" cy="12.5" r=".5" /><path d="M12 22a10 10 0 1 1 10-10c0 1.7-1.3 3-3 3h-1.8c-.8 0-1.2.9-.7 1.5.5.7.8 1.4.8 2.2 0 1.8-1.5 3.3-3.3 3.3H12Z" /></>,
  sparkles: <><path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3Z" /><path d="m19 14 1.2 2.8L23 18l-2.8 1.2L19 22l-1.2-2.8L15 18l2.8-1.2L19 14Z" /></>,
  users: <><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="10" cy="7" r="4" /><path d="M20 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" /></>,
}

type IconProps = {
  name: IconName
  size?: number
  strokeWidth?: number
  className?: string
}

export function Icon({ name, size = 20, strokeWidth = 1.7, className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  )
}
