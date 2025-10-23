export interface LocalSession {
  email: string;
  createdAt: string;
}

const KEY = "local_auth_session";

export const localAuth = {
  getSession(): LocalSession | null {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  signIn(email: string, _password: string): LocalSession {
    const session = { email, createdAt: new Date().toISOString() };
    localStorage.setItem(KEY, JSON.stringify(session));
    return session;
  },
  signUp(email: string, _password: string): LocalSession {
    const session = { email, createdAt: new Date().toISOString() };
    localStorage.setItem(KEY, JSON.stringify(session));
    return session;
  },
  signOut() {
    localStorage.removeItem(KEY);
  }
};
