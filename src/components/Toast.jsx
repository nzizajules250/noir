export default function Toast({ message }) {
  return <div aria-live="polite" className={`toast ${message ? 'toast-visible' : ''}`}>
    <div><span className="app-badge">N</span><b>NOIR</b><time>now</time></div>
    <p>{message}</p>
  </div>
}
