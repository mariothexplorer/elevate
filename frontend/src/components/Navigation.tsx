import { Icon } from './Icon'

const links = [
  { label: 'Home', href: '#home' },
  { label: 'My quests', href: '#my-quests' },
  { label: 'Profile', href: '#profile' },
]

export function Navigation() {
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
      <a className="profile-link" href="#profile" aria-label="Your profile">
        <span className="profile-avatar">M</span>
        <span className="profile-name">Maya</span>
        <Icon name="chevron-right" size={15} />
      </a>
    </header>
  )
}
