import { notifications } from '../data/catalog'
import { useState } from 'react'

export default function NotificationCenter({ open, onClear }) {
  const [items, setItems] = useState(notifications)
  const [expanded, setExpanded] = useState(false)
  const clear = () => { setItems([]); onClear() }
  const hiddenCount = Math.max(items.length - 3, 0)

  return (
    <aside className={`notification-center ${open ? 'notification-open' : ''}`}>
      <header>
        <div>
          <p className="eyebrow mb-1">NOTIFICATIONS</p>
          <h2>Recent</h2>
        </div>
        <button onClick={clear}>Clear all</button>
      </header>

      <div className={`notification-stack ${!expanded ? 'notification-collapsed' : ''}`}>
        {items.length ? (
          items.map((notification) => (
            <article key={notification.title} className="notification-card">
              <div>
                <span className="app-badge">N</span>
                <b>NOIR</b>
                <time>{notification.time}</time>
              </div>
              <p><strong>{notification.title}</strong><br />{notification.text}</p>
            </article>
          ))
        ) : (
          <article className="notification-card notification-empty">
            <p>You're all caught up.</p>
          </article>
        )}
      </div>

      {hiddenCount > 0 && (
        <button className="notification-more" onClick={() => setExpanded((e) => !e)}>
          {expanded ? 'Show less' : `${hiddenCount} more`}
        </button>
      )}
    </aside>
  )
}