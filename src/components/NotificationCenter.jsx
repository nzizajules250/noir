import { notifications } from '../data/catalog'

export default function NotificationCenter({ open, onClear }) {
  return <aside className={`notification-center ${open ? 'notification-open' : ''}`}>
    <header><div><p className="eyebrow mb-1">NOTIFICATIONS</p><h2>Recent</h2></div><button onClick={onClear}>Clear all</button></header>
    <div className="notification-stack">
      {notifications.map((notification) => <article key={notification.title} className="notification-card"><div><span className="app-badge">N</span><b>NOIR</b><time>{notification.time}</time></div><p><strong>{notification.title}</strong><br />{notification.text}</p></article>)}
    </div>
  </aside>
}
