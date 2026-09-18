import React, { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { AppTheme } from './designSystem'
import { BottomNav, Card, IconButton, ProgressRing, SectionHeader } from './ui'
import './styles.css'

const navItems = [
  { id: 'home', label: 'Accueil', icon: 'home' },
  { id: 'search', label: 'Rechercher', icon: 'search' },
  { id: 'agenda', label: 'Agenda', icon: 'bookmark' },
  { id: 'map', label: 'Carte du campus', icon: 'location' },
  { id: 'notifications', label: 'Notifications', icon: 'bell', badge: 3 },
]

const events = [
  { id: 1, day: '18', month: 'SEP', title: 'Atelier CV & portfolio', place: 'Bâtiment B · Salle 204', time: '18:00 — 19:30', color: 'coral', tag: 'À ne pas manquer' },
  { id: 2, day: '19', month: 'SEP', title: 'Permanence internationale', place: 'Maison des étudiants', time: '12:30 — 14:00', color: 'mint', tag: 'Pour toi' },
  { id: 3, day: '22', month: 'SEP', title: 'Conférence Product design', place: 'Amphi Central', time: '17:00 — 18:30', color: 'lavender', tag: 'Nouveau' },
]

const notificationsSeed = [
  { id: 1, type: 'agenda', title: 'Ton atelier commence demain', body: 'Atelier CV & portfolio · Bâtiment B · 18:00', time: 'Il y a 12 min', unread: true, color: 'coral' },
  { id: 2, type: 'info', title: 'La bibliothèque ferme plus tôt vendredi', body: 'Fermeture exceptionnelle à 17:00. Pense à anticiper.', time: 'Il y a 1 h', unread: true, color: 'amber' },
  { id: 3, type: 'campus', title: 'Nouveau point restauration ouvert', body: 'Le comptoir végétal est ouvert au rez-de-chaussée du Bâtiment C.', time: 'Hier', unread: true, color: 'mint' },
  { id: 4, type: 'message', title: 'Ton dossier de mobilité est à jour', body: 'Aucune action supplémentaire n’est nécessaire.', time: 'Lundi', unread: false, color: 'lavender' },
]

const searchResults = [
  { id: 1, type: 'Salle', title: 'Salle 204 — Bâtiment B', detail: 'Disponible maintenant · 12 places', icon: '▦', color: 'coral' },
  { id: 2, type: 'Événement', title: 'Atelier CV & portfolio', detail: 'Demain · 18:00 · Bâtiment B', icon: '◷', color: 'mint' },
  { id: 3, type: 'Service', title: 'Bureau des stages', detail: 'Bâtiment A · ouvert jusqu’à 17:30', icon: '✦', color: 'lavender' },
  { id: 4, type: 'Ressource', title: 'Guide de mobilité internationale', detail: 'Document · Mis à jour cette semaine', icon: '↗', color: 'amber' },
]

function Icon({ name, size = 18, stroke = 1.9 }) {
  const paths = {
    arrow: <><path d="M4 12h15"/><path d="m13 6 6 6-6 6"/></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>,
    bookmark: <path d="M6 4.8A2.8 2.8 0 0 1 8.8 2h6.4A2.8 2.8 0 0 1 18 4.8V22l-6-3-6 3Z"/>,
    check: <path d="m5 12 4 4L19 6"/>,
    chevron: <path d="m7 10 5 5 5-5"/>,
    close: <><path d="m6 6 12 12"/><path d="m18 6-12 12"/></>,
    compass: <><circle cx="12" cy="12" r="8.5"/><path d="m15.5 8.5-2.2 4.8-4.8 2.2 2.2-4.8Z"/></>,
    filter: <><path d="M4 6h16"/><path d="M7 12h10"/><path d="M10 18h4"/></>,
    home: <><path d="m3 10 9-7 9 7"/><path d="M5 9v10h14V9"/><path d="M9 19v-6h6v6"/></>,
    location: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
    menu: <><path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/></>,
    search: <><circle cx="10.8" cy="10.8" r="6.7"/><path d="m16 16 4.5 4.5"/></>,
    spark: <><path d="m12 2 1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6Z"/><path d="m19 17 .6 2.4L22 20l-2.4.6L19 23l-.6-2.4L16 20l2.4-.6Z"/></>,
    user: <><circle cx="12" cy="8" r="3.5"/><path d="M5 21c.7-3.4 3-5 7-5s6.3 1.6 7 5"/></>,
  }
  return <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

function Avatar({ initials = 'GLS', small = false }) {
  return <div className={`avatar ${small ? 'avatar-small' : ''}`} aria-label="Profil de Guillaume Le Saux">{initials}</div>
}

function App() {
  const [activeView, setActiveView] = useState('home')
  const [query, setQuery] = useState('')
  const [notifications, setNotifications] = useState(notificationsSeed)
  const [savedEvents, setSavedEvents] = useState([2])
  const [selectedDay, setSelectedDay] = useState('Cette semaine')
  const [selectedPlace, setSelectedPlace] = useState('Bibliothèque')
  const [profileEdit, setProfileEdit] = useState(false)
  const [preferences, setPreferences] = useState({ push: true, agenda: true, places: false })
  const [toast, setToast] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchFilter, setSearchFilter] = useState('Tous')
  const [notificationFilter, setNotificationFilter] = useState('Toutes')
  const [mapQuery, setMapQuery] = useState('')
  const [savedPlaces, setSavedPlaces] = useState([])
  const [agendaEvents, setAgendaEvents] = useState(events)

  const unreadCount = notifications.filter((notification) => notification.unread).length
  const filteredResults = useMemo(() => {
    const byType = searchFilter === 'Tous' ? searchResults : searchResults.filter((result) => result.type === searchFilter)
    if (!query.trim()) return byType
    return byType.filter((result) => `${result.title} ${result.detail} ${result.type}`.toLowerCase().includes(query.toLowerCase()))
  }, [query, searchFilter])

  function showToast(message) {
    setToast(message)
    window.clearTimeout(window.__campusToastTimer)
    window.__campusToastTimer = window.setTimeout(() => setToast(''), 2400)
  }

  function navigate(view) {
    setActiveView(view)
    if (view !== 'search') setQuery('')
    setMobileMenuOpen(false)
  }

  function toggleEvent(id) {
    setSavedEvents((current) => current.includes(id) ? current.filter((eventId) => eventId !== id) : [...current, id])
  }

  function markAllRead() {
    setNotifications((current) => current.map((notification) => ({ ...notification, unread: false })))
    showToast('Toutes les notifications sont marquées comme lues.')
  }

  function addDemoEvent() {
    const newEvent = { id: 99, day: '25', month: 'SEP', title: 'Session projet Campus+', place: 'Espace coworking · Salle 12', time: '14:00 — 15:30', color: 'amber', tag: 'Ajouté par toi' }
    setAgendaEvents((current) => current.some((event) => event.id === newEvent.id) ? current : [...current, newEvent])
    setSavedEvents((current) => current.includes(newEvent.id) ? current : [...current, newEvent.id])
    showToast('Événement simulé ajouté à ton agenda.')
  }

  function toggleSavedPlace(placeName) {
    const alreadySaved = savedPlaces.includes(placeName)
    setSavedPlaces((current) => alreadySaved ? current.filter((place) => place !== placeName) : [...current, placeName])
    showToast(alreadySaved ? `${placeName} retiré de tes favoris.` : `${placeName} enregistré dans tes favoris.`)
  }

  function openSearchResult(result) {
    if (result.type === 'Salle') {
      navigate('map')
      setSelectedPlace('Bâtiment B')
      showToast(`${result.title} ouvert sur la carte.`)
      return
    }
    if (result.type === 'Événement') {
      navigate('agenda')
      showToast(`${result.title} ouvert dans l’agenda.`)
      return
    }
    showToast(`${result.title} sélectionné.`)
  }

  function renderView() {
    if (activeView === 'search') return <SearchView query={query} setQuery={setQuery} results={filteredResults} navigate={navigate} searchFilter={searchFilter} setSearchFilter={setSearchFilter} onResultOpen={openSearchResult} showToast={showToast} />
    if (activeView === 'agenda') return <AgendaView selectedDay={selectedDay} setSelectedDay={setSelectedDay} savedEvents={savedEvents} toggleEvent={toggleEvent} events={agendaEvents} onAddEvent={addDemoEvent} />
    if (activeView === 'map') return <MapView selectedPlace={selectedPlace} setSelectedPlace={setSelectedPlace} mapQuery={mapQuery} setMapQuery={setMapQuery} savedPlaces={savedPlaces} toggleSavedPlace={toggleSavedPlace} showToast={showToast} />
    if (activeView === 'notifications') return <NotificationsView notifications={notifications} markAllRead={markAllRead} notificationFilter={notificationFilter} setNotificationFilter={setNotificationFilter} preferences={preferences} setPreferences={setPreferences} showToast={showToast} />
    if (activeView === 'profile') return <ProfileView profileEdit={profileEdit} setProfileEdit={setProfileEdit} preferences={preferences} setPreferences={setPreferences} />
    return <HomeView navigate={navigate} savedEvents={savedEvents} toggleEvent={toggleEvent} showToast={showToast} />
  }

  return (
    <div className="app-shell" data-theme="campus-plus" style={{ '--ds-accent': AppTheme.colors.olive }}>
      <aside className="sidebar">
        <div className="brand-lockup" onClick={() => navigate('home')} role="button" tabIndex="0">
          <div className="brand-mark"><span></span><span></span><span></span></div>
          <div><div className="brand-name">Campus<span>+</span></div><div className="brand-subtitle">Ton campus, simplement.</div></div>
        </div>

        <div className="sidebar-label">Explorer</div>
        <nav className="main-nav" aria-label="Navigation principale">
          {navItems.map((item) => (
            <button key={item.id} className={`nav-item ${activeView === item.id ? 'active' : ''}`} onClick={() => navigate(item.id)}>
              <span className="nav-icon"><Icon name={item.icon} size={18} /></span><span>{item.label}</span>
              {item.id === 'notifications' && unreadCount > 0 && <span className="nav-badge">{unreadCount}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-divider" />
        <button className={`student-card ${activeView === 'profile' ? 'student-card-active' : ''}`} onClick={() => navigate('profile')}>
          <div className="student-card-top"><div className="mini-logo">C+</div><span>Carte étudiante</span><Icon name="arrow" size={15} /></div>
          <div className="student-card-name">Guillaume Le Saux</div>
          <div className="student-card-meta">M2 · Product Management</div>
          <div className="student-card-bar"><span></span></div>
        </button>

        <div className="sidebar-bottom">
          <div className="prototype-note"><span className="status-dot"></span><div><strong>Mode maquette</strong><small>Données locales · MVP</small></div></div>
          <button className="profile-shortcut" onClick={() => navigate('profile')}><Avatar small /><span>Guillaume Le Saux</span><span className="more-dots">•••</span></button>
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div className="mobile-brand"><div className="brand-mark"><span></span><span></span><span></span></div><span>Campus<span>+</span></span></div>
          <div className="breadcrumb"><span>Campus+</span><span className="breadcrumb-separator">/</span><strong>{navItems.find((item) => item.id === activeView)?.label || (activeView === 'profile' ? 'Profil' : 'Accueil')}</strong></div>
          <div className="topbar-actions">
            <IconButton className="icon-button mobile-menu" onClick={() => setMobileMenuOpen((current) => !current)} aria-label="Ouvrir le menu"><Icon name="menu" /></IconButton>
            <IconButton className="icon-button" onClick={() => navigate('notifications')} aria-label="Voir les notifications"><Icon name="bell" />{unreadCount > 0 && <span className="notification-dot"></span>}</IconButton>
            <div className="topbar-divider"></div>
            <button className="top-profile" onClick={() => navigate('profile')}><Avatar small /><span>Guillaume</span><Icon name="chevron" size={15} /></button>
          </div>
        </header>
        {mobileMenuOpen && <div className="mobile-menu-panel">{navItems.map((item) => <button key={item.id} className={activeView === item.id ? 'active' : ''} onClick={() => navigate(item.id)}><Icon name={item.icon} size={17} />{item.label}{item.id === 'notifications' && unreadCount > 0 && <b>{unreadCount}</b>}</button>)}<button className={activeView === 'profile' ? 'active' : ''} onClick={() => navigate('profile')}><Avatar small />Mon profil</button></div>}
        <div className="content-wrap">{renderView()}</div>
        {toast && <div className="toast" role="status">{toast}</div>}
        <BottomNav items={navItems.slice(0, 4)} activeView={activeView} onNavigate={navigate} profileActive={activeView === 'profile'} />
      </main>
    </div>
  )
}

function PageTitle({ eyebrow, title, description, action }) {
  return <SectionHeader eyebrow={eyebrow} title={title} description={description} action={action} className="page-heading" />
}

function HomeView({ navigate, savedEvents, toggleEvent, showToast }) {
  return <div className="view home-view">
    <section className="welcome-row">
      <div><div className="eyebrow">Jeudi 18 septembre 2026</div><h1>Bonjour Guillaume <span className="wave">✦</span></h1><p className="welcome-copy">Voici ce qui mérite ton attention aujourd’hui.</p></div>
      <button className="soft-action" onClick={() => navigate('profile')}><Icon name="spark" size={16} /> Personnaliser mon accueil</button>
    </section>

    <section className="hero-grid">
      <div className="hero-card">
        <div className="hero-orb orb-one"></div><div className="hero-orb orb-two"></div>
        <div className="hero-content"><div className="hero-kicker"><span className="live-dot"></span> Ton aperçu personnalisé</div><h2>Une semaine claire,<br /><em>sans bruit.</em></h2><p>3 infos utiles sélectionnées pour toi parmi la vie du campus.</p><button className="hero-link" onClick={() => navigate('notifications')}>Voir mes notifications <Icon name="arrow" size={16} /></button></div>
        <div className="hero-count"><ProgressRing value={72} size={72} label="03" /><span>À découvrir</span></div>
      </div>
      <Card className="focus-card">
        <div className="card-head"><span className="section-kicker">À ne pas manquer</span><button className="circle-action" onClick={() => navigate('agenda')} aria-label="Voir l’agenda"><Icon name="arrow" size={16} /></button></div>
        <div className="focus-date"><strong>18</strong><span>SEP<br />JEU</span></div>
        <div className="focus-info"><h3>Atelier CV & portfolio</h3><p><Icon name="location" size={14} /> Bâtiment B · Salle 204</p><p><span className="time-dot"></span> 18:00 — 19:30</p></div>
        <div className="focus-footer"><span className="tag tag-coral">Places limitées</span><button className={`bookmark-button ${savedEvents.includes(1) ? 'saved' : ''}`} onClick={() => toggleEvent(1)} aria-label="Ajouter à mon agenda"><Icon name="bookmark" size={17} /></button></div>
      </Card>
    </section>

    <section className="section-block"><div className="section-heading"><div><div className="eyebrow">Sélection Campus+</div><h2>Pour toi cette semaine</h2></div><button className="text-button" onClick={() => navigate('agenda')}>Tout voir <Icon name="arrow" size={15} /></button></div><div className="event-grid">{events.map((event) => <EventCard key={event.id} event={event} saved={savedEvents.includes(event.id)} onToggle={() => toggleEvent(event.id)} onDetail={() => { navigate('agenda'); showToast(`${event.title} ouvert dans l’agenda.`) }} />)}</div></section>

    <section className="lower-grid">
      <div className="quick-card panel-card"><div className="card-head"><div><div className="eyebrow">Accès rapide</div><h3>De quoi as-tu besoin ?</h3></div><Icon name="spark" size={19} /></div><div className="quick-actions"><button onClick={() => navigate('search')}><span className="quick-icon coral-bg"><Icon name="search" size={18} /></span><span><strong>Trouver une salle</strong><small>Disponible autour de toi</small></span><Icon name="arrow" size={15} /></button><button onClick={() => navigate('map')}><span className="quick-icon mint-bg"><Icon name="compass" size={18} /></span><span><strong>Explorer le campus</strong><small>Services et lieux utiles</small></span><Icon name="arrow" size={15} /></button><button onClick={() => navigate('notifications')}><span className="quick-icon lavender-bg"><Icon name="bell" size={18} /></span><span><strong>Mes notifications</strong><small>3 nouvelles informations</small></span><Icon name="arrow" size={15} /></button></div></div>
      <div className="agenda-card panel-card"><div className="card-head"><div><div className="eyebrow">Agenda</div><h3>Les prochains jours</h3></div><button className="circle-action ghost" onClick={() => navigate('agenda')}><Icon name="arrow" size={16} /></button></div><div className="mini-agenda">{events.slice(0, 3).map((event) => <div className="mini-event" key={event.id}><div className={`mini-date ${event.color}`}><strong>{event.day}</strong><span>{event.month}</span></div><div><strong>{event.title}</strong><small>{event.time} · {event.place.split(' · ')[0]}</small></div><span className="mini-event-dot"></span></div>)}</div></div>
    </section>
  </div>
}

function EventCard({ event, saved, onToggle, onDetail }) {
  return <article className={`event-card ${event.color}`}><div className="event-card-top"><span className={`tag tag-${event.color}`}>{event.tag}</span><button className={`bookmark-button ${saved ? 'saved' : ''}`} onClick={onToggle} aria-label="Ajouter à mon agenda"><Icon name="bookmark" size={17} /></button></div><div className="event-date-line"><strong>{event.day}</strong><span>{event.month}</span><div className="date-rule"></div><span>{event.time}</span></div><h3>{event.title}</h3><p><Icon name="location" size={14} /> {event.place}</p><button className="event-detail" onClick={onDetail}>Voir le détail <Icon name="arrow" size={14} /></button></article>
}

function SearchView({ query, setQuery, results, navigate, searchFilter, setSearchFilter, onResultOpen, showToast }) {
  function cycleFilter() {
    const filters = ['Tous', 'Salle', 'Événement', 'Service', 'Ressource']
    const next = filters[(filters.indexOf(searchFilter) + 1) % filters.length]
    setSearchFilter(next)
    showToast(next === 'Tous' ? 'Tous les types de résultats sont affichés.' : `Filtre « ${next} » activé.`)
  }

  return <div className="view"><PageTitle eyebrow="Recherche améliorée" title="Trouver, sans fouiller." description="Une recherche transversale pour accéder directement à la bonne information." action={<button className="soft-action" onClick={() => navigate('map')}><Icon name="location" size={16} /> Autour de moi</button>} />
    <div className="search-shell"><div className="search-input-wrap large"><Icon name="search" size={22} /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Une salle, un service, un événement…" /><kbd>⌘ K</kbd>{query && <button onClick={() => setQuery('')} className="clear-search"><Icon name="close" size={15} /></button>}</div><div className="search-suggestions"><span>Suggestions</span><button onClick={() => setQuery('Salle 204')}>Salle 204</button><button onClick={() => setQuery('Atelier')}>Atelier</button><button onClick={() => setQuery('Bureau')}>Bureau des stages</button></div></div>
    <div className="search-results-head"><div><div className="eyebrow">Résultats instantanés</div><h2>{query ? `${results.length} résultat${results.length > 1 ? 's' : ''} pour « ${query} »` : 'Ce que les étudiants recherchent souvent'}</h2></div><button className="filter-button" onClick={cycleFilter}><Icon name="filter" size={16} /> {searchFilter === 'Tous' ? 'Filtrer' : searchFilter}</button></div>
    <div className="results-grid">{results.length ? results.map((result) => <article className="result-card" key={result.id}><div className={`result-icon ${result.color}-bg`}>{result.icon}</div><div className="result-copy"><span className="result-type">{result.type}</span><h3>{result.title}</h3><p>{result.detail}</p></div><button className="result-arrow" onClick={() => onResultOpen(result)} aria-label={`Ouvrir ${result.title}`}><Icon name="arrow" size={16} /></button></article>) : <div className="empty-state"><div className="empty-icon">⌕</div><h3>Aucun résultat pour le moment</h3><p>Essaie avec un lieu, un service ou un événement.</p></div>}</div>
    <div className="search-tip"><Icon name="spark" size={17} /><span><strong>Astuce :</strong> Campus+ cherche dans les lieux, les événements et les services en même temps.</span></div>
  </div>
}

function AgendaView({ selectedDay, setSelectedDay, savedEvents, toggleEvent, events: agendaEvents, onAddEvent }) {
  const days = ['Cette semaine', 'Lun 21', 'Mar 22', 'Mer 23']
  return <div className="view"><PageTitle eyebrow="Agenda étudiant" title="Ton agenda, au même endroit." description="Les temps forts du campus et tes rendez-vous importants." action={<button className="primary-button" onClick={onAddEvent}><span>+</span> Ajouter un événement</button>} /><div className="day-tabs">{days.map((day) => <button key={day} className={selectedDay === day ? 'active' : ''} onClick={() => setSelectedDay(day)}>{day}</button>)}</div><div className="agenda-layout"><div className="agenda-main"><div className="agenda-date-label"><span>JEUDI 18 SEPTEMBRE</span><div></div><small>{agendaEvents.length} événements</small></div>{agendaEvents.map((event) => <article className="agenda-row" key={event.id}><div className={`agenda-date ${event.color}`}><strong>{event.day}</strong><span>{event.month}</span></div><div className="agenda-row-content"><div><span className={`tag tag-${event.color}`}>{event.tag}</span><h3>{event.title}</h3><p><Icon name="location" size={14} /> {event.place} <span className="bullet-separator">·</span> {event.time}</p></div><button className={`outline-button ${savedEvents.includes(event.id) ? 'selected' : ''}`} onClick={() => toggleEvent(event.id)}>{savedEvents.includes(event.id) ? <><Icon name="check" size={15} /> Ajouté</> : <><Icon name="bookmark" size={15} /> Ajouter</>}</button></div></article>)}</div><aside className="agenda-side panel-card"><div className="eyebrow">Ton rythme</div><h3>Tu as une semaine plutôt équilibrée.</h3><div className="rhythm-chart"><span style={{ height: '42%' }}></span><span style={{ height: '65%' }}></span><span style={{ height: '38%' }}></span><span style={{ height: '82%' }}></span><span style={{ height: '55%' }}></span><span style={{ height: '68%' }}></span><span style={{ height: '32%' }}></span></div><div className="chart-labels"><span>L</span><span>M</span><span>M</span><span>J</span><span>V</span><span>S</span><span>D</span></div><div className="agenda-insight"><Icon name="spark" size={15} /><span>Jeudi est ta journée la plus chargée.</span></div></aside></div></div>
}

function MapView({ selectedPlace, setSelectedPlace, mapQuery, setMapQuery, savedPlaces, toggleSavedPlace, showToast }) {
  const [zoom, setZoom] = useState(1)
  const places = [{ name: 'Bibliothèque', type: 'Travail & ressources', x: '31%', y: '31%', color: 'coral' }, { name: 'Bâtiment B', type: 'Cours & ateliers', x: '65%', y: '24%', color: 'mint' }, { name: 'Maison des étudiants', type: 'Vie associative', x: '72%', y: '68%', color: 'lavender' }, { name: 'Cafétéria centrale', type: 'Manger & faire une pause', x: '33%', y: '72%', color: 'amber' }]
  const filteredPlaces = places.filter((place) => !mapQuery.trim() || `${place.name} ${place.type}`.toLowerCase().includes(mapQuery.toLowerCase()))
  const activePlace = places.find((place) => place.name === selectedPlace) || places[0]
  const isSaved = savedPlaces.includes(activePlace.name)

  function locate() {
    setSelectedPlace('Bibliothèque')
    showToast('Position simulée : 4 min de la bibliothèque.')
  }

  return <div className="view"><PageTitle eyebrow="Carte du campus" title="Tout est à portée de main." description="Les lieux utiles autour de toi, avec leur usage et leur état en un coup d’œil." action={<button className="soft-action" onClick={locate}><Icon name="location" size={16} /> Me localiser</button>} /><div className="map-layout"><div className="campus-map"><div className="map-toolbar"><div className="search-input-wrap"><Icon name="search" size={16} /><input value={mapQuery} onChange={(event) => setMapQuery(event.target.value)} placeholder="Rechercher un lieu" /></div><button className="map-filter" onClick={() => showToast('Filtres campus affichés dans cette maquette.')} aria-label="Filtrer les lieux"><Icon name="filter" size={16} /></button></div><div className="map-canvas"><div className="map-content-layer" style={{ transform: `scale(${zoom})` }}><div className="map-grid"></div><div className="map-road road-a"></div><div className="map-road road-b"></div><div className="map-park park-a"></div><div className="map-park park-b"></div><div className="map-building building-a">A</div><div className="map-building building-b">B</div><div className="map-building building-c">C</div>{filteredPlaces.map((place) => <button className={`map-pin ${place.name === activePlace.name ? 'active' : ''}`} style={{ left: place.x, top: place.y }} onClick={() => setSelectedPlace(place.name)} key={place.name}><span className={`pin-dot ${place.color}`}></span><span>{place.name}</span></button>)}{!filteredPlaces.length && <div className="map-no-results">Aucun lieu trouvé</div>}<div className="you-are-here"><span></span>Toi</div></div><div className="map-zoom"><button onClick={() => setZoom((current) => Math.min(1.25, Number((current + 0.1).toFixed(2))))} aria-label="Zoomer">+</button><button onClick={() => setZoom((current) => Math.max(0.85, Number((current - 0.1).toFixed(2))))} aria-label="Dézoomer">−</button></div></div></div><aside className="place-panel"><div className="eyebrow">Lieu sélectionné</div><div className={`place-art ${activePlace.color}`}><div className="place-art-circle"></div><div className="place-art-label">{activePlace.name.charAt(0)}</div></div><h2>{activePlace.name}</h2><p className="place-type">{activePlace.type}</p><div className="place-status"><span className="status-dot"></span><strong>Ouvert maintenant</strong><span>jusqu’à 20:00</span></div><div className="place-facts"><div><span>Distance</span><strong>4 min à pied</strong></div><div><span>Affluence</span><strong className="green-text">Faible</strong></div></div><button className="primary-button full-width" onClick={() => showToast(`Itinéraire simulé vers ${activePlace.name}.`)}>Itinéraire <Icon name="arrow" size={16} /></button><button className="outline-button full-width" onClick={() => toggleSavedPlace(activePlace.name)}><Icon name="bookmark" size={15} /> {isSaved ? 'Lieu enregistré' : 'Enregistrer le lieu'}</button></aside></div></div>
}

function NotificationsView({ notifications, markAllRead, notificationFilter, setNotificationFilter, preferences, setPreferences, showToast }) {
  const filteredNotifications = notifications.filter((notification) => {
    if (notificationFilter === 'Non lues') return notification.unread
    if (notificationFilter === 'Agenda') return notification.type === 'agenda'
    if (notificationFilter === 'Campus') return notification.type === 'campus'
    return true
  })

  return <div className="view"><PageTitle eyebrow="Notifications intelligentes" title="Ce qui mérite ton attention." description="Des informations utiles, au bon moment — pas une avalanche de notifications." action={<button className="text-button" onClick={markAllRead}><Icon name="check" size={15} /> Tout marquer comme lu</button>} /><div className="notification-layout"><div className="notification-main"><div className="notification-tabs">{['Toutes', 'Non lues', 'Agenda', 'Campus'].map((tab) => <button key={tab} className={notificationFilter === tab ? 'active' : ''} onClick={() => setNotificationFilter(tab)}>{tab}{(tab === 'Toutes' || tab === 'Non lues') && <span>{tab === 'Toutes' ? notifications.length : notifications.filter((item) => item.unread).length}</span>}</button>)}</div>{filteredNotifications.length ? filteredNotifications.map((notification) => <article className={`notification-row ${notification.unread ? 'unread' : ''}`} key={notification.id}><div className={`notification-icon ${notification.color}-bg`}><Icon name={notification.type === 'agenda' ? 'bookmark' : notification.type === 'campus' ? 'location' : 'bell'} size={17} /></div><div className="notification-copy"><div className="notification-title"><h3>{notification.title}</h3>{notification.unread && <span className="unread-pill">Nouveau</span>}</div><p>{notification.body}</p><small>{notification.time}</small></div><button className="more-button" onClick={() => showToast(`Options ouvertes pour « ${notification.title} ».`)} aria-label={`Options pour ${notification.title}`}>•••</button></article>) : <div className="empty-state"><div className="empty-icon">✓</div><h3>Aucune notification dans ce filtre</h3><p>Tout est calme pour le moment.</p></div>}</div><aside className="notification-settings panel-card"><div className="eyebrow">À ton rythme</div><h3>Garde uniquement les notifications utiles.</h3><p>Choisis ce qui doit te trouver, même quand tu ne penses pas à ouvrir Campus+.</p><Toggle label="Actualités de ton agenda" value={preferences.agenda} onChange={(value) => updatePreference('agenda', value)} /><Toggle label="Infos importantes du campus" value={preferences.push} onChange={(value) => updatePreference('push', value)} /><Toggle label="Nouveaux lieux autour de toi" value={preferences.places} onChange={(value) => updatePreference('places', value)} /><button className="outline-button full-width" onClick={() => showToast('Préférences de notifications enregistrées.')}>Gérer mes préférences</button></aside></div></div>
}

function Toggle({ label, value, onChange }) {
  const [localChecked, setLocalChecked] = useState(value)
  const checked = onChange ? value : localChecked
  function toggle() {
    if (onChange) onChange(!value)
    else setLocalChecked((current) => !current)
  }
  return <button className="toggle-row" onClick={toggle} aria-pressed={checked}><span>{label}</span><span className={`toggle ${checked ? 'on' : ''}`}><span></span></span></button>
}

function ProfileView({ profileEdit, setProfileEdit, preferences, setPreferences }) {
  const updatePreference = (key, value) => setPreferences((current) => ({ ...current, [key]: value }))
  return <div className="view"><PageTitle eyebrow="Profil étudiant" title="Un campus qui te ressemble." description="Tes préférences permettent à Campus+ de filtrer l’essentiel pour toi." action={<button className="soft-action" onClick={() => setProfileEdit(!profileEdit)}>{profileEdit ? 'Terminer' : 'Modifier mon profil'}</button>} /><div className="profile-grid"><section className="profile-main panel-card"><div className="profile-cover"><div className="profile-pattern"></div><Avatar initials="GLS" /></div><div className="profile-body"><div className="profile-title-row"><div><h2>Guillaume Le Saux</h2><p>M2 · Product Management</p></div><span className="profile-status"><span className="status-dot"></span> Profil complété à 80 %</span></div><div className="profile-details"><div><span>Établissement</span><strong>Campus Lyon Tech</strong></div><div><span>Année</span><strong>2026 — 2027</strong></div><div><span>Langue préférée</span><strong>Français</strong></div><div><span>Centre d’intérêt</span><strong>Produit · Design · Tech</strong></div></div>{profileEdit && <div className="edit-note"><Icon name="spark" size={16} /> Les champs sont simulés dans cette maquette : aucune donnée n’est enregistrée sur un serveur.</div>}</div></section><aside className="profile-side"><div className="digital-card"><div className="digital-card-top"><span>Campus+</span><span>2026 / 27</span></div><div className="digital-card-middle"><div className="digital-avatar">GLS</div><div><strong>Guillaume Le Saux</strong><span>M2 · Product Management</span></div></div><div className="qr-code"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div><div className="digital-card-bottom"><span>Carte étudiante numérique</span><strong>CM-264-981</strong></div></div><div className="preferences-card panel-card"><div className="eyebrow">Personnalisation</div><h3>Ce que Campus+ peut anticiper</h3><Toggle label="Notifications intelligentes" value={preferences.push} /><Toggle label="Agenda et rappels" value={preferences.agenda} /><Toggle label="Suggestions de lieux" value={preferences.places} /></div></aside></div></div>
}

createRoot(document.getElementById('root')).render(<App />)
