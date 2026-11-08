import { Icon } from './Icon'

type NavigationProps = {
  onSignOut: () => void
  signingOut: boolean
}

const links = [
  { label: 'Home', href: '#home' },
  { label: 'My quests', href: '#my-quests' },
  { label: 'Profile', href: '#profile' },
]

export function Navigation({ onSignOut, signingOut }: NavigationProps) {
  return (
    <header className="topbar">
      <a className="brand" href="#home" aria-label="Elevate home">
        <span className="brand-mark"><Icon name="sparkles" size={19} strokeWidth={2} /></span>
        <span>ELEVATE</span>
      </a>
      <nav className="main-nav" aria-label="Main navigation">
        {links.map((link, index) => (
          <a
            className={index === 0 ? 'nav-link active' : 'nav-link'}
            href={link.href}
            key={link.href}
          >
            {link.label}
          </a>
        ))}
      </nav>
      <div className="profile-actions">
        <a className="profile-link" href="#profile" aria-label="Your profile">
          <span className="profile-avatar">E</span>
          <span className="profile-name">Your profile</span>
          <Icon name="chevron-right" size={15} />
        </a>
        <button className="sign-out-button" disabled={signingOut} onClick={onSignOut} type="button">
          {signingOut ? 'Signing out...' : 'Sign out'}
        </button>
      </div>
    </header>
  )
}
