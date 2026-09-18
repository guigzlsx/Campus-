import React from 'react'

export function Card({ as: Component = 'section', className = '', children, ...props }) {
  return <Component className={`ds-card ${className}`.trim()} {...props}>{children}</Component>
}

export function PrimaryButton({ className = '', children, ...props }) {
  return <button className={`ds-button ds-button-primary ${className}`.trim()} {...props}>{children}</button>
}

export function SecondaryButton({ className = '', children, ...props }) {
  return <button className={`ds-button ds-button-secondary ${className}`.trim()} {...props}>{children}</button>
}

export function IconButton({ className = '', children, ...props }) {
  return <button className={`ds-icon-button ${className}`.trim()} {...props}>{children}</button>
}

export function SectionHeader({ eyebrow, title, description, action, className = '' }) {
  return <div className={`ds-section-header ${className}`.trim()}><div>{eyebrow && <div className="eyebrow">{eyebrow}</div>}<h2>{title}</h2>{description && <p>{description}</p>}</div>{action}</div>
}

export function MetricCard({ label, value, detail, className = '' }) {
  return <Card className={`metric-card ${className}`.trim()}><span className="metric-label">{label}</span><strong className="metric-value">{value}</strong>{detail && <span className="metric-detail">{detail}</span>}</Card>
}

export function ProgressRing({ value, size = 64, strokeWidth = 5, label }) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference
  return <div className="progress-ring" style={{ width: size, height: size }} aria-label={`${value}%`} role="img"><svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true"><circle className="progress-ring-track" cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth={strokeWidth} /><circle className="progress-ring-value" cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={offset} /></svg><strong>{label || `${value}%`}</strong></div>
}

export function BottomNav({ items, activeView, onNavigate, profileActive = false }) {
  return <nav className="bottom-nav" aria-label="Navigation mobile">{items.map((item) => <button key={item.id} className={activeView === item.id ? 'active' : ''} onClick={() => onNavigate(item.id)}>{item.icon}<span>{item.label}</span></button>)}<button className={profileActive ? 'active' : ''} onClick={() => onNavigate('profile')}><span className="bottom-nav-avatar">EM</span><span>Profil</span></button></nav>
}
