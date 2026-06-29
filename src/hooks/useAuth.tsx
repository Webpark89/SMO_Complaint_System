import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  mockAuth,
  type MockSession,
  type MockUser,
} from "@/services/mock/auth";

export type AppRole =
  | "super-admin"
  | "admin"
  | "hr"
  | "compliance"
  | "manager"
  | "auditor"
  | "employee";

interface AuthCtx {
  user: MockUser | null;
  session: MockSession | null;
  roles: AppRole[];
  loading: boolean;
  isStaff: boolean;
  canViewSensitive: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName?: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInMock?: () => void;
  signInAdminMock?: () => void;
  signOutMock?: () => void;
  hasAnyRole: (allowed: AppRole[]) => boolean;
}

const Ctx = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);
  const [session, setSession] = useState<MockSession | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = mockAuth.subscribe((nextSession) => {
      applySession(nextSession);
    });

    mockAuth.getSession().then((nextSession) => {
      applySession(nextSession);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  function applySession(nextSession: MockSession | null) {
    setSession(nextSession);
    setUser(nextSession?.user ?? null);
    setRoles(nextSession ? mockAuth.getRoles(nextSession.user.id) : []);
  }

  const isStaff = roles.some((r) =>
    ["super-admin", "admin", "hr", "compliance", "manager", "auditor"].includes(r)
  );
  
  const canViewSensitive = roles.some((r) =>
    ["super-admin", "admin", "compliance"].includes(r)
  );

  // ฟังก์ชันเช็คสิทธิ์ที่เพิ่มเข้ามาใหม่
  const hasAnyRole = (allowed: AppRole[]) => {
    return roles.some((r) => allowed.includes(r));
  };

  async function signIn(email: string, password: string) {
    await mockAuth.signIn(email, password);
  }

  async function signUp(email: string, password: string, fullName?: string) {
    await mockAuth.signUp(email, password, fullName);
  }

  async function signOut() {
    await mockAuth.signOut();
  }

  function signInMock() {
    mockAuth.signInDemo();
  }

  function signInAdminMock() {
    mockAuth.signInAdminDemo();
  }

  function signOutMock() {
    void signOut();
  }

  // Return แค่ครั้งเดียว ด้านล่างสุดของ Component
  return (
    <Ctx.Provider
      value={{
        user,
        session,
        roles,
        loading,
        isStaff,
        canViewSensitive,
        signIn,
        signUp,
        signOut,
        signInMock,
        signInAdminMock,
        signOutMock,
        hasAnyRole, // ส่งฟังก์ชันลง Provider ตรงนี้
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used inside AuthProvider");
  return v;
}