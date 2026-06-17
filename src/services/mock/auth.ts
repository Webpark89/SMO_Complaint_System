import { mockUser } from "@/mock/auth/user";
import type { AppRole } from "@/hooks/useAuth";

export type MockUser = {
  id: string;
  email: string;
  user_metadata: {
    full_name?: string;
    role?: AppRole;
  };
};

export type MockSession = {
  user: MockUser;
  access_token: string;
};

type AuthListener = (session: MockSession | null) => void;

const SESSION_KEY = "mock_session";

const listeners = new Set<AuthListener>();

function isBrowser() {
  return typeof window !== "undefined" || typeof document !== "undefined";
}

function loadSession(): MockSession | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as MockSession) : null;
  } catch {
    return null;
  }
}

function saveSession(session: MockSession | null) {
  if (!isBrowser()) return;
  try {
    if (session) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  } catch {
    // localStorage may be unavailable (e.g. private browsing, storage full)
  }
}

export const mockAuth = {
  async getSession() {
    return loadSession();
  },

  async signIn(email: string, _password: string) {
    const session = createSession({
      id: emailToId(email),
      email,
      fullName: email.split("@")[0],
      role: "employee",
    });
    saveSession(session);
    notify(session);
    return { session };
  },

  async signUp(email: string, _password: string, fullName?: string) {
    const session = createSession({
      id: emailToId(email),
      email,
      fullName: fullName || email.split("@")[0],
      role: "employee",
    });
    saveSession(session);
    notify(session);
    return { session };
  },

  async signOut() {
    saveSession(null);
    notify(null);
  },

  signInDemo() {
    const session = createSession({
      id: mockUser.id,
      email: mockUser.email,
      fullName: mockUser.name,
      role: "employee",
    });
    saveSession(session);
    notify(session);
    return session;
  },

  signInAdminDemo() {
    const session = createSession({
      id: "SUPER-ADMIN-0001",
      email: "super.admin@example.com",
      fullName: "Admin",
      role: "admin",
    });
    saveSession(session);
    notify(session);
    return session;
  },

  getRoles(userId: string): AppRole[] {
    if (userId === mockUser.id) return ["employee"];
    const s = loadSession();
    return [s?.user.user_metadata.role ?? "employee"];
  },

  subscribe(listener: AuthListener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};

function createSession(input: {
  id: string;
  email: string;
  fullName: string;
  role: AppRole;
}): MockSession {
  return {
    user: {
      id: input.id,
      email: input.email,
      user_metadata: {
        full_name: input.fullName,
        role: input.role,
      },
    },
    access_token: `mock-token-${input.id}`,
  };
}

function emailToId(email: string) {
  return `mock-user-${email
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")}`;
}

function notify(s: MockSession | null) {
  listeners.forEach((listener) => listener(s));
}
