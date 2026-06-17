export type AnonymousSession = {
  createdAt: string;
};

const KEY = "anonymous_session";

export function createAnonymousSession() {
  const payload: AnonymousSession = { createdAt: new Date().toISOString() };
  try {
    localStorage.setItem(KEY, JSON.stringify(payload));
  } catch {
    // no-op for environments where localStorage is unavailable
  }
}

export function hasAnonymousSession(): boolean {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw) as AnonymousSession;
    return Boolean(parsed?.createdAt);
  } catch {
    return false;
  }
}

export function clearAnonymousSession() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}
