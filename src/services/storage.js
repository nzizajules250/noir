const PREFIX = 'noir.'

export function readStorage(key, fallback) {
  try {
    const value = window.localStorage.getItem(`${PREFIX}${key}`)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

export function writeStorage(key, value) {
  window.localStorage.setItem(`${PREFIX}${key}`, JSON.stringify(value))
}
